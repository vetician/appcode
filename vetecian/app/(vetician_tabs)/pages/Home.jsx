// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Image } from 'react-native';
// import { useSelector } from 'react-redux';
// import { Smile, Activity, Star, TrendingUp, Menu, Calendar, Heart, Map, Stethoscope, AlertCircle } from 'lucide-react-native';
// import { DrawerActions } from '@react-navigation/native';
// import { useNavigation } from '@react-navigation/native';
// import { MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
// import { router } from 'expo-router';
// import React, { useState } from 'react';
// import PetDetailModal from '../../../components/petparent/home/PetDetailModal'; // Import the separate modal component

// export default function Home() {
//     const { user } = useSelector(state => state.auth);
//     const clinics = useSelector(state => state.auth.verifiedClinics?.data || []);
//     const pets = useSelector(state => state.auth?.userPets?.data || []);
//     const navigation = useNavigation();
//     const [selectedPet, setSelectedPet] = useState(null);
//     const [modalVisible, setModalVisible] = useState(false);

//     const stats = [
//         { icon: Activity, label: 'Active', value: '24/7', color: '#34C759' },
//         { icon: Star, label: 'Rating', value: '4.9', color: '#FF9500' },
//         { icon: TrendingUp, label: 'Growth', value: '+15%', color: '#007AFF' },
//     ];

//     const quickActions = [
//         { id: '1', icon: Stethoscope, title: 'Book Appointment', color: '#007AFF', screen: 'Appointment' },
//         { id: '2', icon: Map, title: 'Find Clinics', color: '#34C759', screen: 'ClinicList' },
//         { id: '3', icon: Heart, title: 'My Pets', color: '#FF9500', screen: 'Pets' }
//     ];

//     const openDrawer = () => {
//         navigation.dispatch(DrawerActions.openDrawer());
//     };

//     const navigateTo = (screen) => {
//         navigation.navigate(screen);
//     };

//     const handleClinicPress = (clinic) => {
//         const clinicData = {
//             clinicDetails: {
//                 clinicName: clinic.clinicDetails.clinicName,
//                 city: clinic.clinicDetails.city,
//                 locality: clinic.clinicDetails.locality,
//                 streetAddress: clinic.clinicDetails.streetAddress,
//                 establishmentType: clinic.clinicDetails.establishmentType,
//                 fees: clinic.clinicDetails.fees,
//                 verified: clinic.clinicDetails.verified,
//                 timings: clinic.clinicDetails.timings ? { ...clinic.clinicDetails.timings } : null,
//                 clinicId: clinic.clinicDetails.clinicId
//             },
//             veterinarianDetails: clinic.veterinarianDetails ? {
//                 name: clinic.veterinarianDetails.name,
//                 experience: clinic.veterinarianDetails.experience,
//                 specialization: clinic.veterinarianDetails.specialization,
//                 profilePhotoUrl: clinic.veterinarianDetails.profilePhotoUrl,
//                 isVerified: clinic.veterinarianDetails.isVerified,
//                 vetId: clinic.veterinarianDetails.vetId,
//                 gender: clinic.veterinarianDetails.gender,
//                 title: clinic.veterinarianDetails.title
//             } : null
//         };

//         router.navigate({
//             pathname: '/pages/ClinicDetailScreen',
//             params: {
//                 clinic: JSON.stringify(clinicData)
//             }
//         });
//     };

//     const handlePetPress = (pet) => {
//         setSelectedPet(pet);
//         setModalVisible(true);
//     };

//     const renderClinicCard = ({ item }) => {
//         if (!item?.clinicDetails) return null;
        
//         const clinicDetails = item.clinicDetails;
//         const vet = item?.veterinarianDetails;

//         return (
//             <TouchableOpacity 
//                 style={styles.clinicCard}
//                 onPress={() => handleClinicPress(item)}
//             >
//                 <View style={styles.clinicImageContainer}>
//                     {vet?.profilePhotoUrl ? (
//                         <Image source={{ uri: vet.profilePhotoUrl }} style={styles.clinicImage} />
//                     ) : (
//                         <View style={styles.clinicImagePlaceholder}>
//                             <MaterialIcons name="business" size={32} color="#4E8D7C" />
//                         </View>
//                     )}
//                 </View>
//                 <Text style={styles.clinicName} numberOfLines={1}>{clinicDetails.clinicName}</Text>
//                 <Text style={styles.clinicType}>{clinicDetails.establishmentType}</Text>
//                 <View style={styles.clinicRating}>
//                     <MaterialIcons name="star" size={16} color="#FFC107" />
//                     <Text style={styles.ratingText}>4.8</Text>
//                     <Text style={styles.distanceText}> • {clinicDetails.city}</Text>
//                 </View>
//             </TouchableOpacity>
//         );
//     };

//     const renderPetCard = ({ item }) => {
//         const getPetIcon = () => {
//             const PET_TYPES = {
//                 Dog: 'dog',
//                 Cat: 'cat',
//                 default: 'paw'
//             };
//             return PET_TYPES[item.species] || PET_TYPES.default;
//         };

//         return (
//             <TouchableOpacity 
//                 style={styles.petCard}
//                 onPress={() => handlePetPress(item)}
//             >
//                 <View style={styles.petImageContainer}>
//                     {item?.petPhoto ? (
//                         <Image source={{ uri: item.petPhoto }} style={styles.petImage} />
//                     ) : (
//                         <View style={styles.petImagePlaceholder}>
//                             <FontAwesome5
//                                 name={getPetIcon()}
//                                 size={24}
//                                 color="#4E8D7C"
//                             />
//                         </View>
//                     )}
//                 </View>
//                 <View style={styles.petInfoContainer}>
//                     <Text style={styles.petName} numberOfLines={1}>{item.name}</Text>
//                     <View style={styles.petDetails}>
//                         <Text style={styles.petType}>{item.species}</Text>
//                         {item.breed && (
//                             <Text style={styles.petBreed} numberOfLines={1}>• {item.breed}</Text>
//                         )}
//                     </View>
//                     {item.gender && (
//                         <View style={styles.petGender}>
//                             <MaterialCommunityIcons 
//                                 name={item.gender.toLowerCase() === 'male' ? 'gender-male' : 'gender-female'} 
//                                 size={16} 
//                                 color="#7D7D7D" 
//                             />
//                             <Text style={styles.petGenderText}>{item.gender}</Text>
//                         </View>
//                     )}
//                 </View>
//             </TouchableOpacity>
//         );
//     };

//     return (
//         <>
//             <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//                 <View style={styles.header}>
//                     <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
//                         <Menu size={24} color="#1a1a1a" />
//                     </TouchableOpacity>
//                     <View>
//                         <Text style={styles.greeting}>Hello, {user?.name || 'User'}!</Text>
//                         <Text style={styles.subtitle}>Welcome back to your dashboard</Text>
//                     </View>
//                 </View>

//                 <View style={styles.statsContainer}>
//                     {stats.map((stat, index) => (
//                         <View key={index} style={styles.statCard}>
//                             <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
//                                 <stat.icon size={24} color={stat.color} />
//                             </View>
//                             <Text style={styles.statValue}>{stat.value}</Text>
//                             <Text style={styles.statLabel}>{stat.label}</Text>
//                         </View>
//                     ))}
//                 </View>

//                 <View style={styles.section}>
//                     <View style={styles.sectionHeader}>
//                         <Text style={styles.sectionTitle}>Quick Actions</Text>
//                     </View>
//                     <View style={styles.actionsGrid}>
//                         {quickActions.map((action) => (
//                             <TouchableOpacity 
//                                 key={action.id}
//                                 style={[styles.actionCard, { backgroundColor: `${action.color}10` }]}
//                                 onPress={() => navigateTo(action.screen)}
//                             >
//                                 <View style={[styles.actionIcon, { backgroundColor: `${action.color}20` }]}>
//                                     <action.icon size={24} color={action.color} />
//                                 </View>
//                                 <Text style={[styles.actionTitle, { color: action.color }]}>{action.title}</Text>
//                             </TouchableOpacity>
//                         ))}
//                     </View>
//                 </View>

//                 <View style={styles.section}>
//                     <View style={styles.sectionHeader}>
//                         <Text style={styles.sectionTitle}>My Pets</Text>
//                         {pets.length > 0 && (
//                             <TouchableOpacity onPress={() => navigateTo('Pets')}>
//                                 <Text style={styles.viewAll}>View All</Text>
//                             </TouchableOpacity>
//                         )}
//                     </View>
//                     {pets.length > 0 ? (
//                         <FlatList
//                             horizontal
//                             data={pets}
//                             renderItem={renderPetCard}
//                             keyExtractor={item => item._id}
//                             showsHorizontalScrollIndicator={false}
//                             contentContainerStyle={styles.petCarouselContainer}
//                         />
//                     ) : (
//                         <View style={styles.noPetsContainer}>
//                             <FontAwesome5 name="paw" size={32} color="#E0E0E0" />
//                             <Text style={styles.noPetsText}>No pets registered yet</Text>
//                             <TouchableOpacity 
//                                 style={styles.addPetButton}
//                                 onPress={() => navigateTo('Pets')}
//                             >
//                                 <Text style={styles.addPetButtonText}>Add a Pet</Text>
//                             </TouchableOpacity>
//                         </View>
//                     )}
//                 </View>

//                 {clinics.length > 0 && (
//                     <View style={styles.section}>
//                         <View style={styles.sectionHeader}>
//                             <Text style={styles.sectionTitle}>Nearby Clinics</Text>
//                             <TouchableOpacity onPress={() => navigateTo('ClinicList')}>
//                                 <Text style={styles.viewAll}>View All</Text>
//                             </TouchableOpacity>
//                         </View>
//                         <FlatList
//                             horizontal
//                             data={clinics.slice(0, 3)}
//                             renderItem={renderClinicCard}
//                             keyExtractor={item => item.clinicDetails?._id || String(Math.random())}
//                             showsHorizontalScrollIndicator={false}
//                             contentContainerStyle={styles.carouselContainer}
//                         />
//                     </View>
//                 )}
//             </ScrollView>

//             <PetDetailModal 
//                 pet={selectedPet}
//                 visible={modalVisible}
//                 onClose={() => setModalVisible(false)}
//             />
//         </>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#f8f9fa',
//         paddingBottom: 30,
//     },
//     header: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         padding: 24,
//         paddingTop: 60,
//         backgroundColor: '#fff',
//         borderBottomWidth: 1,
//         borderBottomColor: '#e1e5e9',
//     },
//     menuButton: {
//         marginRight: 20,
//     },
//     greeting: {
//         fontSize: 28,
//         fontWeight: 'bold',
//         color: '#1a1a1a',
//         marginBottom: 4,
//     },
//     subtitle: {
//         fontSize: 16,
//         color: '#666',
//     },
//     statsContainer: {
//         flexDirection: 'row',
//         padding: 24,
//         gap: 16,
//     },
//     statCard: {
//         flex: 1,
//         backgroundColor: '#fff',
//         borderRadius: 16,
//         padding: 20,
//         alignItems: 'center',
//         borderWidth: 1,
//         borderColor: '#e1e5e9',
//     },
//     statIcon: {
//         width: 48,
//         height: 48,
//         borderRadius: 24,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginBottom: 12,
//     },
//     statValue: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         color: '#1a1a1a',
//         marginBottom: 4,
//     },
//     statLabel: {
//         fontSize: 14,
//         color: '#666',
//     },
//     section: {
//         paddingHorizontal: 24,
//         marginBottom: 24,
//     },
//     sectionHeader: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: 16,
//     },
//     sectionTitle: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         color: '#1a1a1a',
//     },
//     viewAll: {
//         color: '#007AFF',
//         fontSize: 14,
//         fontWeight: '500',
//     },
//     actionsGrid: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         gap: 16,
//     },
//     actionCard: {
//         flex: 1,
//         backgroundColor: '#fff',
//         borderRadius: 16,
//         padding: 16,
//         alignItems: 'center',
//         borderWidth: 1,
//         borderColor: '#e1e5e9',
//     },
//     actionIcon: {
//         width: 48,
//         height: 48,
//         borderRadius: 24,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginBottom: 12,
//     },
//     actionTitle: {
//         fontSize: 16,
//         fontWeight: '600',
//         textAlign: 'center',
//     },
//     carouselContainer: {
//         paddingBottom: 10,
//     },
//     petCarouselContainer: {
//         paddingBottom: 10,
//         paddingRight: 24,
//     },
//     clinicCard: {
//         width: 200,
//         backgroundColor: '#fff',
//         borderRadius: 16,
//         padding: 16,
//         marginRight: 16,
//         borderWidth: 1,
//         borderColor: '#e1e5e9',
//     },
//     clinicImageContainer: {
//         width: '100%',
//         height: 120,
//         borderRadius: 12,
//         backgroundColor: '#f0f7f4',
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginBottom: 12,
//     },
//     clinicImage: {
//         width: '100%',
//         height: '100%',
//         borderRadius: 12,
//     },
//     clinicImagePlaceholder: {
//         width: 50,
//         height: 50,
//         borderRadius: 25,
//         backgroundColor: '#e8f5e9',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     clinicName: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: '#1a1a1a',
//         marginBottom: 4,
//     },
//     clinicType: {
//         fontSize: 14,
//         color: '#666',
//         marginBottom: 8,
//     },
//     clinicRating: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     ratingText: {
//         fontSize: 14,
//         fontWeight: '600',
//         color: '#1a1a1a',
//         marginLeft: 4,
//     },
//     distanceText: {
//         fontSize: 14,
//         color: '#666',
//     },
//     petCard: {
//         width: 280,
//         backgroundColor: '#fff',
//         borderRadius: 16,
//         padding: 16,
//         marginRight: 16,
//         flexDirection: 'row',
//         alignItems: 'center',
//         borderWidth: 1,
//         borderColor: '#e1e5e9',
//     },
//     petImageContainer: {
//         width: 80,
//         height: 80,
//         borderRadius: 12,
//         backgroundColor: '#f0f7f4',
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginRight: 16,
//     },
//     petImage: {
//         width: '100%',
//         height: '100%',
//         borderRadius: 12,
//     },
//     petImagePlaceholder: {
//         width: 40,
//         height: 40,
//         borderRadius: 20,
//         backgroundColor: '#e8f5e9',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     petInfoContainer: {
//         flex: 1,
//     },
//     petName: {
//         fontSize: 18,
//         fontWeight: '700',
//         color: '#1a1a1a',
//         marginBottom: 4,
//     },
//     petDetails: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginBottom: 8,
//     },
//     petType: {
//         fontSize: 14,
//         fontWeight: '600',
//         color: '#4E8D7C',
//     },
//     petBreed: {
//         fontSize: 14,
//         color: '#666',
//         marginLeft: 4,
//         flexShrink: 1,
//     },
//     petGender: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     petGenderText: {
//         fontSize: 14,
//         color: '#666',
//         marginLeft: 4,
//     },
//     noPetsContainer: {
//         backgroundColor: '#fff',
//         borderRadius: 16,
//         padding: 20,
//         alignItems: 'center',
//         borderWidth: 1,
//         borderColor: '#e1e5e9',
//     },
//     noPetsText: {
//         fontSize: 16,
//         color: '#666',
//         marginTop: 8,
//         marginBottom: 16,
//     },
//     addPetButton: {
//         backgroundColor: '#4E8D7C',
//         paddingHorizontal: 16,
//         paddingVertical: 8,
//         borderRadius: 8,
//     },
//     addPetButtonText: {
//         color: '#fff',
//         fontWeight: '600',
//     },
// });














import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { Smile, Activity, Star, TrendingUp, Menu, Calendar, Heart, Map, Stethoscope, AlertCircle } from 'lucide-react-native';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import PetDetailModal from '../../../components/petparent/home/PetDetailModal'; // Import the separate modal component

export default function Home() {
    const { user } = useSelector(state => state.auth);
    const clinics = useSelector(state => state.auth.verifiedClinics?.data || []);
    const pets = useSelector(state => state.auth?.userPets?.data || []);
    const navigation = useNavigation();
    const [selectedPet, setSelectedPet] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const stats = [
        { icon: Activity, label: 'Active', value: '24/7', color: '#34C759' },
        { icon: Star, label: 'Rating', value: '4.9', color: '#FF9500' },
        { icon: TrendingUp, label: 'Growth', value: '+15%', color: '#007AFF' },
    ];

    const quickActions = [
        { id: '1', icon: Stethoscope, title: 'Book Appointment', color: '#007AFF', screen: 'Appointment' },
        { id: '2', icon: Map, title: 'Find Clinics', color: '#34C759', screen: 'ClinicList' },
        { id: '3', icon: Heart, title: 'My Pets', color: '#FF9500', screen: 'Pets' }
    ];

    const healthTips = [
        { id: '1', title: 'Summer Pet Care', description: 'Keep your pets hydrated and avoid hot pavement' },
        { id: '2', title: 'Vaccination Reminder', description: 'Annual vaccines are due next month' },
        { id: '3', title: 'Dental Health', description: 'Schedule a dental checkup for your pet' }
    ];

    const openDrawer = () => {
        navigation.dispatch(DrawerActions.openDrawer());
    };

    const navigateTo = (screen) => {
        navigation.navigate(screen);
    };

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

    const handlePetPress = (pet) => {
        setSelectedPet(pet);
        setModalVisible(true);
    };

    const renderClinicCard = ({ item }) => {
        if (!item?.clinicDetails) return null;
        
        const clinicDetails = item.clinicDetails;
        const vet = item?.veterinarianDetails;

        return (
            <TouchableOpacity 
                style={styles.clinicCard}
                onPress={() => handleClinicPress(item)}
            >
                <View style={styles.clinicImageContainer}>
                    {vet?.profilePhotoUrl ? (
                        <Image source={{ uri: vet.profilePhotoUrl }} style={styles.clinicImage} />
                    ) : (
                        <View style={styles.clinicImagePlaceholder}>
                            <MaterialIcons name="business" size={32} color="#4E8D7C" />
                        </View>
                    )}
                </View>
                <Text style={styles.clinicName} numberOfLines={1}>{clinicDetails.clinicName}</Text>
                <Text style={styles.clinicType}>{clinicDetails.establishmentType}</Text>
                <View style={styles.clinicRating}>
                    <MaterialIcons name="star" size={16} color="#FFC107" />
                    <Text style={styles.ratingText}>4.8</Text>
                    <Text style={styles.distanceText}> • {clinicDetails.city}</Text>
                </View>
            </TouchableOpacity>
        );
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

    const renderHealthTipCard = ({ item }) => {
        return (
            <TouchableOpacity style={styles.healthTipCard}>
                <View style={styles.healthTipIcon}>
                    <AlertCircle size={20} color="#4E8D7C" />
                </View>
                <View style={styles.healthTipContent}>
                    <Text style={styles.healthTipTitle}>{item.title}</Text>
                    <Text style={styles.healthTipDescription}>{item.description}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
                        <Menu size={24} color="#1a1a1a" />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.greeting}>Hello, {user?.name || 'User'}!</Text>
                        <Text style={styles.subtitle}>Welcome back to your dashboard</Text>
                    </View>
                </View>

                <View style={styles.statsContainer}>
                    {stats.map((stat, index) => (
                        <View key={index} style={styles.statCard}>
                            <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
                                <stat.icon size={24} color={stat.color} />
                            </View>
                            <Text style={styles.statValue}>{stat.value}</Text>
                            <Text style={styles.statLabel}>{stat.label}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Quick Actions</Text>
                    </View>
                    <View style={styles.actionsGrid}>
                        {quickActions.map((action) => (
                            <TouchableOpacity 
                                key={action.id}
                                style={[styles.actionCard, { backgroundColor: `${action.color}10` }]}
                                onPress={() => navigateTo(action.screen)}
                            >
                                <View style={[styles.actionIcon, { backgroundColor: `${action.color}20` }]}>
                                    <action.icon size={24} color={action.color} />
                                </View>
                                <Text style={[styles.actionTitle, { color: action.color }]}>{action.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>My Pets</Text>
                        {pets.length > 0 && (
                            <TouchableOpacity onPress={() => navigateTo('Pets')}>
                                <Text style={styles.viewAll}>View All</Text>
                            </TouchableOpacity>
                        )}
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
                                onPress={() => navigateTo('Pets')}
                            >
                                <Text style={styles.addPetButtonText}>Add a Pet</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {clinics.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Nearby Clinics</Text>
                            <TouchableOpacity onPress={() => navigateTo('ClinicList')}>
                                <Text style={styles.viewAll}>View All</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            horizontal
                            data={clinics.slice(0, 3)}
                            renderItem={renderClinicCard}
                            keyExtractor={item => item.clinicDetails?._id || String(Math.random())}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.carouselContainer}
                        />
                    </View>
                )}

                {/* Health Tips */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Health Tips</Text>
                        <TouchableOpacity onPress={() => navigateTo('HealthTips')}>
                            <Text style={styles.viewAll}>View All</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={healthTips}
                        renderItem={renderHealthTipCard}
                        keyExtractor={item => item.id}
                        scrollEnabled={false}
                        contentContainerStyle={styles.healthTipsContainer}
                    />
                </View>
            </ScrollView>

            <PetDetailModal 
                pet={selectedPet}
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        paddingBottom: 30,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 24,
        paddingTop: 60,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e1e5e9',
    },
    menuButton: {
        marginRight: 20,
    },
    greeting: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
    statsContainer: {
        flexDirection: 'row',
        padding: 24,
        gap: 16,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e1e5e9',
    },
    statIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
    },
    section: {
        paddingHorizontal: 24,
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    viewAll: {
        color: '#007AFF',
        fontSize: 14,
        fontWeight: '500',
    },
    actionsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
    },
    actionCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e1e5e9',
    },
    actionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    actionTitle: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    carouselContainer: {
        paddingBottom: 10,
    },
    petCarouselContainer: {
        paddingBottom: 10,
        paddingRight: 24,
    },
    clinicCard: {
        width: 200,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginRight: 16,
        borderWidth: 1,
        borderColor: '#e1e5e9',
    },
    clinicImageContainer: {
        width: '100%',
        height: 120,
        borderRadius: 12,
        backgroundColor: '#f0f7f4',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    clinicImage: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
    },
    clinicImagePlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#e8f5e9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    clinicName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    clinicType: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    clinicRating: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1a1a1a',
        marginLeft: 4,
    },
    distanceText: {
        fontSize: 14,
        color: '#666',
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
    },
    petImage: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
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
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e1e5e9',
    },
    noPetsText: {
        fontSize: 16,
        color: '#666',
        marginTop: 8,
        marginBottom: 16,
    },
    addPetButton: {
        backgroundColor: '#4E8D7C',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    addPetButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    healthTipsContainer: {
        gap: 12,
    },
    healthTipCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e1e5e9',
    },
    healthTipIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#e8f5e9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    healthTipContent: {
        flex: 1,
    },
    healthTipTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    healthTipDescription: {
        fontSize: 14,
        color: '#666',
    },
});