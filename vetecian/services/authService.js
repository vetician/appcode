// Real API service for authentication with Express/MongoDB backend

import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = 'http://192.168.101.4:3000/api'; // Update this to your backend URL

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
  signIn: async (email, password, loginType) => {
    return await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, loginType }),
    });
  },

  // Sign Up
  signUp: async (name, email, password, role = 'user') => {
    return await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    });
  },

  // Parent register
  parent: async (name, email, phone, address) => {
    return await apiRequest('/auth/parent-register', {
      method: 'POST',
      body: JSON.stringify({ name, email, phone, address }),
    });
  },

  // Veterinarian register
  veterinarian: async (title, name, gender, city, experience, specialization, profilePhotoUrl, qualification, qualificationUrl, registration, registrationUrl, identityProof, identityProofUrl) => {
    return await apiRequest('/auth/veterinarian-register', {
      method: 'POST',
      body: JSON.stringify({
        title,
        name,
        gender,
        city,
        experience,
        specialization,
        profilePhotoUrl,
        qualification,
        qualificationUrl,
        registration,
        registrationUrl,
        identityProof,
        identityProofUrl
      }),
    });
  },

  // Pet register
  pet: async ({ name, species, gender, dob, additionalData }) => {
    try {
      // Get the userId from AsyncStorage
      const userId = await AsyncStorage.getItem('userId');

      if (!userId) {
        throw new Error('User not authenticated');
      }

      // console.log(name, species, gender, dob)
      return await apiRequest('/auth/pet-register', {
        method: 'POST',
        body: JSON.stringify({
          name,
          species,
          gender,
          dob,
          userId: userId, // Explicitly include user ID in the body if needed
          ...additionalData,
        }),
      });
    } catch (error) {
      console.error('Error in pet registration:', error);
      throw error; // Re-throw the error for handling in the calling function
    }
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