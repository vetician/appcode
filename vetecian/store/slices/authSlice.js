import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Async thunks for authentication
export const signInUser = createAsyncThunk(
  'auth/signIn',
  async ({ email, password, loginType }, { rejectWithValue }) => {
    try {
      const response = await authAPI.signIn(email, password, loginType);
      await AsyncStorage.setItem('userId', response.user._id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Sign in failed');
    }
  }
);

export const signUpUser = createAsyncThunk(
  'auth/signUp',
  async ({ name, email, password, role = 'vetician' }, { rejectWithValue }) => {
    try {
      const response = await authAPI.signUp(name, email, password, role);
      await AsyncStorage.setItem('userId', response.user._id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Sign up failed');
    }
  }
);

export const parentUser = createAsyncThunk(
  'auth/parent',
  async ({ name, email, phone, address }, { rejectWithValue }) => {
    try {
      const response = await authAPI.parent(name, email, phone, address);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Parent register failed');
    }
  }
);

export const veterinarianUser = createAsyncThunk(
  'auth/veterinarian',
  async ({
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
  }, { rejectWithValue }) => {
    try {
      const response = await authAPI.veterinarian(
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
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Veterinarian registration failed');
    }
  }
);

export const registerPet = createAsyncThunk(
  'auth/pet',
  async (petData, { rejectWithValue }) => {
    try {
      // Required fields validation
      if (!petData.name || !petData.species || !petData.gender) {
        throw new Error('Missing required information');
      }

      // Validate date format if provided
      if (petData.dob && !isValidDate(petData.dob)) {
        throw new Error('Invalid date format. Please use YYYY-MM-DD');
      }

      // Prepare numeric fields
      const numericFields = ['height', 'weight'];
      const processedData = { ...petData };

      numericFields.forEach(field => {
        if (processedData[field]) {
          processedData[field] = Number(processedData[field]);
          if (isNaN(processedData[field])) {
            throw new Error(`${field} must be a valid number`);
          }
        }
      });

      return await authAPI.pet(processedData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Pet registration failed');
    }
  }
);

export const registerClinic = createAsyncThunk(
  'auth/clinic',
  async (clinicData, { rejectWithValue }) => {
    try {
      // Required field validation
      if (!clinicData.clinicName?.trim() || !clinicData.city?.trim() || !clinicData.streetAddress?.trim()) {
        return rejectWithValue({
          error: {
            message: 'Clinic name, city, and address are required',
            code: 400
          },
          success: false
        });
      }

      if (!clinicData.ownerProof) {
        return rejectWithValue({
          error: {
            message: 'Owner proof documentation is required',
            code: 400
          },
          success: false
        });
      }

      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        return rejectWithValue({
          error: {
            message: 'User not authenticated',
            code: 401
          },
          success: false
        });
      }

      const response = await authAPI.clinic({
        ...clinicData,
        userId,
        status: 'pending'
      });

      if (!response.success) {
        return rejectWithValue(response); // Pass through the entire error response
      }


      return response;

    } catch (error) {
      return rejectWithValue({
        error: {
          message: error.response?.data?.error?.message || 
                 error.message ||
                 'Clinic registration failed',
          code: error.response?.status || 500
        },
        success: false
      });
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    const { refreshToken } = getState().auth;
    if (!refreshToken) {
      return rejectWithValue('No refresh token available');
    }
    try {
      const response = await authAPI.refreshToken(refreshToken);
      return response;
    } catch (error) {
      return rejectWithValue('Session expired. Please login again.');
    }
  }
);

export const checkVeterinarianVerification = createAsyncThunk(
  'auth/checkVeterinarianVerification',
  async (_, { rejectWithValue }) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const response = await authAPI.veterinarianCheck(userId);

      if (!response.success) {
        throw new Error(response.message || 'Verification check failed');
      }

      return {
        isVerified: response.isVerified,
        message: response.message,
        veterinarianData: response.veterinarian
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Verification check failed');
    }
  }
);

export const checkClinicVerification = createAsyncThunk(
  'auth/checkClinicVerification',
  async (_, { rejectWithValue }) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const response = await authAPI.clinicVerificationCheck(userId);

      if (!response.success) {
        throw new Error(response.message || 'Clinic verification check failed');
      }

      return {
        isVerified: response.isVerified,
        message: response.message,
        clinicData: response.clinic,
        status: response.status
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Clinic verification check failed');
    }
  }
);

const initialState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  signUpSuccess: false,
  veterinarianVerification: null,
  clinicVerification: null,
  clinicRegistrationStatus: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signOut: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      state.veterinarianVerification = null;
      state.clinicVerification = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    resetClinicRegistration: (state) => {
      state.clinicRegistrationStatus = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Sign In
      .addCase(signInUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // Sign Up
      .addCase(signUpUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // Refresh Token
      .addCase(refreshToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.error = null;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      })

      // Check Veterinarian Verification
      .addCase(checkVeterinarianVerification.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkVeterinarianVerification.fulfilled, (state, action) => {
        state.isLoading = false;
        state.veterinarianVerification = action.payload;
        state.error = null;
      })
      .addCase(checkVeterinarianVerification.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Register Clinic
      .addCase(registerClinic.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.clinicRegistrationStatus = null;
      })
      .addCase(registerClinic.fulfilled, (state, action) => {
        state.isLoading = false;
        state.clinicRegistrationStatus = 'success';
        state.error = null;
        // Update user role if needed
        if (state.user) {
          state.user.role = 'clinic_owner';
        }
      })
      .addCase(registerClinic.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.clinicRegistrationStatus = 'failed';
      })

      // Check Clinic Verification
      .addCase(checkClinicVerification.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkClinicVerification.fulfilled, (state, action) => {
        state.isLoading = false;
        state.clinicVerification = action.payload;
        state.error = null;
      })
      .addCase(checkClinicVerification.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

function isValidDate(dateString) {
  const regEx = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateString.match(regEx)) return false;
  const d = new Date(dateString);
  return d instanceof Date && !isNaN(d);
}

export const {
  signOut,
  clearError,
  updateUser,
  resetClinicRegistration
} = authSlice.actions;
export default authSlice.reducer;