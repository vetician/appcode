// Real API service for authentication with Express/MongoDB backend

const API_BASE_URL = 'http://192.168.101.2:3000/api'; // Update this to your backend URL

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  console.log(data)
  
  if (!response.ok) {
    throw new Error(data.message || 'An error occurred');
  }
  
  return data;
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your connection and try again.');
    }
    throw error;
  }
};

export const authAPI = {
  // Sign In
  signIn: async (email, password) => {
    return await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Sign Up
  signUp: async (name, email, password) => {
    return await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },
  
  // Parent register
  parent: async (name, email, phone, address) => {
    return await apiRequest('/auth/parent-register', {
      method: 'POST',
      body: JSON.stringify({ name, email, phone, address }),
    });
  },

  // Refresh Token
  refreshToken: async (refreshToken) => {
    return await apiRequest('/auth/refresh-token', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  },

  // Logout
  logout: async (token, refreshToken) => {
    return await apiRequest('/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ refreshToken }),
    });
  },

  // Logout from all devices
  logoutAll: async (token) => {
    return await apiRequest('/auth/logout-all', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  // Get User Profile
  getProfile: async (token) => {
    return await apiRequest('/user/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  // Update Profile
  updateProfile: async (token, userData) => {
    return await apiRequest('/user/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
  },

  // Change Password
  changePassword: async (token, currentPassword, newPassword) => {
    return await apiRequest('/user/change-password', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  // Delete Account
  deleteAccount: async (token) => {
    return await apiRequest('/user/account', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  // Health Check
  healthCheck: async () => {
    return await apiRequest('/health', {
      method: 'GET',
    });
  },
};

// Export API base URL for use in other parts of the app
export { API_BASE_URL };