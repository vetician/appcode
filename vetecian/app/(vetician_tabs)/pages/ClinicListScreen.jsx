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
  Image
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { getAllVerifiedClinics } from '../../../store/slices/authSlice';
import { router } from 'expo-router';

const ClinicCard = ({ clinic, onPress }) => {
  if (!clinic?.clinicDetails) return null;

  const clinicDetails = clinic.clinicDetails;
  const vet = clinic?.veterinarianDetails;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {vet?.profilePhotoUrl ? (
        <Image source={{ uri: vet.profilePhotoUrl }} style={styles.profileImage} />
      ) : (
        <View style={styles.profilePlaceholder}>
          <MaterialIcons name="business" size={32} color="#4E8D7C" />
        </View>
      )}

      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.clinicName} numberOfLines={1}>
            {clinicDetails.clinicName}
          </Text>
          <View style={styles.verifiedBadge}>
            <MaterialIcons
              name="verified"
              size={16}
              color={clinicDetails.verified ? "#4E8D7C" : "#E67C00"}
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
            <Text style={styles.vetSpecialty}>{vet.specialization}</Text>
            <Text style={styles.vetExperience}>{vet.experience} years experience</Text>
          </View>
        )}
        <View style={styles.feesContainer}>
          <Text style={styles.feesLabel}>Consultation:</Text>
          <Text style={styles.feesValue}>{clinicDetails.fees || "Not specified"}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const ClinicListScreen = ({ navigation }) => {
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

  const cities = [...new Set(clinics
    .filter(c => c?.clinicDetails?.city)
    .map(c => c.clinicDetails.city)
  )];

  const handleClinicPress = (clinic) => {
    // Create a clean, serializable object
    const clinicData = {
      clinicDetails: {
        clinicName: clinic.clinicDetails.clinicName,
        city: clinic.clinicDetails.city,
        locality: clinic.clinicDetails.locality,
        streetAddress: clinic.clinicDetails.streetAddress,
        establishmentType: clinic.clinicDetails.establishmentType,
        fees: clinic.clinicDetails.fees,
        verified: clinic.clinicDetails.verified,
        timings: clinic.clinicDetails.timings ? {...clinic.clinicDetails.timings} : null,
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

    console.log("Navigating with clinic data:", clinicData);
    
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
      <Text style={styles.loadingText}>Loading clinics...</Text>
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
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search clinics, doctors, or locations..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <MaterialIcons name="search" size={24} color="#4E8D7C" />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
      >
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilters.establishmentType === null && styles.selectedFilter
          ]}
          onPress={() => toggleFilter('establishmentType', null)}
        >
          <Text style={[
            styles.filterButtonText,
            selectedFilters.establishmentType === null && styles.selectedFilterText
          ]}>
            All Types
          </Text>
        </TouchableOpacity>
        {/* Other filter buttons... */}
      </ScrollView>

      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {filteredClinics.length} clinic{filteredClinics.length !== 1 ? 's' : ''} found
        </Text>
      </View>

      {filteredClinics.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="business" size={80} color="#D3D3D3" />
          <Text style={styles.emptyTitle}>No Clinics Found</Text>
          <Text style={styles.emptyText}>
            Try adjusting your search or filters
          </Text>
          <TouchableOpacity
            style={styles.clearFiltersButton}
            onPress={clearAllFilters}
          >
            <Text style={styles.clearFiltersText}>Clear All Filters</Text>
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
    paddingTop: 55
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#F8F9FA'
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#2C3E50',
    marginTop: 24
  },
  emptyText: {
    fontSize: 16,
    color: '#7D7D7D',
    textAlign: 'center',
    marginTop: 8
  },
  clearFiltersButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#E8F5E9',
    borderRadius: 8
  },
  clearFiltersText: {
    color: '#4E8D7C',
    fontWeight: '600'
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333'
  },
  filtersContainer: {
    marginBottom: 16,
    maxHeight: 42
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#EDEDED',
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#EDEDED'
  },
  filterButtonText: {
    color: '#555',
    fontWeight: '500'
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
    marginBottom: 16
  },
  resultsText: {
    color: '#7D7D7D',
    fontSize: 14
  },
  listContainer: {
    paddingBottom: 30
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16
  },
  profilePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
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
    fontWeight: '600',
    color: '#2C3E50',
    flex: 1,
    marginRight: 10
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F7F4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  verifiedText: {
    fontSize: 12,
    color: '#4E8D7C',
    marginLeft: 4
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
    fontWeight: '500',
    color: '#2C3E50',
    marginBottom: 4
  },
  vetSpecialty: {
    fontSize: 14,
    color: '#4E8D7C',
    marginBottom: 4
  },
  vetExperience: {
    fontSize: 14,
    color: '#7D7D7D'
  },
  feesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEE'
  },
  feesLabel: {
    fontSize: 14,
    color: '#7D7D7D'
  },
  feesValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50'
  }
});

export default ClinicListScreen;