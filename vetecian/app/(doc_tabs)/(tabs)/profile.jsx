// import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
// import { useSelector, useDispatch } from 'react-redux';
// import { useRouter } from 'expo-router';
// import { signOut } from '../../../store/slices/authSlice';
// import { User, Mail, Calendar, MapPin, Phone, CreditCard as Edit, LogOut, Stethoscope, PawPrint, Award } from 'lucide-react-native';

// export default function Profile() {
//   const { user } = useSelector(state => state.auth);
//   const dispatch = useDispatch();
//   const router = useRouter();

//   const handleSignOut = () => {
//     Alert.alert(
//       'Sign Out',
//       'Are you sure you want to sign out?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Sign Out',
//           style: 'destructive',
//           onPress: () => {
//             dispatch(signOut());
//             router.replace('/(auth)/signin');
//           },
//         },
//       ]
//     );
//   };

//   const profileInfo = [
//     { icon: Mail, label: 'Email', value: user?.email || 'Not provided' },
//     { icon: Phone, label: 'Phone', value: user?.phone || 'Emergency contact' },
//     { icon: MapPin, label: 'Clinic Location', value: user?.location || 'Main Veterinary Clinic' },
//     { icon: Calendar, label: 'License Since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '2020' },
//   ];

//   return (
//     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//       <View style={styles.header}>
//         <View style={styles.avatarContainer}>
//           <View style={styles.avatar}>
//             <User size={40} color="#007AFF" />
//           </View>
//           <TouchableOpacity style={styles.editButton}>
//             <Edit size={16} color="#007AFF" />
//           </TouchableOpacity>
//         </View>
//         <Text style={styles.name}>Dr. {user?.name || 'Veterinarian'}</Text>
//         <Text style={styles.email}>{user?.specialization || 'General Practitioner'}</Text>
//       </View>

//       <View style={styles.content}>
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Professional Information</Text>
//           <View style={styles.infoContainer}>
//             {profileInfo.map((info, index) => (
//               <View key={index} style={styles.infoItem}>
//                 <View style={styles.infoIcon}>
//                   <info.icon size={20} color="#666" />
//                 </View>
//                 <View style={styles.infoContent}>
//                   <Text style={styles.infoLabel}>{info.label}</Text>
//                   <Text style={styles.infoValue}>{info.value}</Text>
//                 </View>
//               </View>
//             ))}
//           </View>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Practice Stats</Text>
//           <View style={styles.statsContainer}>
//             <View style={styles.statItem}>
//               <Text style={styles.statValue}>24</Text>
//               <Text style={styles.statLabel}>Patients</Text>
//             </View>
//             <View style={styles.statItem}>
//               <Text style={styles.statValue}>12</Text>
//               <Text style={styles.statLabel}>Surgeries</Text>
//             </View>
//             <View style={styles.statItem}>
//               <Text style={styles.statValue}>5</Text>
//               <Text style={styles.statLabel}>Years Exp.</Text>
//             </View>
//           </View>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Quick Actions</Text>
//           <View style={styles.actionsContainer}>
//             <TouchableOpacity style={styles.actionButton}>
//               <Stethoscope size={20} color="#007AFF" />
//               <Text style={styles.actionText}>New Case</Text>
//             </TouchableOpacity>
            
//             <TouchableOpacity style={styles.actionButton}>
//               <PawPrint size={20} color="#007AFF" />
//               <Text style={styles.actionText}>Patient Records</Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={[styles.actionButton, styles.signOutButton]} onPress={handleSignOut}>
//               <LogOut size={20} color="#ff3b30" />
//               <Text style={[styles.actionText, styles.signOutText]}>Sign Out</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </ScrollView>
//   );
// }

// // All styles remain exactly the same as in the original code
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   header: {
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     paddingTop: 60,
//     paddingBottom: 32,
//     paddingHorizontal: 24,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e1e5e9',
//   },
//   avatarContainer: {
//     position: 'relative',
//     marginBottom: 16,
//   },
//   avatar: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     backgroundColor: '#007AFF20',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 3,
//     borderColor: '#007AFF',
//   },
//   editButton: {
//     position: 'absolute',
//     bottom: 0,
//     right: 0,
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: '#fff',
//     borderWidth: 2,
//     borderColor: '#007AFF',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   name: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#1a1a1a',
//     marginBottom: 4,
//   },
//   email: {
//     fontSize: 16,
//     color: '#666',
//   },
//   content: {
//     padding: 24,
//   },
//   section: {
//     marginBottom: 32,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#1a1a1a',
//     marginBottom: 16,
//   },
//   infoContainer: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: '#e1e5e9',
//   },
//   infoItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e1e5e9',
//   },
//   infoIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#f8f9fa',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 16,
//   },
//   infoContent: {
//     flex: 1,
//   },
//   infoLabel: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 4,
//   },
//   infoValue: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#1a1a1a',
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: '#e1e5e9',
//     padding: 20,
//   },
//   statItem: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   statValue: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#007AFF',
//     marginBottom: 4,
//   },
//   statLabel: {
//     fontSize: 14,
//     color: '#666',
//   },
//   actionsContainer: {
//     gap: 12,
//   },
//   actionButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 20,
//     borderWidth: 1,
//     borderColor: '#e1e5e9',
//   },
//   signOutButton: {
//     borderColor: '#ff3b30',
//     backgroundColor: '#ff3b3010',
//   },
//   actionText: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#007AFF',
//     marginLeft: 12,
//   },
//   signOutText: {
//     color: '#ff3b30',
//   },
// });





















// import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image, Modal, TextInput, TouchableWithoutFeedback } from 'react-native';
// import { useSelector, useDispatch } from 'react-redux';
// import { useRouter } from 'expo-router';
// import { signOut, veterinarianProfileData, updateVeterinarianProfile } from '../../../store/slices/authSlice';
// import { User, Mail, Calendar, MapPin, Phone, Edit, LogOut, X, Stethoscope, Award, Briefcase } from 'lucide-react-native';
// import { useEffect, useState } from 'react';
// import * as ImagePicker from 'expo-image-picker';
// import * as FileSystem from 'expo-file-system';
// import { validateEmail } from '../../../utils/validation';

// export default function VeterinarianProfile() {
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);
//   const [profileData, setProfileData] = useState(null);
//   const [editModalVisible, setEditModalVisible] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     specialization: '',
//     qualification: '',
//     experience: '',
//     registration: '',
//     profilePhotoUrl: null
//   });
//   const [errors, setErrors] = useState({});
//   const [isUploading, setIsUploading] = useState(false);
//   const { user } = useSelector(state => state.auth);

//   useEffect(() => {
//     const fetchProfileData = async () => {
//       try {
//         const result = await dispatch(veterinarianProfileData()).unwrap();
//         if (result.success) {
//           setProfileData(result.data);
//           setFormData({
//             name: result.data.profile.name || '',
//             email: user?.email || '',
//             phone: result.data.profile.phone || '',
//             specialization: result.data.profile.specialization || '',
//             qualification: result.data.profile.qualification || '',
//             experience: result.data.profile.experience || '',
//             registration: result.data.profile.registration || '',
//             profilePhotoUrl: result.data.profile.profilePhotoUrl || null
//           });
//         }
//       } catch (error) {
//         console.error('Error fetching veterinarian profile:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfileData();
//   }, [dispatch, user]);

//   const handleSignOut = () => {
//     Alert.alert(
//       'Sign Out',
//       'Are you sure you want to sign out?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Sign Out',
//           style: 'destructive',
//           onPress: () => {
//             dispatch(signOut());
//             router.replace('/(auth)/signin');
//           },
//         },
//       ]
//     );
//   };

//   const validatePhone = (phone) => {
//     const phoneRegex = /^[0-9]{10,15}$/;
//     return phoneRegex.test(phone);
//   };

//   const uploadToCloudinary = async (file) => {
//     try {
//       const fileExtension = file.uri.split('.').pop().toLowerCase();
//       const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension);

//       const formData = new FormData();
//       formData.append('file', {
//         uri: file.uri,
//         name: file.name || `vet_upload_${Date.now()}.${fileExtension}`,
//         type: isImage ? `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}` : 'application/octet-stream'
//       });
//       formData.append('upload_preset', 'vetician');
//       formData.append('cloud_name', 'dqwzfs4ox');

//       const response = await fetch(
//         `https://api.cloudinary.com/v1_1/dqwzfs4ox/image/upload`,
//         {
//           method: 'POST',
//           body: formData,
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('Cloudinary upload error:', error);
//       throw error;
//     }
//   };

//   const pickImage = async () => {
//     try {
//       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission required', 'We need camera roll permissions to upload images');
//         return;
//       }

//       let result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [1, 1],
//         quality: 0.8,
//       });

//       if (!result.canceled) {
//         const selectedAsset = result.assets[0];
//         setFormData(prev => ({
//           ...prev,
//           profilePhotoUrl: {
//             uri: selectedAsset.uri,
//             name: selectedAsset.fileName || `vet_${Date.now()}.jpg`,
//             type: 'image/jpeg'
//           }
//         }));
//       }
//     } catch (error) {
//       console.error('Image picker error:', error);
//       Alert.alert('Error', 'Failed to pick image. Please try again.');
//     }
//   };

//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//     if (errors[field]) {
//       setErrors(prev => ({ ...prev, [field]: null }));
//     }
//   };

//   const handleSubmit = async () => {
//     setErrors({});
//     const newErrors = {};

//     if (!formData.name.trim()) {
//       newErrors.name = 'Name is required';
//     }

//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!validateEmail(formData.email)) {
//       newErrors.email = 'Please enter a valid email';
//     }

//     if (!formData.phone.trim()) {
//       newErrors.phone = 'Phone number is required';
//     } else if (!validatePhone(formData.phone)) {
//       newErrors.phone = 'Please enter a valid phone number';
//     }

//     if (!formData.specialization.trim()) {
//       newErrors.specialization = 'Specialization is required';
//     }

//     if (!formData.qualification.trim()) {
//       newErrors.qualification = 'Qualification is required';
//     }

//     if (!formData.experience.trim()) {
//       newErrors.experience = 'Experience is required';
//     }

//     if (!formData.registration.trim()) {
//       newErrors.registration = 'Registration number is required';
//     }

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }

//     try {
//       setIsUploading(true);
//       let imageUrl = profileData?.profile?.profilePhotoUrl || null;

//       if (formData.profilePhotoUrl && formData.profilePhotoUrl.uri !== profileData?.profile?.profilePhotoUrl) {
//         const cloudinaryResponse = await uploadToCloudinary(formData.profilePhotoUrl);
//         imageUrl = cloudinaryResponse.secure_url;
//       }

//       const result = await dispatch(updateVeterinarianProfile({
//         name: formData.name.trim(),
//         email: formData.email.trim(),
//         phone: formData.phone.trim(),
//         specialization: formData.specialization.trim(),
//         qualification: formData.qualification.trim(),
//         experience: formData.experience.trim(),
//         registration: formData.registration.trim(),
//         profilePhotoUrl: imageUrl
//       })).unwrap();

//       if (result.success) {
//         Alert.alert(
//           'Success',
//           'Profile updated successfully!',
//           [{ text: 'OK', onPress: () => {
//             setEditModalVisible(false);
//             dispatch(veterinarianProfileData());
//           }}]
//         );
//       }
//     } catch (error) {
//       console.error('Profile update error:', error);
//       Alert.alert('Error', error.message || 'An error occurred while updating profile');
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const profileInfo = [
//     { icon: Mail, label: 'Email', value: profileData?.profile?.email || user?.email || 'Not provided' },
//     { icon: Phone, label: 'Phone', value: profileData?.profile?.phone || 'Not provided' },
//     { icon: Stethoscope, label: 'Specialization', value: profileData?.profile?.specialization || 'Not provided' },
//     { icon: Award, label: 'Qualification', value: profileData?.profile?.qualification || 'Not provided' },
//     { icon: Briefcase, label: 'Experience', value: profileData?.profile?.experience || 'Not provided' },
//     { icon: Calendar, label: 'Registration', value: profileData?.profile?.registration || 'Not registered yet' },
//   ];

//   if (loading) {
//     return (
//       <View style={[styles.container, styles.loadingContainer]}>
//         <ActivityIndicator size="large" color="#4E8D7C" />
//         <Text style={styles.loadingText}>Loading your profile...</Text>
//       </View>
//     );
//   }

//   if (!profileData) {
//     return (
//       <View style={styles.emptyContainer}>
//         <Text style={styles.emptyTitle}>Profile Not Found</Text>
//         <Text style={styles.emptyText}>Unable to load veterinarian profile</Text>
//         <TouchableOpacity
//           style={styles.refreshButton}
//           onPress={() => dispatch(veterinarianProfileData())}
//           activeOpacity={0.7}
//         >
//           <Text style={styles.refreshButtonText}>Refresh</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
//         {/* Status Banner */}
//         {!profileData.profile.isVerified && (
//           <View style={styles.reviewBanner}>
//             <MaterialIcons name="pending-actions" size={20} color="#E67C00" />
//             <View style={styles.bannerTextContainer}>
//               <Text style={styles.reviewBannerText}>{profileData.status}</Text>
//               <Text style={styles.reviewBannerSubtext}>{profileData.message}</Text>
//             </View>
//           </View>
//         )}

//         {/* Profile Header */}
//         <View style={styles.header}>
//           <View style={styles.avatarContainer}>
//             {profileData.profile.profilePhotoUrl ? (
//               <Image
//                 source={{ uri: profileData.profile.profilePhotoUrl }}
//                 style={styles.profileImage}
//                 resizeMode="cover"
//               />
//             ) : (
//               <View style={styles.avatar}>
//                 <User size={40} color="#4E8D7C" />
//               </View>
//             )}
//             <TouchableOpacity
//               style={styles.editButton}
//               onPress={() => setEditModalVisible(true)}
//             >
//               <Edit size={20} color="#4E8D7C" />
//             </TouchableOpacity>
//           </View>
//           <Text style={styles.name}>Dr. {profileData.profile.name}</Text>
//           <Text style={styles.specialization}>{profileData.profile.specialization}</Text>
//         </View>

//         {/* Profile Information */}
//         <View style={styles.content}>
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Professional Information</Text>
//             <View style={styles.infoContainer}>
//               {profileInfo.map((info, index) => (
//                 <View key={index} style={styles.infoItem}>
//                   <View style={styles.infoIcon}>
//                     <info.icon size={20} color="#666" />
//                   </View>
//                   <View style={styles.infoContent}>
//                     <Text style={styles.infoLabel}>{info.label}</Text>
//                     <Text style={styles.infoValue}>{info.value}</Text>
//                   </View>
//                 </View>
//               ))}
//             </View>
//           </View>

//           {/* Clinics Section */}
//           {profileData.clinics && profileData.clinics.length > 0 && (
//             <View style={styles.section}>
//               <Text style={styles.sectionTitle}>Associated Clinics</Text>
//               <View style={styles.clinicsContainer}>
//                 {profileData.clinics.map((clinic, index) => (
//                   <View key={index} style={styles.clinicCard}>
//                     <Text style={styles.clinicName}>{clinic.clinicName}</Text>
//                     <View style={styles.clinicAddressContainer}>
//                       <MapPin size={16} color="#666" />
//                       <Text style={styles.clinicAddress}>{clinic.address}</Text>
//                     </View>
//                     {clinic.verified ? (
//                       <Text style={styles.verifiedBadge}>Verified</Text>
//                     ) : (
//                       <Text style={styles.pendingBadge}>Verification Pending</Text>
//                     )}
//                   </View>
//                 ))}
//               </View>
//             </View>
//           )}

//           {/* Actions */}
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Actions</Text>
//             <View style={styles.actionsContainer}>
//               <TouchableOpacity
//                 style={[styles.actionButton, styles.signOutButton]}
//                 onPress={handleSignOut}
//               >
//                 <LogOut size={20} color="#ff3b30" />
//                 <Text style={[styles.actionText, styles.signOutText]}>Sign Out</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </ScrollView>

//       {/* Edit Profile Modal */}
//       <Modal
//         visible={editModalVisible}
//         animationType="fade"
//         transparent={true}
//         onRequestClose={() => setEditModalVisible(false)}
//       >
//         <TouchableWithoutFeedback onPress={() => setEditModalVisible(false)}>
//           <View style={styles.modalOverlay} />
//         </TouchableWithoutFeedback>
        
//         <View style={styles.modalContainer}>
//           <View style={styles.modalHeader}>
//             <Text style={styles.modalTitle}>Edit Profile</Text>
//             <TouchableOpacity 
//               style={styles.closeButton}
//               onPress={() => setEditModalVisible(false)}
//             >
//               <X size={24} color="#666" />
//             </TouchableOpacity>
//           </View>

//           <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
//             {/* Profile Picture */}
//             <View style={styles.section}>
//               <Text style={styles.sectionTitle}>Profile Picture</Text>
//               <TouchableOpacity style={styles.imageUploadContainer} onPress={pickImage}>
//                 {formData.profilePhotoUrl ? (
//                   <Image 
//                     source={{ uri: formData.profilePhotoUrl.uri || formData.profilePhotoUrl }} 
//                     style={styles.modalProfileImage} 
//                   />
//                 ) : (
//                   <View style={styles.modalProfileImagePlaceholder}>
//                     <User size={40} color="#666" />
//                   </View>
//                 )}
//               </TouchableOpacity>
//             </View>

//             {/* Basic Information */}
//             <View style={styles.section}>
//               <Text style={styles.sectionTitle}>Basic Information</Text>
              
//               <View style={styles.inputContainer}>
//                 <View style={styles.inputWrapper}>
//                   <User size={20} color="#666" style={styles.inputIcon} />
//                   <TextInput
//                     style={[styles.input, errors.name && styles.inputError]}
//                     placeholder="Full name"
//                     value={formData.name}
//                     onChangeText={(value) => handleInputChange('name', value)}
//                   />
//                 </View>
//                 {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
//               </View>

//               <View style={styles.inputContainer}>
//                 <View style={styles.inputWrapper}>
//                   <Mail size={20} color="#666" style={styles.inputIcon} />
//                   <TextInput
//                     style={[styles.input, errors.email && styles.inputError]}
//                     placeholder="Email"
//                     value={formData.email}
//                     onChangeText={(value) => handleInputChange('email', value)}
//                     keyboardType="email-address"
//                   />
//                 </View>
//                 {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
//               </View>

//               <View style={styles.inputContainer}>
//                 <View style={styles.inputWrapper}>
//                   <Phone size={20} color="#666" style={styles.inputIcon} />
//                   <TextInput
//                     style={[styles.input, errors.phone && styles.inputError]}
//                     placeholder="Phone number"
//                     value={formData.phone}
//                     onChangeText={(value) => handleInputChange('phone', value)}
//                     keyboardType="phone-pad"
//                   />
//                 </View>
//                 {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
//               </View>
//             </View>

//             {/* Professional Information */}
//             <View style={styles.section}>
//               <Text style={styles.sectionTitle}>Professional Information</Text>
              
//               <View style={styles.inputContainer}>
//                 <View style={styles.inputWrapper}>
//                   <Stethoscope size={20} color="#666" style={styles.inputIcon} />
//                   <TextInput
//                     style={[styles.input, errors.specialization && styles.inputError]}
//                     placeholder="Specialization"
//                     value={formData.specialization}
//                     onChangeText={(value) => handleInputChange('specialization', value)}
//                   />
//                 </View>
//                 {errors.specialization && <Text style={styles.errorText}>{errors.specialization}</Text>}
//               </View>

//               <View style={styles.inputContainer}>
//                 <View style={styles.inputWrapper}>
//                   <Award size={20} color="#666" style={styles.inputIcon} />
//                   <TextInput
//                     style={[styles.input, errors.qualification && styles.inputError]}
//                     placeholder="Qualification"
//                     value={formData.qualification}
//                     onChangeText={(value) => handleInputChange('qualification', value)}
//                   />
//                 </View>
//                 {errors.qualification && <Text style={styles.errorText}>{errors.qualification}</Text>}
//               </View>

//               <View style={styles.inputContainer}>
//                 <View style={styles.inputWrapper}>
//                   <Briefcase size={20} color="#666" style={styles.inputIcon} />
//                   <TextInput
//                     style={[styles.input, errors.experience && styles.inputError]}
//                     placeholder="Experience"
//                     value={formData.experience}
//                     onChangeText={(value) => handleInputChange('experience', value)}
//                   />
//                 </View>
//                 {errors.experience && <Text style={styles.errorText}>{errors.experience}</Text>}
//               </View>

//               <View style={styles.inputContainer}>
//                 <View style={styles.inputWrapper}>
//                   <Calendar size={20} color="#666" style={styles.inputIcon} />
//                   <TextInput
//                     style={[styles.input, errors.registration && styles.inputError]}
//                     placeholder="Registration Number"
//                     value={formData.registration}
//                     onChangeText={(value) => handleInputChange('registration', value)}
//                   />
//                 </View>
//                 {errors.registration && <Text style={styles.errorText}>{errors.registration}</Text>}
//               </View>
//             </View>

//             {/* Submit Button */}
//             <TouchableOpacity
//               style={[styles.submitButton, isUploading && styles.submitButtonDisabled]}
//               onPress={handleSubmit}
//               disabled={isUploading}
//             >
//               <Text style={styles.submitButtonText}>
//                 {isUploading ? 'Saving...' : 'Save Changes'}
//               </Text>
//             </TouchableOpacity>
//           </ScrollView>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   scrollContainer: {
//     flex: 1,
//   },
//   loadingContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF'
//   },
//   loadingText: {
//     marginTop: 20,
//     color: '#4E8D7C',
//     fontSize: 16
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#FFFFFF'
//   },
//   emptyTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#2C3E50',
//     marginBottom: 10
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#7D7D7D',
//     marginBottom: 20
//   },
//   refreshButton: {
//     backgroundColor: '#4E8D7C',
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 8,
//   },
//   refreshButtonText: {
//     color: 'white',
//     fontWeight: '500',
//     fontSize: 16,
//   },
//   reviewBanner: {
//     backgroundColor: '#FFF3E0',
//     padding: 16,
//     margin: 16,
//     borderRadius: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderLeftWidth: 4,
//     borderLeftColor: '#E67C00',
//   },
//   bannerTextContainer: {
//     flex: 1,
//     marginLeft: 12,
//   },
//   reviewBannerText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#E67C00',
//     marginBottom: 4,
//   },
//   reviewBannerSubtext: {
//     fontSize: 14,
//     color: '#E67C00',
//     opacity: 0.8,
//     lineHeight: 20
//   },
//   header: {
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     paddingTop: 40,
//     paddingBottom: 32,
//     paddingHorizontal: 24,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e1e5e9',
//   },
//   avatarContainer: {
//     position: 'relative',
//     marginBottom: 16,
//   },
//   avatar: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     backgroundColor: '#4E8D7C20',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 3,
//     borderColor: '#4E8D7C',
//   },
//   profileImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     borderWidth: 3,
//     borderColor: '#4E8D7C',
//   },
//   editButton: {
//     position: 'absolute',
//     bottom: 0,
//     right: 0,
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: '#fff',
//     borderWidth: 2,
//     borderColor: '#4E8D7C',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   name: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#1a1a1a',
//     marginBottom: 4,
//   },
//   specialization: {
//     fontSize: 16,
//     color: '#4E8D7C',
//     fontWeight: '600',
//   },
//   content: {
//     padding: 24,
//   },
//   section: {
//     marginBottom: 32,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#1a1a1a',
//     marginBottom: 16,
//   },
//   infoContainer: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: '#e1e5e9',
//   },
//   infoItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e1e5e9',
//   },
//   infoIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#f8f9fa',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 16,
//   },
//   infoContent: {
//     flex: 1,
//   },
//   infoLabel: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 4,
//   },
//   infoValue: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#1a1a1a',
//   },
//   clinicsContainer: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: '#e1e5e9',
//   },
//   clinicCard: {
//     padding: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e1e5e9',
//   },
//   clinicName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#1a1a1a',
//     marginBottom: 8,
//   },
//   clinicAddressContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   clinicAddress: {
//     fontSize: 14,
//     color: '#666',
//     marginLeft: 8,
//   },
//   verifiedBadge: {
//     fontSize: 12,
//     color: '#4E8D7C',
//     fontWeight: '600',
//   },
//   pendingBadge: {
//     fontSize: 12,
//     color: '#E67C00',
//     fontStyle: 'italic',
//   },
//   actionsContainer: {
//     gap: 12,
//   },
//   actionButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 20,
//     borderWidth: 1,
//     borderColor: '#e1e5e9',
//   },
//   signOutButton: {
//     borderColor: '#ff3b30',
//     backgroundColor: '#ff3b3010',
//   },
//   actionText: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#4E8D7C',
//     marginLeft: 12,
//   },
//   signOutText: {
//     color: '#ff3b30',
//   },
//   // Modal styles
//   modalOverlay: {
//     position: 'absolute',
//     top: 0,
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     margin: 20,
//     marginTop: 50,
//     marginBottom: 50,
//     backgroundColor: 'white',
//     borderRadius: 20,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   modalTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   closeButton: {
//     padding: 8,
//   },
//   modalContent: {
//     flexGrow: 1,
//   },
//   imageUploadContainer: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   modalProfileImage: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//   },
//   modalProfileImagePlaceholder: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: '#f0f0f0',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   inputContainer: {
//     marginBottom: 15,
//   },
//   inputWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     height: 50,
//   },
//   inputIcon: {
//     marginRight: 10,
//   },
//   input: {
//     flex: 1,
//     height: '100%',
//     color: '#333',
//   },
//   inputError: {
//     borderColor: 'red',
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 12,
//     marginTop: 5,
//     paddingLeft: 5,
//   },
//   submitButton: {
//     backgroundColor: '#4E8D7C',
//     borderRadius: 8,
//     height: 50,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 20,
//     marginBottom: 10,
//   },
//   submitButtonDisabled: {
//     backgroundColor: '#A0C4FF',
//   },
//   submitButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });















import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image, Modal, TouchableWithoutFeedback } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { signOut, veterinarianProfileData } from '../../../store/slices/authSlice';
import { User, Mail, Calendar, MapPin, Phone, LogOut, X, Stethoscope, Award, Briefcase, Edit } from 'lucide-react-native';
import { useEffect, useState } from 'react';

export default function VeterinarianProfile() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const result = await dispatch(veterinarianProfileData()).unwrap();
        if (result.success) {
          setProfileData(result.data);
        } else {
          setProfileData(null);
        }
      } catch (error) {
        console.error('Error fetching veterinarian profile:', error);
        setProfileData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
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

  const profileInfo = [
    { icon: Mail, label: 'Email', value: profileData?.profile?.email || user?.email || 'Not provided' },
    { icon: Phone, label: 'Phone', value: profileData?.profile?.phone || 'Not provided' },
    { icon: Stethoscope, label: 'Specialization', value: profileData?.profile?.specialization || 'Not provided' },
    { icon: Award, label: 'Qualification', value: profileData?.profile?.qualification || 'Not provided' },
    { icon: Briefcase, label: 'Experience', value: profileData?.profile?.experience || 'Not provided' },
    { icon: Calendar, label: 'Registration', value: profileData?.profile?.registration || 'Not registered yet' },
  ];

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#4E8D7C" />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Status Banner - Only show if profile exists but isn't verified */}
        {profileData?.profile && !profileData.profile.isVerified && (
          <View style={styles.reviewBanner}>
            <View style={styles.bannerTextContainer}>
              <Text style={styles.reviewBannerText}>{profileData.status || 'Profile under review'}</Text>
              <Text style={styles.reviewBannerSubtext}>
                {profileData.message || 'Your profile is being reviewed by our team'}
              </Text>
            </View>
          </View>
        )}

        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            {profileData?.profile?.profilePhotoUrl ? (
              <TouchableOpacity onPress={() => setImageModalVisible(true)}>
                <Image
                  source={{ uri: profileData.profile.profilePhotoUrl }}
                  style={styles.profileImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ) : (
              <View style={styles.avatar}>
                <User size={40} color="#4E8D7C" />
              </View>
            )}
          </View>
          <Text style={styles.name}>
            {profileData?.profile?.name || user?.name || 'Veterinarian'}
          </Text>
          {profileData?.profile?.specialization && (
            <Text style={styles.specialization}>{profileData.profile.specialization}</Text>
          )}
        </View>

        {/* Profile Information */}
        <View style={styles.content}>
          {/* Complete Profile Button if no profile data exists */}
          {!profileData?.profile && (
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.completeProfileButton}
                onPress={() => router.push('onboarding/veterinarian_detail')}
              >
                <Edit size={20} color="#4E8D7C" />
                <Text style={styles.completeProfileButtonText}>Complete Your Profile</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Information</Text>
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

          {/* Clinics Section */}
          <View style={styles.section}>
            {/* <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Associated Clinics</Text>
              {profileData?.clinics?.length > 0 && (
                <TouchableOpacity onPress={() => router.push('/vet/add-clinic')}>
                  <Text style={styles.addButtonText}>Add Clinic</Text>
                </TouchableOpacity>
              )}
            </View> */}

            {profileData?.clinics && profileData.clinics.length > 0 ? (
              <View style={styles.clinicsContainer}>
                {profileData.clinics.map((clinic, index) => (
                  <View key={index} style={styles.clinicCard}>
                    <Text style={styles.clinicName}>{clinic.clinicName}</Text>
                    <View style={styles.clinicAddressContainer}>
                      <MapPin size={16} color="#666" />
                      <Text style={styles.clinicAddress}>{clinic.address}</Text>
                    </View>
                    {clinic.verified ? (
                      <Text style={styles.verifiedBadge}>Verified</Text>
                    ) : (
                      <Text style={styles.pendingBadge}>Verification Pending</Text>
                    )}
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyClinicsContainer}>
                <Text style={styles.emptyClinicsText}>No clinics registered yet</Text>
                <TouchableOpacity
                  style={styles.addClinicButton}
                  onPress={() => router.push('onboarding/clinic')}
                >
                  <Text style={styles.addClinicButtonText}>Register Your Clinic</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Actions</Text>
            <View style={styles.actionsContainer}>
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

      {/* Image View Modal */}
      <Modal
        visible={imageModalVisible}
        transparent={true}
        onRequestClose={() => setImageModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setImageModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <Image 
              source={{ uri: profileData?.profile?.profilePhotoUrl }} 
              style={styles.fullImage} 
              resizeMode="contain"
            />
            <TouchableOpacity 
              style={styles.closeImageButton}
              onPress={() => setImageModalVisible(false)}
            >
              <X size={30} color="white" />
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: 35
  },
  scrollContainer: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
  },
  loadingText: {
    marginTop: 20,
    color: '#4E8D7C',
    fontSize: 16
  },
  reviewBanner: {
    backgroundColor: '#FFF3E0',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#E67C00',
  },
  bannerTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  reviewBannerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E67C00',
    marginBottom: 4,
  },
  reviewBannerSubtext: {
    fontSize: 14,
    color: '#E67C00',
    opacity: 0.8,
    lineHeight: 20
  },
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 40,
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
    backgroundColor: '#4E8D7C20',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#4E8D7C',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#4E8D7C',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  specialization: {
    fontSize: 16,
    color: '#4E8D7C',
    fontWeight: '600',
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
  addButtonText: {
    fontSize: 14,
    color: '#4E8D7C',
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
  completeProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4E8D7C20',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#4E8D7C',
    gap: 10
  },
  completeProfileButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4E8D7C',
  },
  clinicsContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  clinicCard: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  clinicName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  clinicAddressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  clinicAddress: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  verifiedBadge: {
    fontSize: 12,
    color: '#4E8D7C',
    fontWeight: '600',
  },
  pendingBadge: {
    fontSize: 12,
    color: '#E67C00',
    fontStyle: 'italic',
  },
  emptyClinicsContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  emptyClinicsText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  addClinicButton: {
    backgroundColor: '#4E8D7C',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  addClinicButtonText: {
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
    color: '#4E8D7C',
    marginLeft: 12,
  },
  signOutText: {
    color: '#ff3b30',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '100%',
    height: '80%',
  },
  closeImageButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 10,
  },
});