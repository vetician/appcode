import { React, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, ChevronDown } from 'lucide-react-native';

export default function CreateProfile() {
  const [formData, setFormData] = useState({
    title: '',
    name: '',
    city: '',
    specialization: '',
    gender: '',
    experience: '',
    qualification: '',
    registration: '',
    identityProof: ''
  });
  
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = () => {
    const newErrors = {};
    
    // Validation rules
    const requiredFields = {
      title: 'Title is required',
      name: 'Full name is required',
      city: 'City is required',
      specialization: 'Specialization is required',
      gender: 'Please select your gender',
      experience: 'Experience is required',
      qualification: 'Qualification is required',
      registration: 'Registration details are required',
      identityProof: 'Identity proof type is required'
    };

    Object.entries(requiredFields).forEach(([field, message]) => {
      if (!formData[field]?.trim()) {
        newErrors[field] = message;
      }
    });

    if (formData.experience && isNaN(formData.experience)) {
      newErrors.experience = 'Experience must be a number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    Alert.alert(
      'Success',
      'Profile created successfully!',
      [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Create Professional Profile</Text>
          <Text style={styles.headerSubtitle}>Complete your profile to start using the platform</Text>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Profile Photo</Text>
          <TouchableOpacity style={styles.photoUpload}>
            <Camera size={24} color="#4B5563" />
            <Text style={styles.photoUploadText}>Upload Photo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Professional Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title*</Text>
            <View style={[styles.inputWrapper, errors.title && styles.inputError]}>
              <TextInput
                style={styles.input}
                placeholder="Dr."
                value={formData.title}
                onChangeText={(text) => handleInputChange('title', text)}
              />
              <ChevronDown size={20} color="#9CA3AF" />
            </View>
            {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name*</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              placeholder="Enter your full name"
              value={formData.name}
              onChangeText={(text) => handleInputChange('name', text)}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>City*</Text>
            <TextInput
              style={[styles.input, errors.city && styles.inputError]}
              placeholder="Enter your city"
              value={formData.city}
              onChangeText={(text) => handleInputChange('city', text)}
            />
            {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Specialization*</Text>
            <TextInput
              style={[styles.input, errors.specialization && styles.inputError]}
              placeholder="Your area of expertise"
              value={formData.specialization}
              onChangeText={(text) => handleInputChange('specialization', text)}
            />
            {errors.specialization && <Text style={styles.errorText}>{errors.specialization}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gender*</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  formData.gender === 'Male' && styles.radioButtonActive
                ]}
                onPress={() => handleInputChange('gender', 'Male')}
              >
                <Text style={styles.radioLabel}>Male</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  formData.gender === 'Female' && styles.radioButtonActive
                ]}
                onPress={() => handleInputChange('gender', 'Female')}
              >
                <Text style={styles.radioLabel}>Female</Text>
              </TouchableOpacity>
            </View>
            {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Years of Experience*</Text>
            <TextInput
              style={[styles.input, errors.experience && styles.inputError]}
              placeholder="Number of years"
              keyboardType="numeric"
              value={formData.experience}
              onChangeText={(text) => handleInputChange('experience', text)}
            />
            {errors.experience && <Text style={styles.errorText}>{errors.experience}</Text>}
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Education & Certification</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Qualification*</Text>
            <TextInput
              style={[styles.input, errors.qualification && styles.inputError]}
              placeholder="Your degrees and certifications"
              multiline
              value={formData.qualification}
              onChangeText={(text) => handleInputChange('qualification', text)}
            />
            {errors.qualification && <Text style={styles.errorText}>{errors.qualification}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Upload Qualification Documents*</Text>
            <Text style={styles.helperText}>
              Please upload scanned copies of your degrees and certifications
            </Text>
            <TouchableOpacity style={styles.uploadButton}>
              <Text style={styles.uploadButtonText}>Select Files</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Registration Details</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Registration Number*</Text>
            <TextInput
              style={[styles.input, errors.registration && styles.inputError]}
              placeholder="Your professional registration number"
              value={formData.registration}
              onChangeText={(text) => handleInputChange('registration', text)}
            />
            {errors.registration && <Text style={styles.errorText}>{errors.registration}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Upload Registration Proof*</Text>
            <TouchableOpacity style={styles.uploadButton}>
              <Text style={styles.uploadButtonText}>Select File</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Identity Verification</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Identity Document Type*</Text>
            <TextInput
              style={[styles.input, errors.identityProof && styles.inputError]}
              placeholder="Aadhar Card, Passport, etc."
              value={formData.identityProof}
              onChangeText={(text) => handleInputChange('identityProof', text)}
            />
            {errors.identityProof && <Text style={styles.errorText}>{errors.identityProof}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Upload Identity Document*</Text>
            <TouchableOpacity style={styles.uploadButton}>
              <Text style={styles.uploadButtonText}>Select File</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Complete Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: 35
  },
  scrollContainer: {
    padding: 24,
    paddingBottom: 48,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  photoUpload: {
    height: 120,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    marginBottom: 8,
  },
  photoUploadText: {
    color: '#4B5563',
    marginTop: 8,
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    height: 48,
    color: '#111827',
    fontSize: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  radioButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  radioButtonActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  radioLabel: {
    color: '#374151',
    fontWeight: '500',
  },
  uploadButton: {
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#3B82F6',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
  },
  uploadButtonText: {
    color: '#3B82F6',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});