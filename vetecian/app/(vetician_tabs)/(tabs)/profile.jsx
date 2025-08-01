import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image, FlatList, Modal, TextInput, TouchableWithoutFeedback } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation, useRouter } from 'expo-router';
import { signOut, getParent, parentUser, updateParent } from '../../../store/slices/authSlice';
import { User, Mail, Calendar, MapPin, Phone, Edit, LogOut, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import PetDetailModal from '../../../components/petparent/home/PetDetailModal';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { validateEmail } from '../../../utils/validation';

export default function Profile() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [parentData, setParentData] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null);
  const [petModalVisible, setPetModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    gender: 'male',
    image: null
  });
  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useSelector(state => state.auth);
  const pets = useSelector(state => state.auth?.userPets?.data || []);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchParentData = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          const result = await dispatch(getParent(userId)).unwrap();
          setParentData(result.parent[0]);
          if (result.parent[0]) {
            setFormData({
              name: result.parent[0].name || '',
              email: result.parent[0].email || user?.email || '',
              phone: result.parent[0].phone || '',
              address: result.parent[0].address || '',
              gender: result.parent[0].gender || 'male',
              image: result.parent[0].image ? { uri: result.parent[0].image } : null
            });
          }
        }
      } catch (error) {
        console.error('Error fetching parent data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchParentData();
  }, [dispatch, user]);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            dispatch(signOut());
            router.replace('/(auth)/signin');
          },
        },
      ]
    );
  };

  const handlePetPress = (pet) => {
    setSelectedPet(pet);
    setPetModalVisible(true);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10,15}$/;
    return phoneRegex.test(phone);
  };

  const uploadToCloudinary = async (file) => {
    const fileExtension = file.uri.split('.').pop().toLowerCase();
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension);
    const type = isImage ? 'image' : 'raw';

    try {
      const fileInfo = await FileSystem.getInfoAsync(file.uri, { size: true });
      if (!fileInfo.exists) throw new Error(`File not found: ${file.uri}`);
      if (fileInfo.size === 0) throw new Error('Empty file');

      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        name: file.name || `parent_upload_${Date.now()}.${fileExtension}`,
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
      return data;
    } catch (error) {
      console.error('[Cloudinary] UPLOAD FAILED:', error);
      throw error;
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'We need camera roll permissions to upload images');
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const selectedAsset = result.assets[0];
        setFormData(prev => ({
          ...prev,
          image: {
            uri: selectedAsset.uri,
            name: selectedAsset.fileName || `image_${Date.now()}.jpg`,
            type: 'image/jpeg'
          }
        }));
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = async () => {
    setErrors({});
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Parent name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (formData.address.trim().length < 10) {
      newErrors.address = 'Please enter a complete address';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsUploading(true);
      let imageUrl = parentData?.image || null;

      if (formData.image && formData.image.uri !== parentData?.image) {
        const cloudinaryResponse = await uploadToCloudinary(formData.image);
        imageUrl = cloudinaryResponse.secure_url;
      }

      const result = await dispatch(updateParent({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone,
        address: formData.address,
        gender: formData.gender,
        image: imageUrl
      })).unwrap();

      if (result.success) {
        Alert.alert(
          'Success',
          'Profile updated successfully!',
          [{ text: 'OK', onPress: () => {
            setEditModalVisible(false);
            const userId = AsyncStorage.getItem('userId');
            if (userId) {
              dispatch(getParent(userId));
            }
          }}]
        );
      }
    } catch (error) {
      console.error('Submission error:', error);
      Alert.alert('Error', error.message || 'An error occurred while updating profile');
    } finally {
      setIsUploading(false);
    }
  };

  const renderPetCard = ({ item }) => {
    const getPetIcon = () => {
      const PET_TYPES = {
        Dog: 'dog',
        Cat: 'cat',
        default: 'paw'
      };
      return PET_TYPES[item.species] || PET_TYPES.default;
    };

    return (
      <TouchableOpacity
        style={styles.petCard}
        onPress={() => handlePetPress(item)}
      >
        <View style={styles.petImageContainer}>
          {item?.petPhoto ? (
            <Image source={{ uri: item.petPhoto }} style={styles.petImage} />
          ) : (
            <View style={styles.petImagePlaceholder}>
              <FontAwesome5
                name={getPetIcon()}
                size={24}
                color="#4E8D7C"
              />
            </View>
          )}
        </View>
        <View style={styles.petInfoContainer}>
          <Text style={styles.petName} numberOfLines={1}>{item.name}</Text>
          <View style={styles.petDetails}>
            <Text style={styles.petType}>{item.species}</Text>
            {item.breed && (
              <Text style={styles.petBreed} numberOfLines={1}>• {item.breed}</Text>
            )}
          </View>
          {item.gender && (
            <View style={styles.petGender}>
              <MaterialCommunityIcons
                name={item.gender.toLowerCase() === 'male' ? 'gender-male' : 'gender-female'}
                size={16}
                color="#7D7D7D"
              />
              <Text style={styles.petGenderText}>{item.gender}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const profileInfo = [
    { icon: Mail, label: 'Email', value: parentData?.email || user?.email || 'Not provided' },
    { icon: Phone, label: 'Phone', value: parentData?.phone || 'Not provided' },
    { icon: MapPin, label: 'Address', value: parentData?.address || 'Not provided' },
    {
      icon: Calendar,
      label: 'Registered',
      value: parentData?.createdAt ? new Date(parentData.createdAt).toLocaleDateString() : 'Not registered yet'
    },
  ];

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            {parentData?.image ? (
              <Image
                source={{ uri: parentData.image }}
                style={styles.profileImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.avatar}>
                <User size={40} color="#007AFF" />
              </View>
            )}
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setEditModalVisible(true)}
            >
              <Edit size={20} color="#007AFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{parentData?.name || user?.name || 'Pet Parent'}</Text>
          <Text style={styles.gender}>{parentData?.gender ? parentData.gender.charAt(0).toUpperCase() + parentData.gender.slice(1) : ''}</Text>
          <Text style={styles.email}>{parentData?.email || user?.email || 'user@example.com'}</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <View style={styles.infoContainer}>
              {profileInfo.map((info, index) => (
                <View key={index} style={styles.infoItem}>
                  <View style={styles.infoIcon}>
                    <info.icon size={20} color="#666" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>{info.label}</Text>
                    <Text style={styles.infoValue}>{info.value}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Pets</Text>
            </View>
            {pets.length > 0 ? (
              <FlatList
                horizontal
                data={pets}
                renderItem={renderPetCard}
                keyExtractor={item => item._id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.petCarouselContainer}
              />
            ) : (
              <View style={styles.noPetsContainer}>
                <FontAwesome5 name="paw" size={32} color="#E0E0E0" />
                <Text style={styles.noPetsText}>No pets registered yet</Text>
                <TouchableOpacity
                  style={styles.addPetButton}
                  onPress={() => router.push('/pets/register')}
                >
                  <Text style={styles.addPetButtonText}>Add a Pet</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Actions</Text>
            <View style={styles.actionsContainer}>
              {!parentData && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => router.push('onboarding/parent_detail')}
                >
                  <Edit size={20} color="#007AFF" />
                  <Text style={styles.actionText}>Complete Registration</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.actionButton, styles.signOutButton]}
                onPress={handleSignOut}
              >
                <LogOut size={20} color="#ff3b30" />
                <Text style={[styles.actionText, styles.signOutText]}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <PetDetailModal
        pet={selectedPet}
        visible={petModalVisible}
        onClose={() => setPetModalVisible(false)}
      />

      {/* Edit Profile Modal */}
      <Modal
        visible={editModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setEditModalVisible(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setEditModalVisible(false)}
            >
              <X size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Profile Picture</Text>
              <TouchableOpacity style={styles.imageUploadContainer} onPress={pickImage}>
                {formData.image ? (
                  <Image source={{ uri: formData.image.uri || formData.image }} style={styles.modalProfileImage} />
                ) : (
                  <View style={styles.modalProfileImagePlaceholder}>
                    <User size={40} color="#666" />
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Personal Information</Text>
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <User size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, errors.name && styles.inputError]}
                    placeholder="Full name"
                    value={formData.name}
                    onChangeText={(value) => handleInputChange('name', value)}
                  />
                </View>
                {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Mail size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, errors.email && styles.inputError]}
                    placeholder="Email"
                    value={formData.email}
                    onChangeText={(value) => handleInputChange('email', value)}
                    keyboardType="email-address"
                  />
                </View>
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>

              <View style={styles.genderContainer}>
                <Text style={styles.genderLabel}>Gender:</Text>
                <View style={styles.genderOptions}>
                  <TouchableOpacity
                    style={[
                      styles.genderOption,
                      formData.gender === 'male' && styles.genderOptionSelected
                    ]}
                    onPress={() => handleInputChange('gender', 'male')}
                  >
                    <Text style={[
                      styles.genderOptionText,
                      formData.gender === 'male' && styles.genderOptionTextSelected
                    ]}>
                      Male
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.genderOption,
                      formData.gender === 'female' && styles.genderOptionSelected
                    ]}
                    onPress={() => handleInputChange('gender', 'female')}
                  >
                    <Text style={[
                      styles.genderOptionText,
                      formData.gender === 'female' && styles.genderOptionTextSelected
                    ]}>
                      Female
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.genderOption,
                      formData.gender === 'other' && styles.genderOptionSelected
                    ]}
                    onPress={() => handleInputChange('gender', 'other')}
                  >
                    <Text style={[
                      styles.genderOptionText,
                      formData.gender === 'other' && styles.genderOptionTextSelected
                    ]}>
                      Other
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact Information</Text>
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Phone size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, errors.phone && styles.inputError]}
                    placeholder="Phone number"
                    value={formData.phone}
                    onChangeText={(value) => handleInputChange('phone', value)}
                    keyboardType="phone-pad"
                  />
                </View>
                {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <MapPin size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, errors.address && styles.inputError]}
                    placeholder="Address"
                    value={formData.address}
                    onChangeText={(value) => handleInputChange('address', value)}
                    multiline
                  />
                </View>
                {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
              </View>
            </View>

            <TouchableOpacity
              style={[styles.submitButton, (isUploading) && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isUploading}
            >
              <Text style={styles.submitButtonText}>
                {isUploading ? 'Saving...' : 'Save Changes'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007AFF20',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  gender: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    padding: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  viewAll: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  petCarouselContainer: {
    paddingBottom: 10,
  },
  petCard: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  petImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#f0f7f4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    overflow: 'hidden',
  },
  petImage: {
    width: '100%',
    height: '100%',
  },
  petImagePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  petInfoContainer: {
    flex: 1,
  },
  petName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  petDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  petType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4E8D7C',
  },
  petBreed: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
    flexShrink: 1,
  },
  petGender: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  petGenderText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  noPetsContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  noPetsText: {
    fontSize: 16,
    color: '#666',
    marginVertical: 12,
  },
  addPetButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  addPetButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  signOutButton: {
    borderColor: '#ff3b30',
    backgroundColor: '#ff3b3010',
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF',
    marginLeft: 12,
  },
  signOutText: {
    color: '#ff3b30',
  },
  // Modal styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    margin: 20,
    marginTop: 50,
    marginBottom: 50,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    flexGrow: 1,
  },
  imageUploadContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalProfileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  modalProfileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#333',
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
  genderContainer: {
    marginTop: 15,
  },
  genderLabel: {
    fontSize: 16,
    color: '#444',
    marginBottom: 10,
  },
  genderOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderOption: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  genderOptionSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  genderOptionText: {
    color: '#333',
  },
  genderOptionTextSelected: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  submitButtonDisabled: {
    backgroundColor: '#A0C4FF',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});