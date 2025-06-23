import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../services/authService';

// Async thunks for authentication
export const signInUser = createAsyncThunk(
  'auth/signIn',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authAPI.signIn(email, password);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Sign in failed');
    }
  }
);

export const signUpUser = createAsyncThunk(
  'auth/signUp',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await authAPI.signUp(name, email, password);
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
      // Clear auth state if refresh fails
      return rejectWithValue('Session expired. Please login again.');
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
  signUpSuccess: false
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
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
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
        // If refresh fails, sign out the user
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      });
  },
});

export const { signOut, clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;