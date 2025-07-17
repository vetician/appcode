import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';

const ClinicDetailScreen = () => {
  // Use useLocalSearchParams instead of route prop
  const params = useLocalSearchParams();
  console.log("Received params:", params);

  let clinic;
  try {
    clinic = params?.clinic ? JSON.parse(params.clinic) : null;
  } catch (e) {
    console.error("Error parsing clinic data:", e);
  }

  console.log("Processed clinic data:", clinic);
  
  if (!clinic?.clinicDetails) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Clinic data not available</Text>
        <Text style={styles.errorDetails}>
          Received params: {JSON.stringify(params)}
        </Text>
      </View>
    );
  }
  
  const clinicDetails = clinic.clinicDetails;
  const vetDetails = clinic.veterinarianDetails;

  const renderTimings = () => {
    if (!clinicDetails.timings) return null;
    
    const days = [
      { key: 'mon', label: 'Monday' },
      { key: 'tue', label: 'Tuesday' },
      { key: 'wed', label: 'Wednesday' },
      { key: 'thu', label: 'Thursday' },
      { key: 'fri', label: 'Friday' },
      { key: 'sat', label: 'Saturday' },
      { key: 'sun', label: 'Sunday' }
    ];

    return days.map(day => {
      const timing = clinicDetails.timings[day.key];
      if (!timing || !timing.start) return null;

      return (
        <View key={day.key} style={styles.timingRow}>
          <Text style={styles.timingDay}>{day.label}</Text>
          <Text style={styles.timingHours}>
            {timing.start} - {timing.end}
          </Text>
          <Text style={styles.timingType}>
            ({timing.type})
          </Text>
        </View>
      );
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.clinicName}>{clinicDetails.clinicName}</Text>
        <View style={styles.verifiedBadge}>
          <MaterialIcons
            name="verified"
            size={18}
            color={clinicDetails.verified ? "#4E8D7C" : "#E67C00"}
          />
          <Text style={styles.verifiedText}>
            {clinicDetails.verified ? "Verified Clinic" : "Verification Pending"}
          </Text>
        </View>
      </View>

      <Text style={styles.establishmentType}>
        {clinicDetails.establishmentType}
      </Text>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="location-on" size={20} color="#4E8D7C" />
          <Text style={styles.sectionTitle}>Address</Text>
        </View>
        <Text style={styles.address}>
          {clinicDetails.streetAddress || 'Address not specified'}
        </Text>
        <Text style={styles.location}>
          {clinicDetails.locality}, {clinicDetails.city}
        </Text>
      </View>

      {vetDetails && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="person" size={20} color="#4E8D7C" />
            <Text style={styles.sectionTitle}>Veterinarian</Text>
          </View>

          <View style={styles.vetContainer}>
            {vetDetails.profilePhotoUrl ? (
              <Image
                source={{ uri: vetDetails.profilePhotoUrl }}
                style={styles.vetImage}
              />
            ) : (
              <View style={styles.vetPlaceholder}>
                <MaterialIcons name="person" size={32} color="#4E8D7C" />
              </View>
            )}

            <View style={styles.vetInfo}>
              <Text style={styles.vetName}>
                {vetDetails.title} {vetDetails.name}
              </Text>
              <Text style={styles.vetSpecialty}>
                {vetDetails.specialization}
              </Text>
              <Text style={styles.vetExperience}>
                {vetDetails.experience} years experience
              </Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="attach-money" size={20} color="#4E8D7C" />
          <Text style={styles.sectionTitle}>Consultation Fees</Text>
        </View>
        <Text style={styles.fees}>
          ₹{clinicDetails.fees || 'Not specified'}
        </Text>
      </View>

      {clinicDetails.timings && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="access-time" size={20} color="#4E8D7C" />
            <Text style={styles.sectionTitle}>Consultation Hours</Text>
          </View>
          {renderTimings()}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
    paddingTop: 55,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  clinicName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C3E50',
    flex: 1,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F7F4',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 10,
  },
  verifiedText: {
    fontSize: 14,
    color: '#4E8D7C',
    marginLeft: 4,
    fontWeight: '500',
  },
  establishmentType: {
    fontSize: 16,
    color: '#7D7D7D',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginLeft: 8,
  },
  address: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#7D7D7D',
  },
  vetContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  vetImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  vetPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F0F7F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  vetInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  vetName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  vetSpecialty: {
    fontSize: 16,
    color: '#4E8D7C',
    marginBottom: 4,
  },
  vetExperience: {
    fontSize: 14,
    color: '#7D7D7D',
  },
  fees: {
    fontSize: 16,
    color: '#555',
  },
  timingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  timingDay: {
    fontSize: 16,
    color: '#555',
    flex: 1,
  },
  timingHours: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '500',
    marginRight: 8,
  },
  timingType: {
    fontSize: 14,
    color: '#7D7D7D',
    fontStyle: 'italic',
  },
  contact: {
    fontSize: 16,
    color: '#555',
    paddingVertical: 4,
  },
});

export default ClinicDetailScreen;