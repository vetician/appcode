// import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
// import { useSelector, useDispatch } from 'react-redux';
// import { useRouter } from 'expo-router';
// import { signOut } from '../../../store/slices/authSlice';
// import { User, Mail, Calendar, MapPin, Phone, CreditCard as Edit, LogOut } from 'lucide-react-native';

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
//     { icon: Phone, label: 'Phone', value: user?.phone || 'Not provided' },
//     { icon: MapPin, label: 'Location', value: user?.location || 'Not provided' },
//     { icon: Calendar, label: 'Joined', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently' },
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
//         <Text style={styles.name}>{user?.name || 'User Name'}</Text>
//         <Text style={styles.email}>{user?.email || 'user@example.com'}</Text>
//       </View>

//       <View style={styles.content}>
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Personal Information</Text>
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
//           <Text style={styles.sectionTitle}>Account Stats</Text>
//           <View style={styles.statsContainer}>
//             <View style={styles.statItem}>
//               <Text style={styles.statValue}>12</Text>
//               <Text style={styles.statLabel}>Activities</Text>
//             </View>
//             <View style={styles.statItem}>
//               <Text style={styles.statValue}>5</Text>
//               <Text style={styles.statLabel}>Achievements</Text>
//             </View>
//             <View style={styles.statItem}>
//               <Text style={styles.statValue}>3</Text>
//               <Text style={styles.statLabel}>Weeks Active</Text>
//             </View>
//           </View>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Actions</Text>
//           <View style={styles.actionsContainer}>
//             <TouchableOpacity style={styles.actionButton}>
//               <Edit size={20} color="#007AFF" />
//               <Text style={styles.actionText}>Edit Profile</Text>
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





import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image, FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation, useRouter } from 'expo-router';
import { signOut } from '../../../store/slices/authSlice';
import { User, Mail, Calendar, MapPin, Phone, CreditCard as Edit, LogOut } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getParent } from '../../../store/slices/authSlice';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import PetDetailModal from '../../../components/petparent/home/PetDetailModal';

export default function Profile() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [parentData, setParentData] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { user } = useSelector(state => state.auth);
  const pets = useSelector(state => state.auth?.userPets?.data || []);
  const navigation = useNavigation();

  const navigateTo = (screen) => {
    navigation.navigate(screen);
  };

  useEffect(() => {
    const fetchParentData = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          const result = await dispatch(getParent(userId)).unwrap();
          console.log("Result Parent => ", result);
          setParentData(result.parent[0]);
        }
      } catch (error) {
        console.error('Error fetching parent data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchParentData();
  }, [dispatch]);

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
    setModalVisible(true);
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
            onPress={() => router.push('/profile/edit')}
          >
            <Edit size={16} color="#007AFF" />
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
            {/* {pets.length > 0 && (
              <TouchableOpacity onPress={() => navigateTo('Pets')}>
                <Text style={styles.viewAll}>View All</Text>
              </TouchableOpacity>
            )} */}
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

      <PetDetailModal
        pet={selectedPet}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
});