import { useState, useCallback } from 'react';
import { ClientResponseError } from 'pocketbase';
import { useNotification } from '../components/NotificationContext';

/**
 * Custom hook for handling API errors consistently across the application
 * 
 * Features:
 * - Extracts and formats PocketBase validation errors
 * - Shows toast notifications for errors
 * - Provides error state for displaying in UI
 * - Offers form-specific error handling
 */
export const useErrorHandler = () => {
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { addNotification } = useNotification();

  /**
   * Handle general API errors
   */
  const handleError = useCallback((err: unknown) => {
    // Reset existing errors
    setError(null);
    setFieldErrors({});
    
    // Handle PocketBase ClientResponseError
    if (err instanceof ClientResponseError) {
      // Handle validation errors
      if (err.response?.data?.data) {
        const validationErrors: Record<string, string> = {};
        let hasValidationErrors = false;
        
        Object.entries(err.response.data.data).forEach(([field, messages]) => {
          if (Array.isArray(messages) && messages.length > 0) {
            validationErrors[field] = messages[0];
            hasValidationErrors = true;
          }
        });
        
        if (hasValidationErrors) {
          setFieldErrors(validationErrors);
          addNotification('error', 'Please correct the errors in the form.');
          return;
        }
      }
      
      // Handle general API error
      setError(err.message);
      addNotification('error', err.message);
      return;
    }
    
    // Handle generic errors
    const errorMessage = err instanceof Error 
      ? err.message 
      : 'An unexpected error occurred';
    
    setError(errorMessage);
    addNotification('error', errorMessage);
  }, [addNotification]);

  /**
   * Clear all error states
   */
  const clearErrors = useCallback(() => {
    setError(null);
    setFieldErrors({});
  }, []);

  /**
   * Get error message for a specific form field
   */
  const getFieldError = useCallback((fieldName: string): string | undefined => {
    return fieldErrors[fieldName];
  }, [fieldErrors]);

  return {
    error,
    fieldErrors,
    handleError,
    clearErrors,
    getFieldError,
  };
};

export default useErrorHandler;