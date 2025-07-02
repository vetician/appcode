import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const verifyDoctorFieldAPI = createAsyncThunk(
  'doctors/verifyField',
  async ({ doctorId, fieldName }, { rejectWithValue }) => {
    console.log(doctorId, fieldName)
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/auth/verify/${doctorId}/${fieldName}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const doctorSlice = createSlice({
  name: 'doctors',
  initialState: {
    verifiedDoctors: [],
    unverifiedDoctors: [],
    loading: false,
    verifyingField: false,
    error: null,
    fieldVerificationError: null,
  },
  reducers: {
    fetchDoctorsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchVerifiedDoctorsSuccess: (state, action) => {
      state.loading = false;
      state.verifiedDoctors = action.payload;
    },
    fetchUnverifiedDoctorsSuccess: (state, action) => {
      state.loading = false;
      state.unverifiedDoctors = action.payload;
    },
    fetchDoctorsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
      state.fieldVerificationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyDoctorFieldAPI.pending, (state) => {
        state.verifyingField = true;
        state.fieldVerificationError = null;
      })
      .addCase(verifyDoctorFieldAPI.fulfilled, (state, action) => {
        state.verifyingField = false;
        const { doctorId, fieldName } = action.meta.arg;
        
        // Update doctor in appropriate list
        const doctorList = state.unverifiedDoctors.some(d => d._id === doctorId) 
          ? state.unverifiedDoctors 
          : state.verifiedDoctors;
          
        const doctor = doctorList.find(d => d._id === doctorId);
        
        if (doctor) {
          // Update the field
          if (typeof doctor[fieldName] === 'object') {
            doctor[fieldName].verified = true;
          } else {
            doctor[fieldName] = { value: doctor[fieldName], verified: true };
          }
          
          // Check if should move to verified list
          const requiredFields = ['name', 'gender', 'city', 'experience', 
                               'specialization', 'qualification', 
                               'registration', 'identityProof'];
          const allVerified = requiredFields.every(field => 
            typeof doctor[field] === 'object' ? doctor[field]?.verified : false
          );
          
          if (allVerified && doctorList === state.unverifiedDoctors) {
            doctor.isVerified = true;
            state.verifiedDoctors.push(doctor);
            state.unverifiedDoctors = state.unverifiedDoctors.filter(
              d => d._id !== doctorId
            );
          }
        }
      })
      .addCase(verifyDoctorFieldAPI.rejected, (state, action) => {
        state.verifyingField = false;
        state.fieldVerificationError = action.payload;
      });
  }
});

export const {
  fetchDoctorsStart,
  fetchVerifiedDoctorsSuccess,
  fetchUnverifiedDoctorsSuccess,
  fetchDoctorsFailure,
  clearError,
} = doctorSlice.actions;

export default doctorSlice.reducer;