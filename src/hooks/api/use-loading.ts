import { useState, useCallback } from 'react';
import { useLoadingStore } from '~/store/loading-store';

interface UseLoadingOptions {
  scope?: string;
  message?: string;
}

export const useApiLoading = (options: UseLoadingOptions = {}) => {
  const { setLoading } = useLoadingStore();
  const [localLoading, setLocalLoading] = useState(false);

  const withLoading = useCallback(async <T>(
    asyncFunction: () => Promise<T>,
    loadingMessage?: string
  ): Promise<T> => {
    const message = loadingMessage || options.message || 'Loading...';
    
    try {
      setLocalLoading(true);
      setLoading(true, message);
      
      const result = await asyncFunction();
      return result;
    } finally {
      setLocalLoading(false);
      setLoading(false);
    }
  }, [setLoading, options.message]);

  const startLoading = useCallback((message?: string) => {
    setLocalLoading(true);
    setLoading(true, message || options.message || 'Loading...');
  }, [setLoading, options.message]);

  const stopLoading = useCallback(() => {
    setLocalLoading(false);
    setLoading(false);
  }, [setLoading]);

  return {
    isLoading: localLoading,
    withLoading,
    startLoading,
    stopLoading,
  };
};