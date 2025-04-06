import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "@/lib/queryClient";

type ProtectedRouteProps = {
  path: string;
  component: React.ComponentType;
  adminOnly?: boolean;
};

export function ProtectedRoute({
  path,
  component: Component,
  adminOnly = false,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();

  // Immediately check for updated user data on route mount
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['/api/user'] });
  }, []);

  // Handle navigation if auth state changes
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    } else if (!isLoading && adminOnly && !user?.isAdmin) {
      navigate('/');
    }
  }, [user, isLoading, adminOnly, navigate]);

  return (
    <Route path={path}>
      {() => {
        if (isLoading) {
          return (
            <div className="flex items-center justify-center min-h-screen">
              <Loader2 className="h-8 w-8 animate-spin text-border" />
            </div>
          );
        }

        if (!user) {
          return <Redirect to="/auth" />;
        }

        if (adminOnly && !user.isAdmin) {
          return <Redirect to="/" />;
        }

        return <Component />;
      }}
    </Route>
  );
}
