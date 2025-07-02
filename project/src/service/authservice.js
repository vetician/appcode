import axios from 'axios';

const API_URL = '/api/v1/doctors';

// Verify a doctor's field
const verifyField = async (doctorId, fieldName, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.patch(
    `${API_URL}/verify/${doctorId}/${fieldName}`,
    {},
    config
  );

  return response.data;
};

// Get all unverified doctors
const getUnverifiedDoctors = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${API_URL}/unverified`, config);
  return response.data;
};

const doctorApi = {
  verifyField,
  getUnverifiedDoctors,
};

export default doctorApi;