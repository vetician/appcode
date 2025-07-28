import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = 'http://192.168.218.232:3000/api'; // Update thicd s to your backend URL

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
  veterinarian: async (
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
  ) => {
    try {
      // Get the userId from AsyncStorage
      const userId = await AsyncStorage.getItem('userId');

      if (!userId) {
        throw new Error('User not authenticated');
      }

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
          identityProofUrl,
          userId: userId
        }),
      });
    } catch (error) {
      console.error('Error in veterinarian registration:', error);
      throw error; // Re-throw the error for handling in the calling function
    }
  },

  // Clinic register
  clinic: async (clinicData) => {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) throw new Error('User not authenticated');

    return await apiRequest('/auth/register-clinic', {
      method: 'POST',
      body: JSON.stringify({
        ...clinicData,
        userId
      }),
    });
  },

  // profile veterinarian
  profileVeterinarian: async () => {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) throw new Error('User not authenticated');

    return await apiRequest('/auth/veterinarian/profile-screen', {
      method: 'POST',
      body: JSON.stringify({
        userId
      }),
    });
  },

  // veterinarian check
  veterinarianCheck: async (userId) => {
    try {
      return await apiRequest('/auth/veterinarian/profile-screen', {
        method: 'POST',
        body: JSON.stringify({ userId }),
      });
    } catch (error) {
      console.error('Error checking verification:', error);
      throw error;
    }
  },

  // pet resort detail
  petResort: async (resortdetail) => {
    try {
      const userId = await AsyncStorage.getItem('userId')
      if (!userId) {
        throw new Error('User not authenticated');
      }
      return await apiRequest('/auth/petresort/register', {
        method: 'POST',
        body: JSON.stringify({ ...resortdetail, userId }),
      });
    } catch (error) {
      console.error('Error checking verification:', error);
      throw error;
    }
  },

  // Pet register
  pet: async (petData) => {
    try {
      return await apiRequest('/auth/pet-register', {
        method: 'POST',
        body: JSON.stringify({
          ...petData
        }),
      });
    } catch (error) {
      console.error('Error in pet registration:', error);
      throw error; // Re-throw the error for handling in the calling function
    }
  },

  // Add to authAPI object in authService.js
  getPetsByUserId: async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) throw new Error('User not authenticated');

      return await apiRequest(`/auth/pets/user/${userId}`, {
        method: 'POST',  // Changed from POST to GET since you're fetching data
      });
    } catch (error) {
      console.error('Error fetching pets:', error);
      throw error;
    }
  },

  // Verified clinics for pet parents
  getAllVerifiedClinics: async () => {
    return await apiRequest('/auth/petparent/verified/all-clinic', {
      method: 'POST',
    });
  },

  // Appointment Booking
  bookAppointment: async (bookingData) => {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) throw new Error('User not authenticated');

    return await authService.apiRequest('/auth/petparent/appointments/book', {
      method: 'POST',
      body: JSON.stringify({
        ...bookingData,
        userId
      }),
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