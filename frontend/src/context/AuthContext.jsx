import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';
import { toast } from '../components/ui/Toast';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";


const AuthContext = createContext(null);

// Token expiration threshold (15 minutes before actual expiration)
const TOKEN_REFRESH_THRESHOLD = 15 * 60 * 1000; // 15 minutes in milliseconds

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokenExpiryTimer, setTokenExpiryTimer] = useState(null);
  const navigate = useNavigate();

  // Clear any existing timer when component unmounts
  useEffect(() => {
    return () => {
      if (tokenExpiryTimer) clearTimeout(tokenExpiryTimer);
    };
  }, [tokenExpiryTimer]);

  const setupTokenRefresh = useCallback((token) => {
    try {
      if (!token) return;

      // Clear any existing timer
      if (tokenExpiryTimer) clearTimeout(tokenExpiryTimer);

      // Decode token to get expiration time
      const decodedToken = jwtDecode(token);

      if (!decodedToken.exp) return;

      const expiryTime = decodedToken.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();

      // Calculate time until refresh (expiry time minus threshold)
      const timeUntilRefresh = expiryTime - currentTime - TOKEN_REFRESH_THRESHOLD;

      // Only set up refresh if token isn't already expired or too close to expiry
      if (timeUntilRefresh <= 0) {
        console.log('Token already expired or too close to expiry');
        localStorage.removeItem('token');
        setUser(null);
        return;
      }

      // Set up timer to refresh token before it expires
      const timer = setTimeout(() => refreshToken(), timeUntilRefresh);
      setTokenExpiryTimer(timer);

      console.log(`Token refresh scheduled in ${Math.round(timeUntilRefresh / 60000)} minutes`);
    } catch (error) {
      console.error('Error setting up token refresh:', error);
    }
  }, []);

  const refreshToken = async () => {
    try {
      const currentToken = localStorage.getItem('token');
      if (!currentToken) return;

      // Call refresh token API
      const data = await authAPI.refreshToken();

      if (data && data.token) {
        localStorage.setItem('token', data.token);
        setupTokenRefresh(data.token);

        // Update user data if needed
        if (data.user) {
          setUser(data.user);
        }

        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      // If refresh fails, log the user out
      logout();
      toast({
        title: "Session Expired",
        description: "Your session has expired. Please log in again.",
        variant: "default"
      });
      return false;
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const userData = await authAPI.getCurrentUser();
        setUser(userData);
        setupTokenRefresh(token);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const data = await authAPI.login(credentials);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      setupTokenRefresh(data.token);
      return data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const data = await authAPI.register(userData);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setupTokenRefresh(data.token);
      navigate('/dashboard');
      return data.user;
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error.response?.data?.message || "Registration failed",
        variant: "destructive"
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    if (tokenExpiryTimer) clearTimeout(tokenExpiryTimer);
    setUser(null);
    navigate('/login');
  };

  const updateUser = (userData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...userData
    }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      register,
      updateUser,
      refreshToken,
      isAuthenticated: !!user,
      isMentor: user?.role === 'mentor',
      isMentee: user?.role === 'mentee'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;