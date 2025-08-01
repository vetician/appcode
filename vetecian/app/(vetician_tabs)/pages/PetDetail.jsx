import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, Pressable, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Calendar, Camera, X } from 'lucide-react-native';
import { registerPet } from '../../../store/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

export default function PetDetail() {
  const [step, setStep] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    species: 'Dog',
    breed: '',
    gender: 'Male',
    location: '',
    dob: new Date(),
    petPhoto: null,

    // Physical Characteristics
    bloodGroup: '',
    height: '',
    weight: '',
    color: '',
    distinctiveFeatures: '',

    // Health Information
    allergies: '',
    currentMedications: '',
    chronicDiseases: '',
    injuries: '',
    surgeries: '',
    vaccinations: '',

    // Additional Information
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector(state => state.auth);
  const router = useRouter();

  const speciesOptions = ['Dog', 'Cat', 'Bird', 'Fish', 'Rabbit', 'Hamster', 'Other'];
  const genderOptions = ['Male', 'Female', 'Neutered', 'Spayed', 'Unknown'];
  const bloodGroupOptions = ['A', 'B', 'AB', 'O', 'Unknown'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || formData.dob;
    setShowDatePicker(Platform.OS === 'ios');
    setFormData({
      ...formData,
      dob: currentDate,
    });
  };

  const handlePetPhotoUpload = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert('Permission required', 'We need access to your photos to upload a pet picture');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setFormData(prev => ({ ...prev, petPhoto: result.assets[0] }));
        setErrors(prev => ({ ...prev, petPhoto: null }));
      }
    } catch (error) {
      console.error('Pet photo upload error:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };

  const removePetPhoto = () => {
    setFormData(prev => ({ ...prev, petPhoto: null }));
  };

  const uploadToCloudinary = async (file) => {
    const fileExtension = file.uri.split('.').pop().toLowerCase();
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension);
    const type = isImage ? 'image' : 'raw';

    console.log('[Cloudinary] Starting upload:', {
      name: file.name || 'unnamed',
      type,
      size: file.size || 'unknown',
      uri: file.uri
    });

    try {
      const fileInfo = await FileSystem.getInfoAsync(file.uri, { size: true });
      if (!fileInfo.exists) throw new Error(`File not found: ${file.uri}`);
      if (fileInfo.size === 0) throw new Error('Empty file');

      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        name: file.name || `pet_upload_${Date.now()}.${fileExtension}`,
        type: isImage ? `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`
          : file.type || 'application/octet-stream'
      });
      formData.append('upload_preset', 'vetician');
      formData.append('cloud_name', 'dqwzfs4ox');

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dqwzfs4ox/${type}/upload`,
        {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('[Cloudinary] Upload success!', {
        public_id: data.public_id,
        type,
        size: fileInfo.size
      });
      return data;
    } catch (error) {
      console.error('[Cloudinary] UPLOAD FAILED:', {
        error: error.message,
        file: file.name,
        type,
        uri: file.uri
      });
      throw error;
    }
  };

  const validateStep = (currentStep) => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.name.trim()) {
        newErrors.name = 'Pet name is required';
      } else if (formData.name.trim().length < 2) {
        newErrors.name = 'Name must be at least 2 characters';
      }

      if (!formData.species) {
        newErrors.species = 'Species is required';
      }

      if (!formData.gender) {
        newErrors.gender = 'Gender is required';
      }

      if (!formData.petPhoto) {
        newErrors.petPhoto = 'Pet photo is required';
      }
    }

    if (currentStep === 2) {
      if (formData.height && isNaN(formData.height)) {
        newErrors.height = 'Height must be a number';
      }

      if (formData.weight && isNaN(formData.weight)) {
        newErrors.weight = 'Weight must be a number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) return;

    setIsUploading(true);
    try {
      const userId = await AsyncStorage.getItem('userId');
      
      // Upload pet photo first
      let petPhotoUrl = '';
      if (formData.petPhoto) {
        const uploadResult = await uploadToCloudinary(formData.petPhoto);
        petPhotoUrl = uploadResult.secure_url;
      }

      const submissionData = {
        ...formData,
        dob: formData.dob.toISOString().split('T')[0],
        petPhoto: petPhotoUrl,
        userId
      };

      console.log("submissionData =>", submissionData);
      
      const result = await dispatch(registerPet(submissionData)).unwrap();
      console.log(result);

      if (result.success) {
        Alert.alert(
          'Success',
          'Pet information has been saved successfully!',
          [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
        );
      }
    } catch (error) {
      console.error('Submission error:', error);
      Alert.alert(
        'Error',
        error.message || 'An error occurred while saving pet information'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>

            {/* Pet Photo Upload */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Pet Photo*</Text>
              <TouchableOpacity
                style={[
                  styles.photoUpload,
                  errors.petPhoto && styles.uploadError
                ]}
                onPress={handlePetPhotoUpload}
              >
                {formData.petPhoto ? (
                  <>
                    <Image
                      source={{ uri: formData.petPhoto.uri }}
                      style={styles.uploadedImage}
                    />
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={removePetPhoto}
                    >
                      <X size={16} color="#fff" />
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <Camera size={24} color="#4E8D7C" />
                    <Text style={styles.photoUploadText}>Upload Photo</Text>
                  </>
                )}
              </TouchableOpacity>
              {errors.petPhoto && <Text style={styles.errorText}>{errors.petPhoto}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder="Pet name*"
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                autoCapitalize="words"
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Species*</Text>
              <View style={styles.optionsContainer}>
                {speciesOptions.map((species) => (
                  <TouchableOpacity
                    key={species}
                    style={[
                      styles.optionButton,
                      formData.species === species && styles.selectedOption
                    ]}
                    onPress={() => handleInputChange('species', species)}
                  >
                    <Text style={styles.optionText}>{species}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.species && <Text style={styles.errorText}>{errors.species}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Breed"
                value={formData.breed}
                onChangeText={(value) => handleInputChange('breed', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Gender*</Text>
              <View style={styles.optionsContainer}>
                {genderOptions.map((gender) => (
                  <TouchableOpacity
                    key={gender}
                    style={[
                      styles.optionButton,
                      formData.gender === gender && styles.selectedOption
                    ]}
                    onPress={() => handleInputChange('gender', gender)}
                  >
                    <Text style={styles.optionText}>{gender}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Location"
                value={formData.location}
                onChangeText={(value) => handleInputChange('location', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Date of Birth</Text>
              <Pressable
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Text>{formData.dob.toLocaleDateString()}</Text>
                <Calendar size={20} color="#4E8D7C" />
              </Pressable>
              {showDatePicker && (
                <DateTimePicker
                  value={formData.dob}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                />
              )}
            </View>
          </View>
        );
      case 2:
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Physical Characteristics</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Blood Group</Text>
              <View style={styles.optionsContainer}>
                {bloodGroupOptions.map((group) => (
                  <TouchableOpacity
                    key={group}
                    style={[
                      styles.optionButton,
                      formData.bloodGroup === group && styles.selectedOption
                    ]}
                    onPress={() => handleInputChange('bloodGroup', group)}
                  >
                    <Text style={styles.optionText}>{group}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, errors.height && styles.inputError]}
                placeholder="Height (cm)"
                value={formData.height}
                onChangeText={(value) => handleInputChange('height', value)}
                keyboardType="numeric"
              />
              {errors.height && <Text style={styles.errorText}>{errors.height}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, errors.weight && styles.inputError]}
                placeholder="Weight (kg)"
                value={formData.weight}
                onChangeText={(value) => handleInputChange('weight', value)}
                keyboardType="numeric"
              />
              {errors.weight && <Text style={styles.errorText}>{errors.weight}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Color"
                value={formData.color}
                onChangeText={(value) => handleInputChange('color', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Distinctive features"
                value={formData.distinctiveFeatures}
                onChangeText={(value) => handleInputChange('distinctiveFeatures', value)}
                multiline
              />
            </View>
          </View>
        );
      case 3:
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Health Information</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Allergies (comma separated)"
                value={formData.allergies}
                onChangeText={(value) => handleInputChange('allergies', value)}
                multiline
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Current medications"
                value={formData.currentMedications}
                onChangeText={(value) => handleInputChange('currentMedications', value)}
                multiline
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Chronic diseases"
                value={formData.chronicDiseases}
                onChangeText={(value) => handleInputChange('chronicDiseases', value)}
                multiline
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Injuries"
                value={formData.injuries}
                onChangeText={(value) => handleInputChange('injuries', value)}
                multiline
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Surgeries"
                value={formData.surgeries}
                onChangeText={(value) => handleInputChange('surgeries', value)}
                multiline
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Vaccinations"
                value={formData.vaccinations}
                onChangeText={(value) => handleInputChange('vaccinations', value)}
                multiline
              />
            </View>
          </View>
        );
      case 4:
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Information</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                placeholder="Notes"
                value={formData.notes}
                onChangeText={(value) => handleInputChange('notes', value)}
                multiline
                numberOfLines={4}
              />
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.menuButton}>
              <ChevronLeft size={24} color="#1a1a1a" />
            </TouchableOpacity>
            <View>
              <Text style={styles.title}>Pet Information</Text>
              <Text style={styles.subtitle}>Step {step} of 4</Text>
            </View>
          </View>

          <View style={styles.form}>
            {renderStep()}

            <View style={styles.buttonContainer}>
              {step > 1 && (
                <TouchableOpacity
                  style={[styles.navButton, styles.prevButton]}
                  onPress={prevStep}
                >
                  <Text style={styles.navButtonText}>Previous</Text>
                </TouchableOpacity>
              )}

              {step < 4 ? (
                <TouchableOpacity
                  style={[styles.navButton, styles.nextButton]}
                  onPress={nextStep}
                >
                  <Text style={styles.navButtonText}>Next</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.navButton, styles.submitButton]}
                  onPress={handleSubmit}
                  disabled={isLoading || isUploading}
                >
                  <Text style={styles.navButtonText}>
                    {isLoading || isUploading ? 'Saving...' : 'Submit'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
    paddingTop: 50,
  },
  menuButton: {
    marginRight: 20,
    padding: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
  },
  form: {
    flex: 1,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#444',
    marginBottom: 20,
    paddingLeft: 5,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#444',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    paddingLeft: 5,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f8f9fa',
  },
  selectedOption: {
    backgroundColor: '#e3f2fd',
    borderColor: '#007AFF',
  },
  optionText: {
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  navButton: {
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  prevButton: {
    backgroundColor: '#007AFF',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  nextButton: {
    backgroundColor: '#007AFF',
  },
  submitButton: {
    backgroundColor: '#34C759',
  },
  navButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  prevButtonText: {
    color: '#333',
  },
  photoUpload: {
    height: 120,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    marginBottom: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  uploadError: {
    borderColor: '#EF4444',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoUploadText: {
    color: '#4E8D7C',
    marginTop: 8,
    fontSize: 14,
  },
});