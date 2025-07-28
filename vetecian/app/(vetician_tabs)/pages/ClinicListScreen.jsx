// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator,
//   TextInput,
//   FlatList,
//   Image,
//   Dimensions
// } from 'react-native';
// import { MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
// import { useDispatch, useSelector } from 'react-redux';
// import { getAllVerifiedClinics } from '../../../store/slices/authSlice';
// import { router } from 'expo-router';
// import { Menu } from 'lucide-react-native';
// import { DrawerActions } from '@react-navigation/native';

// const { width } = Dimensions.get('window');

// const ClinicCard = ({ clinic, onPress }) => {
//   if (!clinic?.clinicDetails) return null;


//   const clinicDetails = clinic.clinicDetails;
//   const vet = clinic?.veterinarianDetails;

//   return (
//     <TouchableOpacity style={styles.card} onPress={onPress}>
//       <View style={styles.cardImageContainer}>
//         {vet?.profilePhotoUrl ? (
//           <Image source={{ uri: vet.profilePhotoUrl }} style={styles.profileImage} />
//         ) : (
//           <View style={styles.profilePlaceholder}>
//             <MaterialIcons name="business" size={32} color="#4E8D7C" />
//           </View>
//         )}
//       </View>

//       <View style={styles.cardContent}>
//         <View style={styles.cardHeader}>
//           <Text style={styles.clinicName} numberOfLines={1}>
//             {clinicDetails.clinicName}
//           </Text>
//           <View style={[
//             styles.verifiedBadge,
//             clinicDetails.verified ? styles.verified : styles.pending
//           ]}>
//             <MaterialIcons
//               name="verified"
//               size={14}
//               color={clinicDetails.verified ? "white" : "white"}
//             />
//             <Text style={styles.verifiedText}>
//               {clinicDetails.verified ? "Verified" : "Pending"}
//             </Text>
//           </View>
//         </View>

//         <Text style={styles.establishmentType}>{clinicDetails.establishmentType}</Text>

//         <View style={styles.location}>
//           <MaterialIcons name="location-on" size={14} color="#7D7D7D" />
//           <Text style={styles.address} numberOfLines={1}>
//             {clinicDetails.locality}, {clinicDetails.city}
//           </Text>
//         </View>

//         {vet && (
//           <View style={styles.vetInfo}>
//             <Text style={styles.vetName}>Dr. {vet.name}</Text>
//             <View style={styles.specialtyContainer}>
//               <FontAwesome5 name="clinic-medical" size={12} color="#4E8D7C" />
//               <Text style={styles.vetSpecialty}>{vet.specialization}</Text>
//             </View>
//             <View style={styles.experienceContainer}>
//               <MaterialCommunityIcons name="clock-outline" size={12} color="#4E8D7C" />
//               <Text style={styles.vetExperience}>{vet.experience} years experience</Text>
//             </View>
//           </View>
//         )}

//         <View style={styles.footer}>
//           <View style={styles.feesContainer}>
//             <Text style={styles.feesLabel}>Consultation:</Text>
//             <Text style={styles.feesValue}>₹{clinicDetails.fees || "NA"}</Text>
//           </View>
//           <View style={styles.ratingContainer}>
//             <MaterialIcons name="star" size={16} color="#FFC107" />
//             <Text style={styles.ratingText}>4.8</Text>
//             <Text style={styles.ratingCount}>(24)</Text>
//           </View>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
// };

// const ClinicListScreen = ({ navigation }) => {
//   const dispatch = useDispatch();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedFilters, setSelectedFilters] = useState({
//     establishmentType: null,
//     serviceType: null,
//     city: null
//   });

//   const clinics = useSelector(state => state.auth.verifiedClinics?.data || []);

//   useEffect(() => {
//     const fetchClinics = async () => {
//       try {
//         setLoading(true);
//         const result = await dispatch(getAllVerifiedClinics());

//         if (result.error) {
//           throw new Error(result.payload || 'Failed to load clinics');
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchClinics();
//   }, [dispatch]);

//   const filteredClinics = clinics.filter(clinic => {
//     if (!clinic?.clinicDetails) return false;

//     const { clinicDetails } = clinic;
//     const searchLower = searchQuery.toLowerCase();

//     const matchesSearch =
//       clinicDetails.clinicName?.toLowerCase().includes(searchLower) ||
//       clinicDetails.city?.toLowerCase().includes(searchLower) ||
//       clinicDetails.locality?.toLowerCase().includes(searchLower) ||
//       (clinic.veterinarianDetails?.name?.toLowerCase().includes(searchLower));

//     const matchesEstablishment =
//       !selectedFilters.establishmentType ||
//       clinicDetails.establishmentType === selectedFilters.establishmentType;

//     let matchesService = true;
//     if (selectedFilters.serviceType && clinicDetails.timings) {
//       const days = Object.values(clinicDetails.timings);
//       matchesService = days.some(day => day && day.type === selectedFilters.serviceType);
//     }

//     const matchesCity =
//       !selectedFilters.city ||
//       clinicDetails.city === selectedFilters.city;

//     return matchesSearch && matchesEstablishment && matchesService && matchesCity;
//   });

//   const establishmentTypes = [...new Set(clinics
//     .filter(c => c?.clinicDetails?.establishmentType)
//     .map(c => c.clinicDetails.establishmentType)
//   )];

//   const cities = [...new Set(clinics
//     .filter(c => c?.clinicDetails?.city)
//     .map(c => c.clinicDetails.city)
//   )];

//   const handleClinicPress = (clinic) => {
//     const clinicData = {
//       clinicDetails: {
//         clinicName: clinic.clinicDetails.clinicName,
//         city: clinic.clinicDetails.city,
//         locality: clinic.clinicDetails.locality,
//         streetAddress: clinic.clinicDetails.streetAddress,
//         establishmentType: clinic.clinicDetails.establishmentType,
//         fees: clinic.clinicDetails.fees,
//         verified: clinic.clinicDetails.verified,
//         timings: clinic.clinicDetails.timings ? { ...clinic.clinicDetails.timings } : null,
//         clinicId: clinic.clinicDetails.clinicId
//       },
//       veterinarianDetails: clinic.veterinarianDetails ? {
//         name: clinic.veterinarianDetails.name,
//         experience: clinic.veterinarianDetails.experience,
//         specialization: clinic.veterinarianDetails.specialization,
//         profilePhotoUrl: clinic.veterinarianDetails.profilePhotoUrl,
//         isVerified: clinic.veterinarianDetails.isVerified,
//         vetId: clinic.veterinarianDetails.vetId,
//         gender: clinic.veterinarianDetails.gender,
//         title: clinic.veterinarianDetails.title
//       } : null
//     };

//     router.navigate({
//       pathname: '/pages/ClinicDetailScreen',
//       params: {
//         clinic: JSON.stringify(clinicData)
//       }
//     });
//   };

//   const toggleFilter = (filterType, value) => {
//     setSelectedFilters(prev => ({
//       ...prev,
//       [filterType]: prev[filterType] === value ? null : value
//     }));
//   };

//   const clearAllFilters = () => {
//     setSearchQuery('');
//     setSelectedFilters({
//       establishmentType: null,
//       serviceType: null,
//       city: null
//     });
//   };

//   const openDrawer = () => {
//     navigation.dispatch(DrawerActions.openDrawer());
//   };

//   if (loading) return (
//     <View style={styles.loadingContainer}>
//       <ActivityIndicator size="large" color="#4E8D7C" />
//       <Text style={styles.loadingText}>Finding nearby clinics...</Text>
//     </View>
//   );

//   if (error) return (
//     <View style={styles.errorContainer}>
//       <MaterialIcons name="error-outline" size={50} color="#E74C3C" />
//       <Text style={styles.errorText}>{error}</Text>
//       <TouchableOpacity style={styles.retryButton} onPress={() => dispatch(getAllVerifiedClinics())}>
//         <Text style={styles.retryButtonText}>Try Again</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
//           <Menu size={24} color="#1a1a1a" />
//         </TouchableOpacity>
//         <View>
//           <Text style={styles.headerTitle}>Find a Clinic</Text>
//           <Text style={styles.headerSubtitle}>Verified veterinary clinics near you</Text>
//         </View>
//       </View>

//       <View style={styles.searchContainer}>
//         <MaterialIcons name="search" size={20} color="#7D7D7D" style={styles.searchIcon} />
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search clinics, doctors, or locations..."
//           placeholderTextColor="#999"
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//         />
//         {searchQuery.length > 0 && (
//           <TouchableOpacity onPress={() => setSearchQuery('')}>
//             <MaterialIcons name="close" size={20} color="#7D7D7D" />
//           </TouchableOpacity>
//         )}
//       </View>

//       <ScrollView
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         style={styles.filtersContainer}
//         contentContainerStyle={styles.filtersContent}
//       >
//         <TouchableOpacity
//           style={[
//             styles.filterButton,
//             selectedFilters.establishmentType === null && styles.selectedFilter
//           ]}
//           onPress={clearAllFilters}
//         >
//           <Text style={[
//             styles.filterButtonText,
//             selectedFilters.establishmentType === null && styles.selectedFilterText
//           ]}>
//             All
//           </Text>
//         </TouchableOpacity>

//         {establishmentTypes.map((type, index) => (
//           <TouchableOpacity
//             key={index}
//             style={[
//               styles.filterButton,
//               selectedFilters.establishmentType === type && styles.selectedFilter
//             ]}
//             onPress={() => toggleFilter('establishmentType', type)}
//           >
//             <Text style={[
//               styles.filterButtonText,
//               selectedFilters.establishmentType === type && styles.selectedFilterText
//             ]}>
//               {type}
//             </Text>
//           </TouchableOpacity>
//         ))}

//         {cities.slice(0, 5).map((city, index) => (
//           <TouchableOpacity
//             key={`city-${index}`}
//             style={[
//               styles.filterButton,
//               selectedFilters.city === city && styles.selectedFilter
//             ]}
//             onPress={() => toggleFilter('city', city)}
//           >
//             <Text style={[
//               styles.filterButtonText,
//               selectedFilters.city === city && styles.selectedFilterText
//             ]}>
//               {city}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </ScrollView>

//       <View style={styles.resultsContainer}>
//         <Text style={styles.resultsText}>
//           {filteredClinics.length} {filteredClinics.length === 1 ? 'Clinic' : 'Clinics'} Available
//         </Text>
//         <TouchableOpacity onPress={clearAllFilters}>
//           <Text style={styles.clearFiltersText}>Reset filters</Text>
//         </TouchableOpacity>
//       </View>

//       {filteredClinics.length === 0 ? (
//         <View style={styles.emptyContainer}>
//           {/* <Image 
//             source={require('../../../assets/images/no-clinics.png')} 
//             style={styles.emptyImage}
//             resizeMode="contain"
//           /> */}
//           <Text style={styles.emptyTitle}>No Clinics Found</Text>
//           <Text style={styles.emptyText}>
//             {searchQuery ? 'Try a different search term' : 'Try adjusting your filters'}
//           </Text>
//           <TouchableOpacity
//             style={styles.clearFiltersButton}
//             onPress={clearAllFilters}
//           >
//             <Text style={styles.clearFiltersButtonText}>Clear All Filters</Text>
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <FlatList
//           data={filteredClinics}
//           renderItem={({ item }) => (
//             <ClinicCard clinic={item} onPress={() => handleClinicPress(item)} />
//           )}
//           keyExtractor={(item) => item.clinicDetails?._id || String(Math.random())}
//           contentContainerStyle={styles.listContainer}
//           showsVerticalScrollIndicator={false}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F8F9FA',
//     paddingHorizontal: 16,
//     paddingTop: 50
//   },
//   header: {
//     marginBottom: 20,
//     paddingHorizontal: 8,
//     display: "flex",
//     flexDirection: 'row'
//   },
//   headerTitle: {
//     fontSize: 28,
//     fontWeight: '700',
//     color: '#2C3E50',
//     marginBottom: 4
//   },
//   headerSubtitle: {
//     fontSize: 16,
//     color: '#7D7D7D'
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F8F9FA'
//   },
//   loadingText: {
//     marginTop: 16,
//     color: '#4E8D7C',
//     fontSize: 16
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#F8F9FA'
//   },
//   errorText: {
//     fontSize: 16,
//     color: '#E74C3C',
//     marginVertical: 20,
//     textAlign: 'center'
//   },
//   retryButton: {
//     backgroundColor: '#4E8D7C',
//     padding: 12,
//     borderRadius: 8,
//     marginTop: 10
//   },
//   retryButtonText: {
//     color: 'white',
//     fontWeight: '600'
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'white',
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 3
//   },
//   searchIcon: {
//     marginRight: 10
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 16,
//     color: '#333',
//     fontFamily: 'Inter-Medium'
//   },
//   filtersContainer: {
//     marginBottom: 16,
//     maxHeight: 42
//   },
//   filtersContent: {
//     paddingHorizontal: 4
//   },
//   filterButton: {
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     backgroundColor: '#EDEDED',
//     borderRadius: 20,
//     marginRight: 10,
//     borderWidth: 1,
//     borderColor: '#EDEDED',
//   },
//   filterButtonText: {
//     color: '#555',
//     fontWeight: '500',
//     fontSize: 14
//   },
//   selectedFilter: {
//     backgroundColor: '#E8F5E9',
//     borderColor: '#4E8D7C'
//   },
//   selectedFilterText: {
//     color: '#4E8D7C',
//     fontWeight: '600'
//   },
//   resultsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//     paddingHorizontal: 8
//   },
//   resultsText: {
//     color: '#2C3E50',
//     fontSize: 16,
//     fontWeight: '600'
//   },
//   clearFiltersText: {
//     color: '#4E8D7C',
//     fontSize: 14,
//     textDecorationLine: 'underline'
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 40
//   },
//   emptyImage: {
//     width: width * 0.6,
//     height: width * 0.6,
//     opacity: 0.7,
//     marginBottom: 20
//   },
//   emptyTitle: {
//     fontSize: 22,
//     fontWeight: '600',
//     color: '#2C3E50',
//     marginTop: 16
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#7D7D7D',
//     textAlign: 'center',
//     marginTop: 8,
//     marginBottom: 24
//   },
//   clearFiltersButton: {
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     backgroundColor: '#4E8D7C',
//     borderRadius: 8
//   },
//   clearFiltersButtonText: {
//     color: 'white',
//     fontWeight: '600'
//   },
//   listContainer: {
//     paddingBottom: 30
//   },
//   card: {
//     backgroundColor: 'white',
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 16,
//     flexDirection: 'row',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//     elevation: 3
//   },
//   cardImageContainer: {
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2
//   },
//   profileImage: {
//     width: 90,
//     height: 90,
//     borderRadius: 12,
//     marginRight: 16
//   },
//   profilePlaceholder: {
//     width: 90,
//     height: 90,
//     borderRadius: 12,
//     backgroundColor: '#F0F7F4',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 16
//   },
//   cardContent: {
//     flex: 1
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8
//   },
//   clinicName: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#2C3E50',
//     flex: 1,
//     marginRight: 10
//   },
//   verifiedBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//     marginLeft: 8
//   },
//   verified: {
//     backgroundColor: '#4E8D7C'
//   },
//   pending: {
//     backgroundColor: '#E67C00'
//   },
//   verifiedText: {
//     fontSize: 12,
//     color: 'white',
//     marginLeft: 4,
//     fontWeight: '600'
//   },
//   establishmentType: {
//     fontSize: 14,
//     color: '#7D7D7D',
//     marginBottom: 8,
//     fontStyle: 'italic'
//   },
//   location: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12
//   },
//   address: {
//     fontSize: 14,
//     color: '#555',
//     marginLeft: 4
//   },
//   vetInfo: {
//     marginBottom: 12,
//     paddingTop: 8,
//     borderTopWidth: 1,
//     borderTopColor: '#EEE'
//   },
//   vetName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#2C3E50',
//     marginBottom: 6
//   },
//   specialtyContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 4
//   },
//   vetSpecialty: {
//     fontSize: 14,
//     color: '#4E8D7C',
//     marginLeft: 6
//   },
//   experienceContainer: {
//     flexDirection: 'row',
//     alignItems: 'center'
//   },
//   vetExperience: {
//     fontSize: 14,
//     color: '#7D7D7D',
//     marginLeft: 6
//   },
//   footer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 8,
//     paddingTop: 8,
//     borderTopWidth: 1,
//     borderTopColor: '#EEE'
//   },
//   feesContainer: {
//     flexDirection: 'row',
//     alignItems: 'center'
//   },
//   feesLabel: {
//     fontSize: 14,
//     color: '#7D7D7D',
//     marginRight: 6
//   },
//   feesValue: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#2C3E50'
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center'
//   },
//   ratingText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#2C3E50',
//     marginLeft: 4,
//     marginRight: 2
//   },
//   ratingCount: {
//     fontSize: 12,
//     color: '#7D7D7D'
//   },
//   menuButton: {
//     marginRight: 20,
//     justifyContent: 'center'
//   },
// });

// export default ClinicListScreen;

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  FlatList,
  Image,
  Dimensions
} from 'react-native';
import { MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { getAllVerifiedClinics } from '../../../store/slices/authSlice';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const ClinicCard = ({ clinic, onPress }) => {
  if (!clinic?.clinicDetails) return null;

  const clinicDetails = clinic.clinicDetails;
  const vet = clinic?.veterinarianDetails;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardImageContainer}>
        {vet?.profilePhotoUrl ? (
          <Image source={{ uri: vet.profilePhotoUrl }} style={styles.profileImage} />
        ) : (
          <View style={styles.profilePlaceholder}>
            <MaterialIcons name="business" size={32} color="#4E8D7C" />
          </View>
        )}
      </View>

      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.clinicName} numberOfLines={1}>
            {clinicDetails.clinicName}
          </Text>
          <View style={[
            styles.verifiedBadge,
            clinicDetails.verified ? styles.verified : styles.pending
          ]}>
            <MaterialIcons
              name="verified"
              size={14}
              color={clinicDetails.verified ? "white" : "white"}
            />
            <Text style={styles.verifiedText}>
              {clinicDetails.verified ? "Verified" : "Pending"}
            </Text>
          </View>
        </View>

        <Text style={styles.establishmentType}>{clinicDetails.establishmentType}</Text>

        <View style={styles.location}>
          <MaterialIcons name="location-on" size={14} color="#7D7D7D" />
          <Text style={styles.address} numberOfLines={1}>
            {clinicDetails.locality}, {clinicDetails.city}
          </Text>
        </View>

        {vet && (
          <View style={styles.vetInfo}>
            <Text style={styles.vetName}>Dr. {vet.name}</Text>
            <View style={styles.specialtyContainer}>
              <FontAwesome5 name="clinic-medical" size={12} color="#4E8D7C" />
              <Text style={styles.vetSpecialty}>{vet.specialization}</Text>
            </View>
            <View style={styles.experienceContainer}>
              <MaterialCommunityIcons name="clock-outline" size={12} color="#4E8D7C" />
              <Text style={styles.vetExperience}>{vet.experience} years experience</Text>
            </View>
          </View>
        )}

        <View style={styles.footer}>
          <View style={styles.feesContainer}>
            <Text style={styles.feesLabel}>Consultation:</Text>
            <Text style={styles.feesValue}>₹{clinicDetails.fees || "NA"}</Text>
          </View>
          <View style={styles.ratingContainer}>
            <MaterialIcons name="star" size={16} color="#FFC107" />
            <Text style={styles.ratingText}>4.8</Text>
            <Text style={styles.ratingCount}>(24)</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const ClinicListScreen = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    establishmentType: null,
    serviceType: null,
    city: null
  });

  const clinics = useSelector(state => state.auth.verifiedClinics?.data || []);

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        setLoading(true);
        const result = await dispatch(getAllVerifiedClinics());

        if (result.error) {
          throw new Error(result.payload || 'Failed to load clinics');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClinics();
  }, [dispatch]);

  const filteredClinics = clinics.filter(clinic => {
    if (!clinic?.clinicDetails) return false;

    const { clinicDetails } = clinic;
    const searchLower = searchQuery.toLowerCase();

    const matchesSearch =
      clinicDetails.clinicName?.toLowerCase().includes(searchLower) ||
      clinicDetails.city?.toLowerCase().includes(searchLower) ||
      clinicDetails.locality?.toLowerCase().includes(searchLower) ||
      (clinic.veterinarianDetails?.name?.toLowerCase().includes(searchLower));

    const matchesEstablishment =
      !selectedFilters.establishmentType ||
      clinicDetails.establishmentType === selectedFilters.establishmentType;

    let matchesService = true;
    if (selectedFilters.serviceType && clinicDetails.timings) {
      const days = Object.values(clinicDetails.timings);
      matchesService = days.some(day => day && day.type === selectedFilters.serviceType);
    }

    const matchesCity =
      !selectedFilters.city ||
      clinicDetails.city === selectedFilters.city;

    return matchesSearch && matchesEstablishment && matchesService && matchesCity;
  });

  const establishmentTypes = [...new Set(clinics
    .filter(c => c?.clinicDetails?.establishmentType)
    .map(c => c.clinicDetails.establishmentType)
  )];

  const cities = [...new Set(clinics
    .filter(c => c?.clinicDetails?.city)
    .map(c => c.clinicDetails.city)
  )];

  const handleClinicPress = (clinic) => {
    const clinicData = {
      clinicDetails: {
        clinicName: clinic.clinicDetails.clinicName,
        city: clinic.clinicDetails.city,
        locality: clinic.clinicDetails.locality,
        streetAddress: clinic.clinicDetails.streetAddress,
        establishmentType: clinic.clinicDetails.establishmentType,
        fees: clinic.clinicDetails.fees,
        verified: clinic.clinicDetails.verified,
        timings: clinic.clinicDetails.timings ? { ...clinic.clinicDetails.timings } : null,
        clinicId: clinic.clinicDetails.clinicId
      },
      veterinarianDetails: clinic.veterinarianDetails ? {
        name: clinic.veterinarianDetails.name,
        experience: clinic.veterinarianDetails.experience,
        specialization: clinic.veterinarianDetails.specialization,
        profilePhotoUrl: clinic.veterinarianDetails.profilePhotoUrl,
        isVerified: clinic.veterinarianDetails.isVerified,
        vetId: clinic.veterinarianDetails.vetId,
        gender: clinic.veterinarianDetails.gender,
        title: clinic.veterinarianDetails.title
      } : null
    };

    router.navigate({
      pathname: '/pages/ClinicDetailScreen',
      params: {
        clinic: JSON.stringify(clinicData)
      }
    });
  };

  const toggleFilter = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType] === value ? null : value
    }));
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedFilters({
      establishmentType: null,
      serviceType: null,
      city: null
    });
  };

  if (loading) return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#4E8D7C" />
      <Text style={styles.loadingText}>Finding nearby clinics...</Text>
    </View>
  );

  if (error) return (
    <View style={styles.errorContainer}>
      <MaterialIcons name="error-outline" size={50} color="#E74C3C" />
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={() => dispatch(getAllVerifiedClinics())}>
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.menuButton}>
          <ChevronLeft size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Find a Clinic</Text>
          <Text style={styles.headerSubtitle}>Verified veterinary clinics near you</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color="#7D7D7D" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search clinics, doctors, or locations..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <MaterialIcons name="close" size={20} color="#7D7D7D" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilters.establishmentType === null && styles.selectedFilter
          ]}
          onPress={clearAllFilters}
        >
          <Text style={[
            styles.filterButtonText,
            selectedFilters.establishmentType === null && styles.selectedFilterText
          ]}>
            All
          </Text>
        </TouchableOpacity>

        {establishmentTypes.map((type, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.filterButton,
              selectedFilters.establishmentType === type && styles.selectedFilter
            ]}
            onPress={() => toggleFilter('establishmentType', type)}
          >
            <Text style={[
              styles.filterButtonText,
              selectedFilters.establishmentType === type && styles.selectedFilterText
            ]}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}

        {cities.slice(0, 5).map((city, index) => (
          <TouchableOpacity
            key={`city-${index}`}
            style={[
              styles.filterButton,
              selectedFilters.city === city && styles.selectedFilter
            ]}
            onPress={() => toggleFilter('city', city)}
          >
            <Text style={[
              styles.filterButtonText,
              selectedFilters.city === city && styles.selectedFilterText
            ]}>
              {city}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {filteredClinics.length} {filteredClinics.length === 1 ? 'Clinic' : 'Clinics'} Available
        </Text>
        <TouchableOpacity onPress={clearAllFilters}>
          <Text style={styles.clearFiltersText}>Reset filters</Text>
        </TouchableOpacity>
      </View>

      {filteredClinics.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Clinics Found</Text>
          <Text style={styles.emptyText}>
            {searchQuery ? 'Try a different search term' : 'Try adjusting your filters'}
          </Text>
          <TouchableOpacity
            style={styles.clearFiltersButton}
            onPress={clearAllFilters}
          >
            <Text style={styles.clearFiltersButtonText}>Clear All Filters</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredClinics}
          renderItem={({ item }) => (
            <ClinicCard clinic={item} onPress={() => handleClinicPress(item)} />
          )}
          keyExtractor={(item) => item.clinicDetails?._id || String(Math.random())}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  searchIcon: {
    marginRight: 10
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontFamily: 'Inter-Medium'
  },
  filtersContainer: {
    marginBottom: 16,
    maxHeight: 42
  },
  filtersContent: {
    paddingHorizontal: 4
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#EDEDED',
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#EDEDED',
  },
  filterButtonText: {
    color: '#555',
    fontWeight: '500',
    fontSize: 14
  },
  selectedFilter: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4E8D7C'
  },
  selectedFilterText: {
    color: '#4E8D7C',
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
  clearFiltersText: {
    color: '#4E8D7C',
    fontSize: 14,
    textDecorationLine: 'underline'
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
  clearFiltersButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#4E8D7C',
    borderRadius: 8
  },
  clearFiltersButtonText: {
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
  clinicName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
    flex: 1,
    marginRight: 10
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8
  },
  verified: {
    backgroundColor: '#4E8D7C'
  },
  pending: {
    backgroundColor: '#E67C00'
  },
  verifiedText: {
    fontSize: 12,
    color: 'white',
    marginLeft: 4,
    fontWeight: '600'
  },
  establishmentType: {
    fontSize: 14,
    color: '#7D7D7D',
    marginBottom: 8,
    fontStyle: 'italic'
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  address: {
    fontSize: 14,
    color: '#555',
    marginLeft: 4
  },
  vetInfo: {
    marginBottom: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEE'
  },
  vetName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 6
  },
  specialtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  vetSpecialty: {
    fontSize: 14,
    color: '#4E8D7C',
    marginLeft: 6
  },
  experienceContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  vetExperience: {
    fontSize: 14,
    color: '#7D7D7D',
    marginLeft: 6
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEE'
  },
  feesContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  feesLabel: {
    fontSize: 14,
    color: '#7D7D7D',
    marginRight: 6
  },
  feesValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50'
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginLeft: 4,
    marginRight: 2
  },
  ratingCount: {
    fontSize: 12,
    color: '#7D7D7D'
  },
  menuButton: {
    marginRight: 20,
    justifyContent: 'center',
    padding: 5
  },
});

export default ClinicListScreen;