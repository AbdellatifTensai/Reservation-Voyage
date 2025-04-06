import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { getApiEndpoint, transformRequestData, transformResponseData } from "./api-adapter";

// Create a custom event for backend changes
export const backendChangeEvent = new Event('backendChange');

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Transform the URL to use the correct backend API endpoint
  const adaptedUrl = getApiEndpoint(url);
  
  // Transform the request data if needed
  const adaptedData = data ? transformRequestData(data) : undefined;
  
  const res = await fetch(adaptedUrl, {
    method,
    headers: adaptedData ? { "Content-Type": "application/json" } : {},
    body: adaptedData ? JSON.stringify(adaptedData) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Transform the URL to use the correct backend API endpoint
    const adaptedUrl = getApiEndpoint(queryKey[0] as string);
    
    const res = await fetch(adaptedUrl, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    const data = await res.json();
    
    // Transform the response data if needed
    return transformResponseData(data);
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: true,
      staleTime: 0, // Don't cache user state
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

// Listen for backend changes and invalidate all queries
window.addEventListener('backendChange', () => {
  console.log('Backend changed, invalidating all queries');
  queryClient.invalidateQueries();
});
