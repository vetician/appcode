const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log(API_BASE_URL)

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token');

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Veterinarian endpoints
  async getVerifiedVeterinarians(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/admin/verified?${params}`, {
      method: 'POST',
    });
  }

  async getUnverifiedVeterinarians() {
    return this.request('/admin/unverified', {
      method: 'POST',
    });
  }

  async verifyVeterinarianField(veterinarianId, fieldName) {
    return this.request(`/verify/${veterinarianId}/${fieldName}`, {
      method: 'PATCH',
    });
  }

  // Clinic endpoints
  async getVerifiedClinics(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/admin/verified/clinic?${params}`, {
      method: 'POST',
    });
  }

  async getUnverifiedClinics() {
    return this.request('/admin/unverified/clinic', {
      method: 'POST',
    });
  }

  async verifyClinic(clinicId) {
    return this.request(`/admin/clinic/verify/${clinicId}`, {
      method: 'POST',
    });
  }

  // Pet Resort endpoints
  async getVerifiedPetResorts(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/admin/verified/petresort?${params}`, {
      method: 'POST',
    });
  }

  async getUnverifiedPetResorts() {
    return this.request('/admin/unverified/petresort', {
      method: 'POST',
    });
  }

  async verifyPetResort(resortId) {
    return this.request(`/admin/petresort/verify/${resortId}`, {
      method: 'POST',
    });
  }

  async unverifyPetResort(resortId) {
    return this.request(`/admin/petresort/unverify/${resortId}`, {
      method: 'POST',
    });
  }
}

export default new ApiService();