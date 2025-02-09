import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (credentials) => {
    try {
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
    const response = await api.get('/api/mentor/profile');
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

export default api; 