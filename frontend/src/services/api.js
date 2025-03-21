import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Simple cache implementation for API responses
class ApiCache {
  constructor(maxAge = 5 * 60 * 1000) { // Default cache time: 5 minutes
    this.cache = new Map();
    this.maxAge = maxAge;
  }

  get(key) {
    const cachedItem = this.cache.get(key);
    if (!cachedItem) return null;
    
    const isExpired = Date.now() > cachedItem.timestamp + this.maxAge;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }
    
    return cachedItem.data;
  }

  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  invalidate(keyPattern) {
    // If keyPattern is a string, invalidate all keys that include it
    if (typeof keyPattern === 'string') {
      for (const key of this.cache.keys()) {
        if (key.includes(keyPattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      // If keyPattern is an exact key, just delete that one
      this.cache.delete(keyPattern);
    }
  }

  clear() {
    this.cache.clear();
  }
}

// Create cache instance
const apiCache = new ApiCache();

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Add this for CORS
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add cache logic to response handling
api.interceptors.request.use(
  (config) => {
    // Only cache GET requests
    if (config.method?.toLowerCase() !== 'get') return config;
    
    // Skip cache if explicitly requested
    if (config.skipCache) return config;
    
    // Create a cache key from the request
    const cacheKey = `${config.url}${JSON.stringify(config.params || {})}`;
    
    // Check cache
    const cachedResponse = apiCache.get(cacheKey);
    if (cachedResponse) {
      // Return cached response
      return {
        ...config,
        adapter: () => Promise.resolve({
          data: cachedResponse,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
          request: {}
        }),
        cached: true
      };
    }
    
    return config;
  }
);

// Store successful GET responses in cache
api.interceptors.response.use(
  (response) => {
    // Only cache GET requests that aren't already from cache
    if (response.config.method?.toLowerCase() === 'get' && !response.config.cached) {
      const cacheKey = `${response.config.url}${JSON.stringify(response.config.params || {})}`;
      apiCache.set(cacheKey, response.data);
    }
    
    return response;
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't redirect if it's a token refresh attempt that failed
    const isRefreshRequest = error.config?.url?.includes('/api/auth/refresh-token');
    
    if (error.response?.status === 401 && !isRefreshRequest) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (credentials) => {
    try {
      // Clear cache on login
      apiCache.clear();
      
      const response = await api.post('/api/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  register: async (userData) => {
    // Clear cache on register
    apiCache.clear();
    
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },
  getCurrentUser: async () => {
    try {
      const response = await api.get('/api/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  refreshToken: async () => {
    try {
      // Skip caching for token refresh
      const response = await api.post('/api/auth/refresh-token', {}, { skipCache: true });
      return response.data;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  },
  logout: async () => {
    // Clear cache on logout
    apiCache.clear();
    
    try {
      await api.post('/api/auth/logout');
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('token');
    }
  }
};

export const opportunityAPI = {
  getAll: () => api.get('/api/opportunities').then(res => res.data),
  getById: (id) => api.get(`/api/opportunities/${id}`).then(res => res.data),
  create: (data) => api.post('/api/opportunities', data).then(res => res.data),
  update: (id, data) => api.put(`/api/opportunities/${id}`, data).then(res => res.data),
  delete: (id) => api.delete(`/api/opportunities/${id}`).then(res => res.data),
  getMentorOpportunities: () => api.get('/api/opportunities/mentor/me').then(res => res.data),
  updateStatus: (id, status) => api.put(`/api/opportunities/${id}`, { status }).then(res => res.data)
};

export const mentorshipAPI = {
  getAllMentors: async () => {
    const response = await api.get('/api/mentor');
    return response.data;
  },
  
  sendRequest: async (data) => {
    const response = await api.post('/api/mentorship/request', data);
    return response.data;
  },
  
  getRequests: async () => {
    const response = await api.get('/api/mentorship/requests');
    return response.data;
  },
  
  getMyRequests: async () => {
    const response = await api.get('/api/mentorship/my-requests');
    return response.data;
  },
  
  acceptRequest: async (requestId) => {
    const response = await api.put(`/api/mentorship/request/${requestId}/accept`);
    return response.data;
  },
  
  rejectRequest: async (requestId) => {
    const response = await api.put(`/api/mentorship/request/${requestId}/reject`);
    return response.data;
  }
};

export const mentorAPI = {
  updateProfile: async (profileData) => {
    const response = await api.put('/api/mentor/profile', profileData);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/api/mentor/profile/me');
    return response.data;
  },

  updateContactSettings: async (settings) => {
    try {
      const response = await api.put('/api/mentor/contact-settings', settings);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getMentorshipRequests: async () => {
    try {
      const response = await api.get('/api/mentor/mentorship-requests');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  respondToRequest: async (requestId, status) => {
    try {
      const response = await api.put(`/api/mentor/mentorship-requests/${requestId}`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getMentees: async () => {
    try {
      const response = await api.get('/api/mentor/mentees');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getMenteeProgress: async (menteeId) => {
    try {
      const response = await api.get(`/api/mentor/mentees/${menteeId}/progress`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateMenteeGoals: async (menteeId, goals) => {
    try {
      const response = await api.put(`/api/mentor/mentees/${menteeId}/goals`, { goals });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  scheduleSession: async (menteeId, sessionData) => {
    try {
      const response = await api.post(`/api/mentor/mentees/${menteeId}/sessions`, sessionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getMentorStats: async () => {
    try {
      const response = await api.get('/api/mentor/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAvailability: async () => {
    try {
      const response = await api.get('/api/mentor/availability');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateAvailability: async (availability) => {
    try {
      const response = await api.put('/api/mentor/availability', availability);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getOpportunities: async () => {
    try {
      const response = await api.get('/api/mentor/opportunities');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createOpportunity: async (opportunityData) => {
    try {
      const response = await api.post('/api/mentor/opportunities', opportunityData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateOpportunity: async (opportunityId, updateData) => {
    try {
      const response = await api.put(`/api/mentor/opportunities/${opportunityId}`, updateData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteOpportunity: async (opportunityId) => {
    try {
      const response = await api.delete(`/api/mentor/opportunities/${opportunityId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export const dashboardAPI = {
  getStats: async () => {
    try {
      const response = await api.get('/api/dashboard/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getSessions: async () => {
    try {
      const response = await api.get('/api/dashboard/sessions');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getSessionById: async (sessionId) => {
    try {
      const response = await api.get(`/api/dashboard/sessions/${sessionId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  joinSession: async (sessionId) => {
    try {
      const response = await api.post(`/api/dashboard/sessions/${sessionId}/join`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createSession: async (sessionData) => {
    try {
      const response = await api.post('/api/dashboard/sessions', sessionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getGoals: async () => {
    try {
      const response = await api.get('/api/dashboard/goals');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createGoal: async (goalData) => {
    try {
      const response = await api.post('/api/dashboard/goals', goalData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateGoal: async (goalId, updateData) => {
    try {
      const response = await api.put(`/api/dashboard/goals/${goalId}`, updateData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteGoal: async (goalId) => {
    try {
      const response = await api.delete(`/api/dashboard/goals/${goalId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getMentorshipProgress: async (mentorshipId) => {
    try {
      const response = await api.get(`/api/dashboard/mentorship/${mentorshipId}/progress`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Add cache invalidation helpers
export const invalidateCache = (keyPattern) => {
  apiCache.invalidate(keyPattern);
};

export const clearCache = () => {
  apiCache.clear();
};

export default api; 