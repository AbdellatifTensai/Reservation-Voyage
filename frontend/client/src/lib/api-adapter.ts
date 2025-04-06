/**
 * API Adapter for TrainEase
 * 
 * This module provides a common interface for interacting with either the Node.js
 * backend or the Java backend. It abstracts away the differences between the two
 * backends and handles the property name differences (isAdmin vs admin).
 */

import { useBackend } from '@/hooks/use-backend';
import { backendChangeEvent } from './queryClient';

// Export a hook to determine whether to use Java backend in React components
export const useJavaBackend = () => {
  const { backend } = useBackend();
  return backend === 'java';
};

// Here we need to avoid React hooks to avoid the rules of hooks error
// These functions can be called outside of React components,
// so we need a direct way to check which backend is in use
let _currentBackend: 'nodejs' | 'java' = 'nodejs';

// Function to be called from components to update the current backend
export function setCurrentBackend(backend: 'nodejs' | 'java') {
  const previousBackend = _currentBackend;
  _currentBackend = backend;
  
  // If the backend changed, dispatch the event to trigger query invalidation
  if (previousBackend !== backend) {
    // Dispatch event to notify that backend has changed
    window.dispatchEvent(backendChangeEvent);
    console.log(`Backend switched from ${previousBackend} to ${backend}`);
  }
}

/**
 * Gets the appropriate API endpoint based on the current backend setting
 */
export function getApiEndpoint(path: string): string {
  // If using Java backend, route through the Java API proxy
  if (_currentBackend === 'java') {
    // For Java backend, replace /api with /java-api
    return path.replace(/^\/api/, '/java-api');
  }
  
  // Return the original path for Node.js backend
  return path;
}

/**
 * Transforms outgoing request data to match the backend's expected format
 */
export function transformRequestData(data: any): any {
  if (!data) return data;
  
  const transformedData = { ...data };
  
  // For Java backend, transform isAdmin to admin if needed
  if (_currentBackend === 'java' && transformedData.isAdmin !== undefined) {
    transformedData.admin = transformedData.isAdmin;
    delete transformedData.isAdmin;
  }
  
  return transformedData;
}

/**
 * Transforms incoming response data to match the frontend's expected format
 */
export function transformResponseData(data: any): any {
  if (!data) return data;
  
  // Handle both arrays and single objects
  if (Array.isArray(data)) {
    return data.map(item => transformSingleItem(item));
  }
  
  return transformSingleItem(data);
}

/**
 * Helper function to transform a single data object
 */
function transformSingleItem(item: any): any {
  if (!item || typeof item !== 'object') return item;
  
  const transformedItem = { ...item };
  
  // For Java backend, transform admin to isAdmin if needed
  if (_currentBackend === 'java' && transformedItem.admin !== undefined) {
    transformedItem.isAdmin = transformedItem.admin;
    delete transformedItem.admin;
  }
  
  return transformedItem;
}