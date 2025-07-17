import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stethoscope, Clock, CalendarDays, Menu, Plus } from 'lucide-react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { checkVeterinarianVerification } from '../../../store/slices/authSlice'; // Adjust path as needed

export default function AddClinic() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleClinic = async () => {
    try {
      console.log('[handleClinic] Starting verification check process...');

      const userId = await AsyncStorage.getItem('userId');
      console.log('[handleClinic] Retrieved userId from AsyncStorage:', userId);

      if (!userId) {
        console.error('[handleClinic] Error: No userId found - user not authenticated');
        Alert.alert('Error', 'User not authenticated');
        return;
      }

      console.log('[handleClinic] Dispatching checkVeterinarianVerification action...');
      const resultAction = await dispatch(checkVeterinarianVerification()).unwrap();
      console.log('[handleClinic] Action dispatch result:', resultAction);

      // if (checkVeterinarianVerification.fulfilled.match(resultAction)) {
        console.log('[handleClinic] Verification check successful');
        const { isVerified, message } = resultAction;
        console.log(`[handleClinic] Verification status - isVerified: ${isVerified}, message: ${message}`);

        if (isVerified) {
          console.log('[handleClinic] User is verified - showing success alert');
          Alert.alert(
            'Verified',
            message || 'Your account is verified',
            [
              {
                text: 'Cancel',
                onPress: () => console.log('[handleClinic] User cancelled navigation to clinic form')
              },
              {
                text: 'Continue',
                onPress: () => {
                  console.log('[handleClinic] Navigating to onboarding/addclinicform');
                  navigation.navigate('onboarding/addclinicform');
                }
              }
            ]
          );
        } else {
          console.log('[handleClinic] User not verified - showing verification required alert');
          Alert.alert(
            'Not Verified',
            message || 'Your account is not yet verified. Please complete verification first.',
            [
              {
                text: 'OK',
                onPress: () => {
                  console.log('[handleClinic] Navigating to VerificationStatus screen');
                  // navigation.navigate('VerificationStatus');
                }
              }
            ]
          );
        }
      // } else if (checkVeterinarianVerification.rejected.match(resultAction)) {
      //   console.error('[handleClinic] Verification check failed:', resultAction.error);
      //   throw new Error(resultAction.error.message || 'Verification check failed');
      // }
    } catch (error) {
      console.error('[handleClinic] Error in verification process:', {
        error: error.message,
        stack: error.stack
      });
      Alert.alert(
        'Error',
        error.message || 'Failed to check verification status'
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Menu Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
          <Menu size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Your Clinic</Text>
      </View>

      <View style={styles.infoCard}>
        <Plus size={32} color="#007AFF" style={styles.icon} />
        <Text style={styles.title}>Register Your Veterinary Clinic</Text>
        <Text style={styles.description}>
          Add your clinic to start managing appointments, staff, and services.
        </Text>

        <View style={styles.features}>
          <View style={styles.featureItem}>
            <Clock size={20} color="#34C759" />
            <Text style={styles.featureText}>Manage clinic hours and availability</Text>
          </View>
          <View style={styles.featureItem}>
            <CalendarDays size={20} color="#FF9500" />
            <Text style={styles.featureText}>Set up services and pricing</Text>
          </View>
          <View style={styles.featureItem}>
            <Stethoscope size={20} color="#007AFF" />
            <Text style={styles.featureText}>Manage staff and permissions</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={handleClinic}
      >
        <Text style={styles.buttonText}>Add New Clinic</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    margin: 24,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#e1e5e9',
    alignItems: 'center',
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  features: {
    width: '100%',
    gap: 16,
    marginTop: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#1a1a1a',
    flex: 1,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 24,
    marginTop: 16,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});