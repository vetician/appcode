import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { View, Text, StyleSheet } from 'react-native';

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, token } = useSelector(state => state.auth);

  useEffect(() => {
    // Check authentication status and redirect accordingly
    if (isAuthenticated && token) {
      router.replace('/(tabs)');
    } else {
      router.replace('/(auth)/signin');
    }
  }, [isAuthenticated, token]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Initializing...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  text: {
    fontSize: 18,
    color: '#666',
    fontWeight: '500',
  },
});