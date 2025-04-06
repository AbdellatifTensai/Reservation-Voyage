import { createContext, useState, useContext, ReactNode } from 'react';

// Define the backend type
type BackendType = 'nodejs' | 'java';

// Define the context type
type BackendContextType = {
  backend: BackendType;
  setBackend: React.Dispatch<React.SetStateAction<BackendType>>;
};

// Create the context with default values
const BackendContext = createContext<BackendContextType | null>(null);

// Create a provider component
export function BackendProvider({ children }: { children: ReactNode }) {
  const [backend, setBackend] = useState<BackendType>('nodejs');

  return (
    <BackendContext.Provider value={{ backend, setBackend }}>
      {children}
    </BackendContext.Provider>
  );
}

// Create a hook to use the context
export function useBackend() {
  const context = useContext(BackendContext);
  if (!context) {
    throw new Error('useBackend must be used within a BackendProvider');
  }
  return context;
}