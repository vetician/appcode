import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { signUpUser } from '../../store/slices/authSlice';
import { validateEmail } from '../../utils/validation';
import { Eye, EyeOff, Mail, Lock, User, PawPrint } from 'lucide-react-native';

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginType, setLoginType] = useState('vetician'); // Default to 'vetician'

  const router = useRouter();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector(state => state.auth);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSignUp = async () => {
    console.log('📱 SIGNUP COMPONENT - handleSignUp started');
    console.log('📱 SIGNUP COMPONENT - Form data:', {
      name: formData.name,
      email: formData.email,
      password: formData.password ? '***PROVIDED***' : 'MISSING',
      confirmPassword: formData.confirmPassword ? '***PROVIDED***' : 'MISSING',
      loginType: loginType
    });

    // Reset errors
    setErrors({});
    console.log('📱 SIGNUP COMPONENT - Errors reset');

    // Validation
    console.log('📱 SIGNUP COMPONENT - Starting validation...');
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
      console.log('❌ SIGNUP COMPONENT - Name validation failed: empty');
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
      console.log('❌ SIGNUP COMPONENT - Name validation failed: too short');
    } else {
      console.log('✅ SIGNUP COMPONENT - Name validation passed');
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      console.log('❌ SIGNUP COMPONENT - Email validation failed: empty');
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      console.log('❌ SIGNUP COMPONENT - Email validation failed: invalid format');
    } else {
      console.log('✅ SIGNUP COMPONENT - Email validation passed');
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
      console.log('❌ SIGNUP COMPONENT - Password validation failed: empty');
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      console.log('❌ SIGNUP COMPONENT - Password validation failed: too short');
    } else {
      console.log('✅ SIGNUP COMPONENT - Password validation passed');
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
      console.log('❌ SIGNUP COMPONENT - Confirm password validation failed: empty');
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      console.log('❌ SIGNUP COMPONENT - Confirm password validation failed: mismatch');
    } else {
      console.log('✅ SIGNUP COMPONENT - Confirm password validation passed');
    }

    if (Object.keys(newErrors).length > 0) {
      console.log('❌ SIGNUP COMPONENT - Validation failed, errors:', newErrors);
      setErrors(newErrors);
      return;
    }
    console.log('✅ SIGNUP COMPONENT - All validations passed');

    try {
      console.log('🚀 SIGNUP COMPONENT - Dispatching signUpUser action...');
      const dispatchParams = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: loginType
      };
      console.log('📋 SIGNUP COMPONENT - Dispatch params:', {
        name: dispatchParams.name,
        email: dispatchParams.email,
        password: dispatchParams.password ? '***HIDDEN***' : 'MISSING',
        role: dispatchParams.role
      });

      const result = await dispatch(signUpUser(dispatchParams)).unwrap();

      console.log('✅ SIGNUP COMPONENT - signUpUser dispatch successful');
      console.log('📄 SIGNUP COMPONENT - Result:', {
        success: result.success,
        message: result.message,
        hasUser: !!result.user,
        hasToken: !!result.token,
        userRole: result.user?.role
      });

      if (result.success) {
        console.log('🎉 SIGNUP COMPONENT - Signup successful, showing success alert');
        Alert.alert(
          'Account Created',
          'Your account has been created successfully!',
          [{ 
            text: 'OK', 
            onPress: () => {
              console.log('🎯 SIGNUP COMPONENT - Navigating based on loginType:', loginType);
              // Route to appropriate onboarding based on login type
              switch(loginType) {
                case 'veterinarian':
                  console.log('🏥 SIGNUP COMPONENT - Routing to veterinarian onboarding');
                  router.replace('/(doc_tabs)/onboarding/onboarding_conf');
                  break;
                case 'pet_resort':
                  console.log('🏨 SIGNUP COMPONENT - Routing to pet resort tabs');
                  router.replace('/(pet_resort_tabs)/(tabs)');
                  break;
                case 'peravet':
                  console.log('🐕 SIGNUP COMPONENT - Routing to peravet tabs');
                  router.replace('/(peravet_tabs)/(tabs)');
                  break;
                default: // vetician
                  console.log('👤 SIGNUP COMPONENT - Routing to vetician onboarding (default)');
                  router.replace('/(vetician_tabs)/onboarding/onboarding_conf');
              }
            }
          }]
        );
      } else {
        console.log('❌ SIGNUP COMPONENT - Signup failed, result.success is false');
      }
    } catch (error) {
      console.log('❌ SIGNUP COMPONENT - Caught error in handleSignUp:', error);
      console.log('❌ SIGNUP COMPONENT - Error type:', typeof error);
      console.log('❌ SIGNUP COMPONENT - Error message:', error.message || error);
      console.log('❌ SIGNUP COMPONENT - Full error object:', JSON.stringify(error, null, 2));
      
      Alert.alert('Sign Up Failed', error || 'An error occurred during sign up');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <PawPrint size={40} color="#4A90E2" style={styles.logo} />
              <Text style={styles.appName}>Vetician</Text>
            </View>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to get started</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <User size={20} color="#888" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, errors.name && styles.inputError]}
                  placeholder="Full Name"
                  placeholderTextColor="#aaa"
                  value={formData.name}
                  onChangeText={(value) => handleInputChange('name', value)}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Mail size={20} color="#888" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  placeholder="Email"
                  placeholderTextColor="#aaa"
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Lock size={20} color="#888" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, errors.password && styles.inputError]}
                  placeholder="Password"
                  placeholderTextColor="#aaa"
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#888" />
                  ) : (
                    <Eye size={20} color="#888" />
                  )}
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Lock size={20} color="#888" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, errors.confirmPassword && styles.inputError]}
                  placeholder="Confirm Password"
                  placeholderTextColor="#aaa"
                  value={formData.confirmPassword}
                  onChangeText={(value) => handleInputChange('confirmPassword', value)}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} color="#888" />
                  ) : (
                    <Eye size={20} color="#888" />
                  )}
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
            </View>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Text style={styles.loginTypeLabel}>I am a:</Text>
            <View style={styles.loginTypeContainer}>
              <View style={styles.loginTypeButtons}>
                <TouchableOpacity
                  style={[
                    styles.loginTypeButton,
                    loginType === 'vetician' && styles.loginTypeButtonActive
                  ]}
                  onPress={() => setLoginType('vetician')}
                >
                  <PawPrint size={16} color={loginType === 'vetician' ? '#fff' : '#666'} />
                  <Text style={[
                    styles.loginTypeText,
                    loginType === 'vetician' && styles.loginTypeTextActive
                  ]}>
                    Pet Parent
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.loginTypeButton,
                    loginType === 'veterinarian' && styles.loginTypeButtonActive
                  ]}
                  onPress={() => setLoginType('veterinarian')}
                >
                  <PawPrint size={16} color={loginType === 'veterinarian' ? '#fff' : '#666'} />
                  <Text style={[
                    styles.loginTypeText,
                    loginType === 'veterinarian' && styles.loginTypeTextActive
                  ]}>
                    Veterinarian
                  </Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
                  style={[
                    styles.loginTypeButton,
                    loginType === 'peravet' && styles.loginTypeButtonActive
                  ]}
                  onPress={() => setLoginType('peravet')}
                >
                  <PawPrint size={16} color={loginType === 'peravet' ? '#fff' : '#666'} />
                  <Text style={[
                    styles.loginTypeText,
                    loginType === 'peravet' && styles.loginTypeTextActive
                  ]}>
                    Peravet
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.loginTypeButton,
                    loginType === 'pet_resort' && styles.loginTypeButtonActive
                  ]}
                  onPress={() => setLoginType('pet_resort')}
                >
                  <PawPrint size={16} color={loginType === 'pet_resort' ? '#fff' : '#666'} />
                  <Text style={[
                    styles.loginTypeText,
                    loginType === 'pet_resort' && styles.loginTypeTextActive
                  ]}>
                    Pet Resort
                  </Text>
                </TouchableOpacity> */}
              </View>
            </View>

            <TouchableOpacity
              style={[styles.signUpButton, isLoading && styles.buttonDisabled]}
              onPress={handleSignUp}
              disabled={isLoading}
            >
              <Text style={styles.signUpButtonText}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            <View style={styles.signInContainer}>
              <Text style={styles.signInText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.signInLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 35
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    marginRight: 10,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
  },
  form: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eaeaea',
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    height: '100%',
  },
  inputError: {
    borderColor: '#ff6b6b',
  },
  eyeButton: {
    padding: 4,
  },
  errorContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    marginTop: 8,
  },
  loginTypeContainer: {
    marginBottom: 20,
  },
  loginTypeLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
    fontWeight: '500',
  },
  loginTypeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  loginTypeButton: {
    flex: 1,
    minWidth: '48%',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eaeaea',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  loginTypeButtonActive: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  loginTypeText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  loginTypeTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  signUpButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#4A90E2',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#a0a0a0',
    shadowColor: '#a0a0a0',
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  signInText: {
    fontSize: 15,
    color: '#888',
  },
  signInLink: {
    fontSize: 15,
    color: '#4A90E2',
    fontWeight: '600',
  },
});