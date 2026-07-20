import { useState, useCallback } from 'react';

const useApiCall = (serviceFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const response = await serviceFunction(...args);
      setData(response.data || response);
      return response.data || response;
    } catch (err) {
      setError(err.message || 'Une erreur est survenue');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [serviceFunction]);

  return { data, loading, error, execute };
};

export default useApiCall;
