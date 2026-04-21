import { useState, useEffect } from 'react';

const useFetch = (fetchFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunction();
      setData(result);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching data');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetchFunction) {
      fetchData();
    }
  }, dependencies);

  const refetch = () => {
    if (fetchFunction) {
      fetchData();
    }
  };

  return {
    data,
    loading,
    error,
    refetch
  };
};

export default useFetch;
