import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleRequest = useCallback(async (apiFunc, ...args) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFunc(...args);
      return response;
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      }
      setError(err.response?.data?.message || 'Something went wrong');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [logout, navigate]);

  return { loading, error, handleRequest };
}; 