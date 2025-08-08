// import React, { useState, useEffect } from 'react';
// import {
//     View,
//     Text,
//     StyleSheet,
//     TouchableOpacity,
//     ActivityIndicator,
//     FlatList,
//     Image,
//     Dimensions
// } from 'react-native';
// import { MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
// import { useDispatch, useSelector } from 'react-redux';
// import { getPetsByUserId, clearUserPets } from '../../../store/slices/authSlice';
// import { router } from 'expo-router';
// import { ChevronLeft } from 'lucide-react-native';
// import PetDetailsModal from '../../../components/petparent/home/PetDetailModal';

// const { width } = Dimensions.get('window');
// const PET_TYPES = {
//     Dog: 'dog',
//     Cat: 'cat',
//     default: 'paw'
// };

// const PetCard = ({ pet, onPress }) => {
//     if (!pet) return null;

//     const getPetIcon = () => {
//         return PET_TYPES[pet.species] || PET_TYPES.default;
//     };

//     return (
//         <TouchableOpacity style={styles.card} onPress={onPress}>
//             <View style={styles.cardImageContainer}>
//                 {pet?.petPhoto ? (
//                     <Image source={{ uri: pet.petPhoto }} style={styles.profileImage} />
//                 ) : (
//                     <View style={styles.profilePlaceholder}>
//                         <FontAwesome5
//                             name={getPetIcon()}
//                             size={32}
//                             color="#4E8D7C"
//                         />
//                     </View>
//                 )}
//             </View>

//             <View style={styles.cardContent}>
//                 <View style={styles.cardHeader}>
//                     <Text style={styles.petName} numberOfLines={1}>{pet.name}</Text>
//                     <View style={styles.typeBadge}>
//                         <Text style={styles.typeText}>{pet.species}</Text>
//                     </View>
//                 </View>

//                 <View style={styles.detailsRow}>
//                     <View style={styles.detailItem}>
//                         <MaterialCommunityIcons name="gender-male-female" size={16} color="#7D7D7D" />
//                         <Text style={styles.detailText}>{pet.gender}</Text>
//                     </View>
//                     {pet.breed && (
//                         <View style={styles.detailItem}>
//                             <FontAwesome5 name="dna" size={14} color="#7D7D7D" />
//                             <Text style={styles.detailText}>{pet.breed}</Text>
//                         </View>
//                     )}
//                 </View>

//                 {pet.dob && (
//                     <View style={styles.detailsRow}>
//                         <View style={styles.detailItem}>
//                             <MaterialIcons name="cake" size={16} color="#7D7D7D" />
//                             <Text style={styles.detailText}>
//                                 {new Date(pet.dob).toLocaleDateString()}
//                             </Text>
//                         </View>
//                     </View>
//                 )}

//                 <View style={styles.statsContainer}>
//                     {pet.weight && <StatItem value={`${pet.weight} kg`} label="Weight" />}
//                     {pet.height && <StatItem value={`${pet.height} cm`} label="Height" />}
//                     {pet.age && <StatItem value={pet.age} label="Age" />}
//                 </View>
//             </View>
//         </TouchableOpacity>
//     );
// };

// const StatItem = ({ value, label }) => (
//     <View style={styles.statItem}>
//         <Text style={styles.statValue}>{value}</Text>
//         <Text style={styles.statLabel}>{label}</Text>
//     </View>
// );

// const PetListScreen = () => {
//     const dispatch = useDispatch();
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [refreshing, setRefreshing] = useState(false);
//     const [selectedPet, setSelectedPet] = useState(null);
//     const [modalVisible, setModalVisible] = useState(false);

//     const pets = useSelector(state => state.auth?.userPets?.data || []);

//     useEffect(() => {
//         fetchPets();
//         return () => dispatch(clearUserPets());
//     }, [dispatch]);

//     const fetchPets = async () => {
//         try {
//             setLoading(true);
//             const result = await dispatch(getPetsByUserId()).unwrap();
//             if (result.error) throw new Error(result.payload || 'Failed to load pets');
//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleRefresh = async () => {
//         try {
//             setRefreshing(true);
//             await dispatch(getPetsByUserId());
//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setRefreshing(false);
//         }
//     };

//     const handlePetPress = (pet) => {
//         setSelectedPet(pet);
//         setModalVisible(true);
//     };

//     if (loading && !refreshing) return <LoadingView />;
//     if (error) return <ErrorView error={error} onRetry={() => {
//         setError(null);
//         dispatch(getPetsByUserId());
//     }} />;

//     return (
//         <View style={styles.container}>
//             <Header />

//             <View style={styles.resultsContainer}>
//                 <Text style={styles.resultsText}>
//                     {pets.length} {pets.length === 1 ? 'Pet' : 'Pets'} Registered
//                 </Text>
//                 <TouchableOpacity onPress={handleRefresh}>
//                     <MaterialIcons name="refresh" size={24} color="#4E8D7C" />
//                 </TouchableOpacity>
//             </View>

//             {pets.length === 0 ? (
//                 <EmptyState onAddPet={() => router.navigate('/pages/PetDetail')} />
//             ) : (
//                 <>
//                     <FlatList
//                         data={pets}
//                         renderItem={({ item }) => <PetCard pet={item} onPress={() => handlePetPress(item)} />}
//                         keyExtractor={(item) => item._id || String(Math.random())}
//                         contentContainerStyle={styles.listContainer}
//                         showsVerticalScrollIndicator={false}
//                         refreshing={refreshing}
//                         onRefresh={handleRefresh}
//                     />
//                     <TouchableOpacity
//                         style={styles.addButtonFloating}
//                         onPress={() => router.navigate('/pages/PetDetail')}
//                     >
//                         <MaterialIcons name="add" size={28} color="white" />
//                     </TouchableOpacity>
                    
//                     <PetDetailsModal
//                         pet={selectedPet}
//                         visible={modalVisible}
//                         onClose={() => setModalVisible(false)}
//                     />
//                 </>
//             )}
//         </View>
//     );
// };

// const Header = () => (
//     <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.back()} style={styles.menuButton}>
//             <ChevronLeft size={24} color="#1a1a1a" />
//         </TouchableOpacity>
//         <View>
//             <Text style={styles.headerTitle}>My Pets</Text>
//             <Text style={styles.headerSubtitle}>Your registered companions</Text>
//         </View>
//     </View>
// );

// const LoadingView = () => (
//     <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#4E8D7C" />
//         <Text style={styles.loadingText}>Loading your pets...</Text>
//     </View>
// );

// const ErrorView = ({ error, onRetry }) => (
//     <View style={styles.errorContainer}>
//         <MaterialIcons name="error-outline" size={50} color="#E74C3C" />
//         <Text style={styles.errorText}>{error}</Text>
//         <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
//             <Text style={styles.retryButtonText}>Try Again</Text>
//         </TouchableOpacity>
//     </View>
// );

// const EmptyState = ({ onAddPet }) => (
//     <View style={styles.emptyContainer}>
//         <FontAwesome5 name="paw" size={60} color="#E0E0E0" />
//         <Text style={styles.emptyTitle}>No Pets Found</Text>
//         <Text style={styles.emptyText}>You haven't registered any pets yet</Text>
//         <TouchableOpacity style={styles.addPetButton} onPress={onAddPet}>
//             <Text style={styles.addPetButtonText}>Register a Pet</Text>
//         </TouchableOpacity>
//     </View>
// );

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#F8F9FA',
//         paddingHorizontal: 16,
//         paddingTop: 50
//     },
//     header: {
//         marginBottom: 20,
//         paddingHorizontal: 8,
//         display: "flex",
//         flexDirection: 'row'
//     },
//     headerTitle: {
//         fontSize: 28,
//         fontWeight: '700',
//         color: '#2C3E50',
//         marginBottom: 4
//     },
//     headerSubtitle: {
//         fontSize: 16,
//         color: '#7D7D7D'
//     },
//     loadingContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#F8F9FA'
//     },
//     loadingText: {
//         marginTop: 16,
//         color: '#4E8D7C',
//         fontSize: 16
//     },
//     errorContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 20,
//         backgroundColor: '#F8F9FA'
//     },
//     errorText: {
//         fontSize: 16,
//         color: '#E74C3C',
//         marginVertical: 20,
//         textAlign: 'center'
//     },
//     retryButton: {
//         backgroundColor: '#4E8D7C',
//         padding: 12,
//         borderRadius: 8,
//         marginTop: 10
//     },
//     retryButtonText: {
//         color: 'white',
//         fontWeight: '600'
//     },
//     resultsContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: 16,
//         paddingHorizontal: 8
//     },
//     resultsText: {
//         color: '#2C3E50',
//         fontSize: 16,
//         fontWeight: '600'
//     },
//     emptyContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 40
//     },
//     emptyTitle: {
//         fontSize: 22,
//         fontWeight: '600',
//         color: '#2C3E50',
//         marginTop: 16
//     },
//     emptyText: {
//         fontSize: 16,
//         color: '#7D7D7D',
//         textAlign: 'center',
//         marginTop: 8,
//         marginBottom: 24
//     },
//     addPetButton: {
//         paddingHorizontal: 24,
//         paddingVertical: 12,
//         backgroundColor: '#4E8D7C',
//         borderRadius: 8
//     },
//     addPetButtonText: {
//         color: 'white',
//         fontWeight: '600'
//     },
//     listContainer: {
//         paddingBottom: 30
//     },
//     card: {
//         backgroundColor: 'white',
//         borderRadius: 16,
//         padding: 16,
//         marginBottom: 16,
//         flexDirection: 'row',
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.08,
//         shadowRadius: 8,
//         elevation: 3
//     },
//     cardImageContainer: {
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//         elevation: 2
//     },
//     profileImage: {
//         width: 90,
//         height: 90,
//         borderRadius: 12,
//         marginRight: 16
//     },
//     profilePlaceholder: {
//         width: 90,
//         height: 90,
//         borderRadius: 12,
//         backgroundColor: '#F0F7F4',
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginRight: 16
//     },
//     cardContent: {
//         flex: 1
//     },
//     cardHeader: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: 8
//     },
//     petName: {
//         fontSize: 18,
//         fontWeight: '700',
//         color: '#2C3E50',
//         flex: 1,
//         marginRight: 10
//     },
//     typeBadge: {
//         paddingHorizontal: 10,
//         paddingVertical: 4,
//         borderRadius: 12,
//         backgroundColor: '#E8F5E9',
//         borderColor: '#4E8D7C',
//         borderWidth: 1
//     },
//     typeText: {
//         fontSize: 12,
//         color: '#4E8D7C',
//         fontWeight: '600'
//     },
//     detailsRow: {
//         flexDirection: 'row',
//         marginBottom: 8
//     },
//     detailItem: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginRight: 16
//     },
//     detailText: {
//         fontSize: 14,
//         color: '#555',
//         marginLeft: 4
//     },
//     statsContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginTop: 8,
//         paddingTop: 8,
//         borderTopWidth: 1,
//         borderTopColor: '#EEE'
//     },
//     statItem: {
//         alignItems: 'center'
//     },
//     statValue: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: '#2C3E50'
//     },
//     statLabel: {
//         fontSize: 12,
//         color: '#7D7D7D',
//         marginTop: 2
//     },
//     menuButton: {
//         marginRight: 20,
//         justifyContent: 'center',
//         padding: 5
//     },
//     addButtonFloating: {
//         position: 'absolute',
//         bottom: 30,
//         right: 30,
//         width: 60,
//         height: 60,
//         borderRadius: 30,
//         backgroundColor: '#4E8D7C',
//         justifyContent: 'center',
//         alignItems: 'center',
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.3,
//         shadowRadius: 4,
//         elevation: 5
//     }
// });

// export default PetListScreen;




















// import React, { useState, useEffect } from 'react';
// import {
//     View,
//     Text,
//     StyleSheet,
//     TouchableOpacity,
//     ActivityIndicator,
//     FlatList,
//     Image,
//     Dimensions,
//     Modal,
//     ScrollView,
//     TextInput,
//     TouchableWithoutFeedback,
//     Alert
// } from 'react-native';
// import { MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
// import { useDispatch, useSelector } from 'react-redux';
// import { getPetsByUserId, clearUserPets, updatePet } from '../../../store/slices/authSlice';
// import { router } from 'expo-router';
// import { ChevronLeft } from 'lucide-react-native';
// import PetDetailsModal from '../../../components/petparent/home/PetDetailModal';
// import * as ImagePicker from 'expo-image-picker';
// import * as FileSystem from 'expo-file-system';

// const { width } = Dimensions.get('window');
// const PET_TYPES = {
//     Dog: 'dog',
//     Cat: 'cat',
//     default: 'paw'
// };

// const PetCard = ({ pet, onPress, onEdit }) => {
//     if (!pet) return null;

//     const getPetIcon = () => {
//         return PET_TYPES[pet.species] || PET_TYPES.default;
//     };

//     return (
//         <TouchableOpacity style={styles.card} onPress={onPress}>
//             <View style={styles.cardImageContainer}>
//                 {pet?.petPhoto ? (
//                     <Image source={{ uri: pet.petPhoto }} style={styles.profileImage} />
//                 ) : (
//                     <View style={styles.profilePlaceholder}>
//                         <FontAwesome5
//                             name={getPetIcon()}
//                             size={32}
//                             color="#4E8D7C"
//                         />
//                     </View>
//                 )}
//             </View>

//             <View style={styles.cardContent}>
//                 <View style={styles.cardHeader}>
//                     <Text style={styles.petName} numberOfLines={1}>{pet.name}</Text>
//                     <View style={styles.typeBadge}>
//                         <Text style={styles.typeText}>{pet.species}</Text>
//                     </View>
//                     <TouchableOpacity onPress={(e) => {
//                         e.stopPropagation();
//                         onEdit();
//                     }}>
//                         <MaterialIcons name="edit" size={20} color="#4E8D7C" />
//                     </TouchableOpacity>
//                 </View>

//                 <View style={styles.detailsRow}>
//                     <View style={styles.detailItem}>
//                         <MaterialCommunityIcons name="gender-male-female" size={16} color="#7D7D7D" />
//                         <Text style={styles.detailText}>{pet.gender}</Text>
//                     </View>
//                     {pet.breed && (
//                         <View style={styles.detailItem}>
//                             <FontAwesome5 name="dna" size={14} color="#7D7D7D" />
//                             <Text style={styles.detailText}>{pet.breed}</Text>
//                         </View>
//                     )}
//                 </View>

//                 {pet.dob && (
//                     <View style={styles.detailsRow}>
//                         <View style={styles.detailItem}>
//                             <MaterialIcons name="cake" size={16} color="#7D7D7D" />
//                             <Text style={styles.detailText}>
//                                 {new Date(pet.dob).toLocaleDateString()}
//                             </Text>
//                         </View>
//                     </View>
//                 )}

//                 <View style={styles.statsContainer}>
//                     {pet.weight && <StatItem value={`${pet.weight} kg`} label="Weight" />}
//                     {pet.height && <StatItem value={`${pet.height} cm`} label="Height" />}
//                     {pet.age && <StatItem value={pet.age} label="Age" />}
//                 </View>
//             </View>
//         </TouchableOpacity>
//     );
// };

// const StatItem = ({ value, label }) => (
//     <View style={styles.statItem}>
//         <Text style={styles.statValue}>{value}</Text>
//         <Text style={styles.statLabel}>{label}</Text>
//     </View>
// );

// const PetListScreen = () => {
//     const dispatch = useDispatch();
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [refreshing, setRefreshing] = useState(false);
//     const [selectedPet, setSelectedPet] = useState(null);
//     const [modalVisible, setModalVisible] = useState(false);
//     const [editModalVisible, setEditModalVisible] = useState(false);
//     const [isUploading, setIsUploading] = useState(false);
//     const [formData, setFormData] = useState({
//         name: '',
//         species: '',
//         breed: '',
//         gender: '',
//         dob: '',
//         color: '',
//         weight: '',
//         height: '',
//         bloodGroup: '',
//         allergies: '',
//         chronicDiseases: '',
//         currentMedications: '',
//         pastMedications: '',
//         vaccinations: '',
//         surgeries: '',
//         injuries: '',
//         distinctiveFeatures: '',
//         notes: '',
//         location: '',
//         lastVetVisit: '',
//         nextVetVisit: '',
//         petPhoto: null
//     });

//     const pets = useSelector(state => state.auth?.userPets?.data || []);

//     useEffect(() => {
//         fetchPets();
//         return () => dispatch(clearUserPets());
//     }, [dispatch]);

//     const fetchPets = async () => {
//         try {
//             setLoading(true);
//             const result = await dispatch(getPetsByUserId()).unwrap();
//             if (result.error) throw new Error(result.payload || 'Failed to load pets');
//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleRefresh = async () => {
//         try {
//             setRefreshing(true);
//             await dispatch(getPetsByUserId());
//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setRefreshing(false);
//         }
//     };

//     const handlePetPress = (pet) => {
//         setSelectedPet(pet);
//         setModalVisible(true);
//     };

//     const handleEditPress = (pet) => {
//         setSelectedPet(pet);
//         setFormData({
//             name: pet.name || '',
//             species: pet.species || '',
//             breed: pet.breed || '',
//             gender: pet.gender || '',
//             dob: pet.dob || '',
//             color: pet.color || '',
//             weight: pet.weight ? String(pet.weight) : '',
//             height: pet.height ? String(pet.height) : '',
//             bloodGroup: pet.bloodGroup || '',
//             allergies: pet.allergies || '',
//             chronicDiseases: pet.chronicDiseases || '',
//             currentMedications: pet.currentMedications || '',
//             pastMedications: pet.pastMedications || '',
//             vaccinations: pet.vaccinations || '',
//             surgeries: pet.surgeries || '',
//             injuries: pet.injuries || '',
//             distinctiveFeatures: pet.distinctiveFeatures || '',
//             notes: pet.notes || '',
//             location: pet.location || '',
//             lastVetVisit: pet.lastVetVisit || '',
//             nextVetVisit: pet.nextVetVisit || '',
//             petPhoto: pet.petPhoto || null
//         });
//         setEditModalVisible(true);
//     };

//     const uploadToCloudinary = async (file) => {
//         const fileExtension = file.uri.split('.').pop().toLowerCase();
//         const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension);
//         const type = isImage ? 'image' : 'raw';

//         try {
//             const fileInfo = await FileSystem.getInfoAsync(file.uri, { size: true });
//             if (!fileInfo.exists) throw new Error(`File not found: ${file.uri}`);
//             if (fileInfo.size === 0) throw new Error('Empty file');

//             const formData = new FormData();
//             formData.append('file', {
//                 uri: file.uri,
//                 name: file.name || `pet_upload_${Date.now()}.${fileExtension}`,
//                 type: isImage ? `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`
//                     : file.type || 'application/octet-stream'
//             });
//             formData.append('upload_preset', 'vetician');
//             formData.append('cloud_name', 'dqwzfs4ox');

//             const response = await fetch(
//                 `https://api.cloudinary.com/v1_1/dqwzfs4ox/${type}/upload`,
//                 {
//                     method: 'POST',
//                     body: formData,
//                     headers: {
//                         'Content-Type': 'multipart/form-data',
//                     },
//                 }
//             );

//             if (!response.ok) {
//                 throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//             }

//             const data = await response.json();
//             return data;
//         } catch (error) {
//             console.error('[Cloudinary] UPLOAD FAILED:', error);
//             throw error;
//         }
//     };

//     const pickImage = async () => {
//         try {
//             const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//             if (status !== 'granted') {
//                 Alert.alert('Permission required', 'We need camera roll permissions to upload images');
//                 return;
//             }

//             let result = await ImagePicker.launchImageLibraryAsync({
//                 mediaTypes: ImagePicker.MediaTypeOptions.Images,
//                 allowsEditing: true,
//                 aspect: [1, 1],
//                 quality: 0.8,
//             });

//             if (!result.canceled) {
//                 const selectedAsset = result.assets[0];
//                 setFormData(prev => ({
//                     ...prev,
//                     petPhoto: {
//                         uri: selectedAsset.uri,
//                         name: selectedAsset.fileName || `image_${Date.now()}.jpg`,
//                         type: 'image/jpeg'
//                     }
//                 }));
//             }
//         } catch (error) {
//             console.error('Image picker error:', error);
//             Alert.alert('Error', 'Failed to pick image. Please try again.');
//         }
//     };

//     const handleInputChange = (field, value) => {
//         setFormData(prev => ({ ...prev, [field]: value }));
//     };

//     const handleSubmit = async () => {
//         try {
//             setIsUploading(true);
//             let imageUrl = selectedPet?.petPhoto || null;

//             if (formData.petPhoto && formData.petPhoto.uri !== selectedPet?.petPhoto) {
//                 const cloudinaryResponse = await uploadToCloudinary(formData.petPhoto);
//                 imageUrl = cloudinaryResponse.secure_url;
//             }

//             const updatedPetData = {
//                 ...formData,
//                 petPhoto: imageUrl,
//                 weight: formData.weight ? parseFloat(formData.weight) : null,
//                 height: formData.height ? parseFloat(formData.height) : null
//             };

//             const result = await dispatch(updatePet({
//                 petId: selectedPet._id,
//                 petData: updatedPetData
//             })).unwrap();

//             if (result.success) {
//                 Alert.alert(
//                     'Success',
//                     'Pet updated successfully!',
//                     [{ text: 'OK', onPress: () => {
//                         setEditModalVisible(false);
//                         dispatch(getPetsByUserId());
//                     }}]
//                 );
//             }
//         } catch (error) {
//             console.error('Submission error:', error);
//             Alert.alert('Error', error.message || 'An error occurred while updating pet');
//         } finally {
//             setIsUploading(false);
//         }
//     };

//     if (loading && !refreshing) return <LoadingView />;
//     if (error) return <ErrorView error={error} onRetry={() => {
//         setError(null);
//         dispatch(getPetsByUserId());
//     }} />;

//     return (
//         <View style={styles.container}>
//             <Header />

//             <View style={styles.resultsContainer}>
//                 <Text style={styles.resultsText}>
//                     {pets.length} {pets.length === 1 ? 'Pet' : 'Pets'} Registered
//                 </Text>
//                 <TouchableOpacity onPress={handleRefresh}>
//                     <MaterialIcons name="refresh" size={24} color="#4E8D7C" />
//                 </TouchableOpacity>
//             </View>

//             {pets.length === 0 ? (
//                 <EmptyState onAddPet={() => router.navigate('/pages/PetDetail')} />
//             ) : (
//                 <>
//                     <FlatList
//                         data={pets}
//                         renderItem={({ item }) => (
//                             <PetCard 
//                                 pet={item} 
//                                 onPress={() => handlePetPress(item)} 
//                                 onEdit={() => handleEditPress(item)}
//                             />
//                         )}
//                         keyExtractor={(item) => item._id || String(Math.random())}
//                         contentContainerStyle={styles.listContainer}
//                         showsVerticalScrollIndicator={false}
//                         refreshing={refreshing}
//                         onRefresh={handleRefresh}
//                     />
//                     <TouchableOpacity
//                         style={styles.addButtonFloating}
//                         onPress={() => router.navigate('/pages/PetDetail')}
//                     >
//                         <MaterialIcons name="add" size={28} color="white" />
//                     </TouchableOpacity>
                    
//                     <PetDetailsModal
//                         pet={selectedPet}
//                         visible={modalVisible}
//                         onClose={() => setModalVisible(false)}
//                     />

//                     {/* Edit Pet Modal */}
//                     <Modal
//                         visible={editModalVisible}
//                         animationType="fade"
//                         transparent={true}
//                         onRequestClose={() => setEditModalVisible(false)}
//                     >
//                         <TouchableWithoutFeedback onPress={() => setEditModalVisible(false)}>
//                             <View style={styles.modalOverlay} />
//                         </TouchableWithoutFeedback>
                        
//                         <View style={styles.modalContainer}>
//                             <View style={styles.modalHeader}>
//                                 <Text style={styles.modalTitle}>Edit Pet Details</Text>
//                                 <TouchableOpacity 
//                                     style={styles.closeButton}
//                                     onPress={() => setEditModalVisible(false)}
//                                 >
//                                     <MaterialIcons name="close" size={24} color="#666" />
//                                 </TouchableOpacity>
//                             </View>

//                             <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
//                                 <View style={styles.section}>
//                                     <Text style={styles.sectionTitle}>Profile Picture</Text>
//                                     <TouchableOpacity style={styles.imageUploadContainer} onPress={pickImage}>
//                                         {formData.petPhoto ? (
//                                             <Image 
//                                                 source={{ 
//                                                     uri: formData.petPhoto.uri || formData.petPhoto 
//                                                 }} 
//                                                 style={styles.modalProfileImage} 
//                                             />
//                                         ) : (
//                                             <View style={styles.modalProfileImagePlaceholder}>
//                                                 <FontAwesome5 
//                                                     name={PET_TYPES[formData.species] || PET_TYPES.default} 
//                                                     size={40} 
//                                                     color="#666" 
//                                                 />
//                                             </View>
//                                         )}
//                                     </TouchableOpacity>
//                                 </View>

//                                 <View style={styles.section}>
//                                     <Text style={styles.sectionTitle}>Basic Information</Text>
//                                     <View style={styles.inputContainer}>
//                                         <TextInput
//                                             style={styles.input}
//                                             placeholder="Pet Name"
//                                             value={formData.name}
//                                             onChangeText={(value) => handleInputChange('name', value)}
//                                         />
//                                     </View>

//                                     <View style={styles.inputContainer}>
//                                         <TextInput
//                                             style={styles.input}
//                                             placeholder="Species (Dog, Cat, etc.)"
//                                             value={formData.species}
//                                             onChangeText={(value) => handleInputChange('species', value)}
//                                         />
//                                     </View>

//                                     <View style={styles.inputContainer}>
//                                         <TextInput
//                                             style={styles.input}
//                                             placeholder="Breed"
//                                             value={formData.breed}
//                                             onChangeText={(value) => handleInputChange('breed', value)}
//                                         />
//                                     </View>

//                                     <View style={styles.inputContainer}>
//                                         <TextInput
//                                             style={styles.input}
//                                             placeholder="Gender"
//                                             value={formData.gender}
//                                             onChangeText={(value) => handleInputChange('gender', value)}
//                                         />
//                                     </View>

//                                     <View style={styles.inputContainer}>
//                                         <TextInput
//                                             style={styles.input}
//                                             placeholder="Date of Birth (YYYY-MM-DD)"
//                                             value={formData.dob}
//                                             onChangeText={(value) => handleInputChange('dob', value)}
//                                         />
//                                     </View>

//                                     <View style={styles.inputContainer}>
//                                         <TextInput
//                                             style={styles.input}
//                                             placeholder="Color"
//                                             value={formData.color}
//                                             onChangeText={(value) => handleInputChange('color', value)}
//                                         />
//                                     </View>
//                                 </View>

//                                 <View style={styles.section}>
//                                     <Text style={styles.sectionTitle}>Physical Attributes</Text>
//                                     <View style={styles.row}>
//                                         <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
//                                             <TextInput
//                                                 style={styles.input}
//                                                 placeholder="Weight (kg)"
//                                                 value={formData.weight}
//                                                 onChangeText={(value) => handleInputChange('weight', value)}
//                                                 keyboardType="numeric"
//                                             />
//                                         </View>
//                                         <View style={[styles.inputContainer, { flex: 1 }]}>
//                                             <TextInput
//                                                 style={styles.input}
//                                                 placeholder="Height (cm)"
//                                                 value={formData.height}
//                                                 onChangeText={(value) => handleInputChange('height', value)}
//                                                 keyboardType="numeric"
//                                             />
//                                         </View>
//                                     </View>

//                                     <View style={styles.inputContainer}>
//                                         <TextInput
//                                             style={styles.input}
//                                             placeholder="Blood Group"
//                                             value={formData.bloodGroup}
//                                             onChangeText={(value) => handleInputChange('bloodGroup', value)}
//                                         />
//                                     </View>
//                                 </View>

//                                 <View style={styles.section}>
//                                     <Text style={styles.sectionTitle}>Health Information</Text>
//                                     <View style={styles.inputContainer}>
//                                         <TextInput
//                                             style={styles.input}
//                                             placeholder="Allergies"
//                                             value={formData.allergies}
//                                             onChangeText={(value) => handleInputChange('allergies', value)}
//                                             multiline
//                                         />
//                                     </View>

//                                     <View style={styles.inputContainer}>
//                                         <TextInput
//                                             style={styles.input}
//                                             placeholder="Chronic Diseases"
//                                             value={formData.chronicDiseases}
//                                             onChangeText={(value) => handleInputChange('chronicDiseases', value)}
//                                             multiline
//                                         />
//                                     </View>

//                                     <View style={styles.inputContainer}>
//                                         <TextInput
//                                             style={styles.input}
//                                             placeholder="Current Medications"
//                                             value={formData.currentMedications}
//                                             onChangeText={(value) => handleInputChange('currentMedications', value)}
//                                             multiline
//                                         />
//                                     </View>

//                                     <View style={styles.inputContainer}>
//                                         <TextInput
//                                             style={styles.input}
//                                             placeholder="Past Medications"
//                                             value={formData.pastMedications}
//                                             onChangeText={(value) => handleInputChange('pastMedications', value)}
//                                             multiline
//                                         />
//                                     </View>

//                                     <View style={styles.inputContainer}>
//                                         <TextInput
//                                             style={styles.input}
//                                             placeholder="Vaccinations"
//                                             value={formData.vaccinations}
//                                             onChangeText={(value) => handleInputChange('vaccinations', value)}
//                                             multiline
//                                         />
//                                     </View>

//                                     <View style={styles.inputContainer}>
//                                         <TextInput
//                                             style={styles.input}
//                                             placeholder="Surgeries"
//                                             value={formData.surgeries}
//                                             onChangeText={(value) => handleInputChange('surgeries', value)}
//                                             multiline
//                                         />
//                                     </View>

//                                     <View style={styles.inputContainer}>
//                                         <TextInput
//                                             style={styles.input}
//                                             placeholder="Injuries"
//                                             value={formData.injuries}
//                                             onChangeText={(value) => handleInputChange('injuries', value)}
//                                             multiline
//                                         />
//                                     </View>
//                                 </View>

//                                 <View style={styles.section}>
//                                     <Text style={styles.sectionTitle}>Additional Information</Text>
//                                     <View style={styles.inputContainer}>
//                                         <TextInput
//                                             style={styles.input}
//                                             placeholder="Distinctive Features"
//                                             value={formData.distinctiveFeatures}
//                                             onChangeText={(value) => handleInputChange('distinctiveFeatures', value)}
//                                             multiline
//                                         />
//                                     </View>

//                                     <View style={styles.inputContainer}>
//                                         <TextInput
//                                             style={styles.input}
//                                             placeholder="Notes"
//                                             value={formData.notes}
//                                             onChangeText={(value) => handleInputChange('notes', value)}
//                                             multiline
//                                         />
//                                     </View>

//                                     <View style={styles.inputContainer}>
//                                         <TextInput
//                                             style={styles.input}
//                                             placeholder="Location"
//                                             value={formData.location}
//                                             onChangeText={(value) => handleInputChange('location', value)}
//                                         />
//                                     </View>

//                                     <View style={styles.row}>
//                                         <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
//                                             <TextInput
//                                                 style={styles.input}
//                                                 placeholder="Last Vet Visit"
//                                                 value={formData.lastVetVisit}
//                                                 onChangeText={(value) => handleInputChange('lastVetVisit', value)}
//                                             />
//                                         </View>
//                                         <View style={[styles.inputContainer, { flex: 1 }]}>
//                                             <TextInput
//                                                 style={styles.input}
//                                                 placeholder="Next Vet Visit"
//                                                 value={formData.nextVetVisit}
//                                                 onChangeText={(value) => handleInputChange('nextVetVisit', value)}
//                                             />
//                                         </View>
//                                     </View>
//                                 </View>

//                                 <TouchableOpacity
//                                     style={[styles.submitButton, isUploading && styles.submitButtonDisabled]}
//                                     onPress={handleSubmit}
//                                     disabled={isUploading}
//                                 >
//                                     <Text style={styles.submitButtonText}>
//                                         {isUploading ? 'Saving...' : 'Save Changes'}
//                                     </Text>
//                                 </TouchableOpacity>
//                             </ScrollView>
//                         </View>
//                     </Modal>
//                 </>
//             )}
//         </View>
//     );
// };

// const Header = () => (
//     <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.back()} style={styles.menuButton}>
//             <ChevronLeft size={24} color="#1a1a1a" />
//         </TouchableOpacity>
//         <View>
//             <Text style={styles.headerTitle}>My Pets</Text>
//             <Text style={styles.headerSubtitle}>Your registered companions</Text>
//         </View>
//     </View>
// );

// const LoadingView = () => (
//     <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#4E8D7C" />
//         <Text style={styles.loadingText}>Loading your pets...</Text>
//     </View>
// );

// const ErrorView = ({ error, onRetry }) => (
//     <View style={styles.errorContainer}>
//         <MaterialIcons name="error-outline" size={50} color="#E74C3C" />
//         <Text style={styles.errorText}>{error}</Text>
//         <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
//             <Text style={styles.retryButtonText}>Try Again</Text>
//         </TouchableOpacity>
//     </View>
// );

// const EmptyState = ({ onAddPet }) => (
//     <View style={styles.emptyContainer}>
//         <FontAwesome5 name="paw" size={60} color="#E0E0E0" />
//         <Text style={styles.emptyTitle}>No Pets Found</Text>
//         <Text style={styles.emptyText}>You haven't registered any pets yet</Text>
//         <TouchableOpacity style={styles.addPetButton} onPress={onAddPet}>
//             <Text style={styles.addPetButtonText}>Register a Pet</Text>
//         </TouchableOpacity>
//     </View>
// );

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#F8F9FA',
//         paddingHorizontal: 16,
//         paddingTop: 50
//     },
//     header: {
//         marginBottom: 20,
//         paddingHorizontal: 8,
//         display: "flex",
//         flexDirection: 'row'
//     },
//     headerTitle: {
//         fontSize: 28,
//         fontWeight: '700',
//         color: '#2C3E50',
//         marginBottom: 4
//     },
//     headerSubtitle: {
//         fontSize: 16,
//         color: '#7D7D7D'
//     },
//     loadingContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#F8F9FA'
//     },
//     loadingText: {
//         marginTop: 16,
//         color: '#4E8D7C',
//         fontSize: 16
//     },
//     errorContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 20,
//         backgroundColor: '#F8F9FA'
//     },
//     errorText: {
//         fontSize: 16,
//         color: '#E74C3C',
//         marginVertical: 20,
//         textAlign: 'center'
//     },
//     retryButton: {
//         backgroundColor: '#4E8D7C',
//         padding: 12,
//         borderRadius: 8,
//         marginTop: 10
//     },
//     retryButtonText: {
//         color: 'white',
//         fontWeight: '600'
//     },
//     resultsContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: 16,
//         paddingHorizontal: 8
//     },
//     resultsText: {
//         color: '#2C3E50',
//         fontSize: 16,
//         fontWeight: '600'
//     },
//     emptyContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 40
//     },
//     emptyTitle: {
//         fontSize: 22,
//         fontWeight: '600',
//         color: '#2C3E50',
//         marginTop: 16
//     },
//     emptyText: {
//         fontSize: 16,
//         color: '#7D7D7D',
//         textAlign: 'center',
//         marginTop: 8,
//         marginBottom: 24
//     },
//     addPetButton: {
//         paddingHorizontal: 24,
//         paddingVertical: 12,
//         backgroundColor: '#4E8D7C',
//         borderRadius: 8
//     },
//     addPetButtonText: {
//         color: 'white',
//         fontWeight: '600'
//     },
//     listContainer: {
//         paddingBottom: 30
//     },
//     card: {
//         backgroundColor: 'white',
//         borderRadius: 16,
//         padding: 16,
//         marginBottom: 16,
//         flexDirection: 'row',
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.08,
//         shadowRadius: 8,
//         elevation: 3
//     },
//     cardImageContainer: {
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//         elevation: 2
//     },
//     profileImage: {
//         width: 90,
//         height: 90,
//         borderRadius: 12,
//         marginRight: 16
//     },
//     profilePlaceholder: {
//         width: 90,
//         height: 90,
//         borderRadius: 12,
//         backgroundColor: '#F0F7F4',
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginRight: 16
//     },
//     cardContent: {
//         flex: 1
//     },
//     cardHeader: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: 8
//     },
//     petName: {
//         fontSize: 18,
//         fontWeight: '700',
//         color: '#2C3E50',
//         flex: 1,
//         marginRight: 10
//     },
//     typeBadge: {
//         paddingHorizontal: 10,
//         paddingVertical: 4,
//         borderRadius: 12,
//         backgroundColor: '#E8F5E9',
//         borderColor: '#4E8D7C',
//         borderWidth: 1,
//         marginRight: 10
//     },
//     typeText: {
//         fontSize: 12,
//         color: '#4E8D7C',
//         fontWeight: '600'
//     },
//     detailsRow: {
//         flexDirection: 'row',
//         marginBottom: 8
//     },
//     detailItem: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginRight: 16
//     },
//     detailText: {
//         fontSize: 14,
//         color: '#555',
//         marginLeft: 4
//     },
//     statsContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginTop: 8,
//         paddingTop: 8,
//         borderTopWidth: 1,
//         borderTopColor: '#EEE'
//     },
//     statItem: {
//         alignItems: 'center'
//     },
//     statValue: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: '#2C3E50'
//     },
//     statLabel: {
//         fontSize: 12,
//         color: '#7D7D7D',
//         marginTop: 2
//     },
//     menuButton: {
//         marginRight: 20,
//         justifyContent: 'center',
//         padding: 5
//     },
//     addButtonFloating: {
//         position: 'absolute',
//         bottom: 30,
//         right: 30,
//         width: 60,
//         height: 60,
//         borderRadius: 30,
//         backgroundColor: '#4E8D7C',
//         justifyContent: 'center',
//         alignItems: 'center',
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.3,
//         shadowRadius: 4,
//         elevation: 5
//     },
//     // Modal styles
//     modalOverlay: {
//         position: 'absolute',
//         top: 0,
//         bottom: 0,
//         left: 0,
//         right: 0,
//         backgroundColor: 'rgba(0,0,0,0.5)',
//     },
//     modalContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         margin: 20,
//         marginTop: 50,
//         marginBottom: 50,
//         backgroundColor: 'white',
//         borderRadius: 20,
//         padding: 20,
//         shadowColor: '#000',
//         shadowOffset: {
//             width: 0,
//             height: 2,
//         },
//         shadowOpacity: 0.25,
//         shadowRadius: 4,
//         elevation: 5,
//     },
//     modalHeader: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: 20,
//     },
//     modalTitle: {
//         fontSize: 22,
//         fontWeight: 'bold',
//         color: '#333',
//     },
//     closeButton: {
//         padding: 8,
//     },
//     modalContent: {
//         flexGrow: 1,
//     },
//     imageUploadContainer: {
//         alignItems: 'center',
//         marginBottom: 20,
//     },
//     modalProfileImage: {
//         width: 120,
//         height: 120,
//         borderRadius: 60,
//     },
//     modalProfileImagePlaceholder: {
//         width: 120,
//         height: 120,
//         borderRadius: 60,
//         backgroundColor: '#f0f0f0',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     section: {
//         marginBottom: 20,
//     },
//     sectionTitle: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: '#4E8D7C',
//         marginBottom: 10,
//     },
//     inputContainer: {
//         marginBottom: 15,
//     },
//     input: {
//         borderWidth: 1,
//         borderColor: '#ddd',
//         borderRadius: 8,
//         padding: 12,
//         fontSize: 16,
//         color: '#333',
//     },
//     row: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//     },
//     submitButton: {
//         backgroundColor: '#4E8D7C',
//         borderRadius: 8,
//         height: 50,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginTop: 20,
//         marginBottom: 10,
//     },
//     submitButtonDisabled: {
//         backgroundColor: '#A0C4FF',
//     },
//     submitButtonText: {
//         color: 'white',
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
// });

// export default PetListScreen;






















import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Dimensions,
  Image
} from 'react-native';
import { MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { getPetsByUserId, clearUserPets } from '../../../store/slices/authSlice';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import PetDetailsModal from '../../../components/petparent/home/PetDetailModal';

const { width } = Dimensions.get('window');
const PET_TYPES = {
  Dog: 'dog',
  Cat: 'cat',
  default: 'paw'
};

const PetCard = ({ pet, onPress, onEdit }) => {
  if (!pet) return null;

  const getPetIcon = () => {
    return PET_TYPES[pet.species] || PET_TYPES.default;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardImageContainer}>
        {pet?.petPhoto ? (
          <Image source={{ uri: pet.petPhoto }} style={styles.profileImage} />
        ) : (
          <View style={styles.profilePlaceholder}>
            <FontAwesome5
              name={getPetIcon()}
              size={32}
              color="#4E8D7C"
            />
          </View>
        )}
      </View>

      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.petName} numberOfLines={1}>{pet.name}</Text>
          <View style={styles.typeBadge}>
            <Text style={styles.typeText}>{pet.species}</Text>
          </View>
          <TouchableOpacity onPress={(e) => {
            e.stopPropagation();
            onEdit();
          }}>
            <MaterialIcons name="edit" size={20} color="#4E8D7C" />
          </TouchableOpacity>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="gender-male-female" size={16} color="#7D7D7D" />
            <Text style={styles.detailText}>{pet.gender}</Text>
          </View>
          {pet.breed && (
            <View style={styles.detailItem}>
              <FontAwesome5 name="dna" size={14} color="#7D7D7D" />
              <Text style={styles.detailText}>{pet.breed}</Text>
            </View>
          )}
        </View>

        {pet.dob && (
          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <MaterialIcons name="cake" size={16} color="#7D7D7D" />
              <Text style={styles.detailText}>
                {new Date(pet.dob).toLocaleDateString()}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.statsContainer}>
          {pet.weight && <StatItem value={`${pet.weight} kg`} label="Weight" />}
          {pet.height && <StatItem value={`${pet.height} cm`} label="Height" />}
          {pet.age && <StatItem value={pet.age} label="Age" />}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const StatItem = ({ value, label }) => (
  <View style={styles.statItem}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const PetListScreen = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const pets = useSelector(state => state.auth?.userPets?.data || []);

  useEffect(() => {
    fetchPets();
    return () => dispatch(clearUserPets());
  }, [dispatch]);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const result = await dispatch(getPetsByUserId()).unwrap();
      if (result.error) throw new Error(result.payload || 'Failed to load pets');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await dispatch(getPetsByUserId());
    } catch (err) {
      setError(err.message);
    } finally {
      setRefreshing(false);
    }
  };

  const handlePetPress = (pet) => {
    setSelectedPet(pet);
    setModalVisible(true);
  };

  const handleEditPress = (pet) => {
    router.push({
      pathname: 'pages/EditPetScreen',
      params: { petId: pet._id }
    });
  };

  const Header = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} style={styles.menuButton}>
        <ChevronLeft size={24} color="#1a1a1a" />
      </TouchableOpacity>
      <View>
        <Text style={styles.headerTitle}>My Pets</Text>
        <Text style={styles.headerSubtitle}>Your registered companions</Text>
      </View>
    </View>
  );

  const LoadingView = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#4E8D7C" />
      <Text style={styles.loadingText}>Loading your pets...</Text>
    </View>
  );

  const ErrorView = ({ error, onRetry }) => (
    <View style={styles.errorContainer}>
      <MaterialIcons name="error-outline" size={50} color="#E74C3C" />
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  const EmptyState = ({ onAddPet }) => (
    <View style={styles.emptyContainer}>
      <FontAwesome5 name="paw" size={60} color="#E0E0E0" />
      <Text style={styles.emptyTitle}>No Pets Found</Text>
      <Text style={styles.emptyText}>You haven't registered any pets yet</Text>
      <TouchableOpacity style={styles.addPetButton} onPress={onAddPet}>
        <Text style={styles.addPetButtonText}>Register a Pet</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && !refreshing) return <LoadingView />;
  if (error) return <ErrorView error={error} onRetry={() => {
    setError(null);
    dispatch(getPetsByUserId());
  }} />;

  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {pets.length} {pets.length === 1 ? 'Pet' : 'Pets'} Registered
        </Text>
        <TouchableOpacity onPress={handleRefresh}>
          <MaterialIcons name="refresh" size={24} color="#4E8D7C" />
        </TouchableOpacity>
      </View>

      {pets.length === 0 ? (
        <EmptyState onAddPet={() => router.navigate('/pages/PetDetail')} />
      ) : (
        <>
          <FlatList
            data={pets}
            renderItem={({ item }) => (
              <PetCard 
                pet={item} 
                onPress={() => handlePetPress(item)} 
                onEdit={() => handleEditPress(item)}
              />
            )}
            keyExtractor={(item) => item._id || String(Math.random())}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
          <TouchableOpacity
            style={styles.addButtonFloating}
            onPress={() => router.navigate('/pages/PetDetail')}
          >
            <MaterialIcons name="add" size={28} color="white" />
          </TouchableOpacity>
          
          <PetDetailsModal
            pet={selectedPet}
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
    paddingTop: 50
  },
  header: {
    marginBottom: 20,
    paddingHorizontal: 8,
    display: "flex",
    flexDirection: 'row'
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 4
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#7D7D7D'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA'
  },
  loadingText: {
    marginTop: 16,
    color: '#4E8D7C',
    fontSize: 16
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F8F9FA'
  },
  errorText: {
    fontSize: 16,
    color: '#E74C3C',
    marginVertical: 20,
    textAlign: 'center'
  },
  retryButton: {
    backgroundColor: '#4E8D7C',
    padding: 12,
    borderRadius: 8,
    marginTop: 10
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600'
  },
  resultsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8
  },
  resultsText: {
    color: '#2C3E50',
    fontSize: 16,
    fontWeight: '600'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#2C3E50',
    marginTop: 16
  },
  emptyText: {
    fontSize: 16,
    color: '#7D7D7D',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24
  },
  addPetButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#4E8D7C',
    borderRadius: 8
  },
  addPetButtonText: {
    color: 'white',
    fontWeight: '600'
  },
  listContainer: {
    paddingBottom: 30
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3
  },
  cardImageContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    marginRight: 16
  },
  profilePlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: '#F0F7F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16
  },
  cardContent: {
    flex: 1
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  petName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
    flex: 1,
    marginRight: 10
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#E8F5E9',
    borderColor: '#4E8D7C',
    borderWidth: 1,
    marginRight: 10
  },
  typeText: {
    fontSize: 12,
    color: '#4E8D7C',
    fontWeight: '600'
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 8
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16
  },
  detailText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 4
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEE'
  },
  statItem: {
    alignItems: 'center'
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50'
  },
  statLabel: {
    fontSize: 12,
    color: '#7D7D7D',
    marginTop: 2
  },
  menuButton: {
    marginRight: 20,
    justifyContent: 'center',
    padding: 5
  },
  addButtonFloating: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4E8D7C',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5
  }
});

export default PetListScreen;