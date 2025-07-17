// import { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
// import { useRouter } from 'expo-router';
// import { useDispatch, useSelector } from 'react-redux';
// import { signInUser } from '../../store/slices/authSlice';
// import { validateEmail } from '../../utils/validation';
// import { Eye, EyeOff, Mail, Lock } from 'lucide-react-native';

// export default function SignIn() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [loginType, setLoginType] = useState('vetician');

//   const router = useRouter();
//   const dispatch = useDispatch();
//   const { isLoading, error } = useSelector(state => state.auth);

//   const handleSignIn = async () => {
//     // Reset errors
//     setErrors({});

//     // Validation
//     const newErrors = {};
//     if (!email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!validateEmail(email)) {
//       newErrors.email = 'Please enter a valid email';
//     }

//     if (!password.trim()) {
//       newErrors.password = 'Password is required';
//     } else if (password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters';
//     }

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }

//     try {
//       console.log('Login Page:=> ', email, password, loginType);
//       const result = await dispatch(signInUser({ email, password, loginType })).unwrap();
//       if (result.success) {
//         router.replace(loginType === 'veterinarian' ? '/(doc_tabs)' : '/(vetician_tabs)');
//       }
//     } catch (error) {
//       Alert.alert('Sign In Failed', error || 'An error occurred during sign in');
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//     >
//       <View style={styles.content}>
//         <View style={styles.header}>
//           <Text style={styles.title}>Welcome Back</Text>
//           <Text style={styles.subtitle}>Sign in to your account</Text>
//         </View>

//         <View style={styles.form}>
//           <View style={styles.inputContainer}>
//             <View style={styles.inputWrapper}>
//               <Mail size={20} color="#666" style={styles.inputIcon} />
//               <TextInput
//                 style={[styles.input, errors.email && styles.inputError]}
//                 placeholder="Email"
//                 value={email}
//                 onChangeText={setEmail}
//                 keyboardType="email-address"
//                 autoCapitalize="none"
//                 autoCorrect={false}
//               />
//             </View>
//             {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
//           </View>

//           <View style={styles.inputContainer}>
//             <View style={styles.inputWrapper}>
//               <Lock size={20} color="#666" style={styles.inputIcon} />
//               <TextInput
//                 style={[styles.input, errors.password && styles.inputError]}
//                 placeholder="Password"
//                 value={password}
//                 onChangeText={setPassword}
//                 secureTextEntry={!showPassword}
//                 autoCapitalize="none"
//               />
//               <TouchableOpacity
//                 style={styles.eyeButton}
//                 onPress={() => setShowPassword(!showPassword)}
//               >
//                 {showPassword ? (
//                   <EyeOff size={20} color="#666" />
//                 ) : (
//                   <Eye size={20} color="#666" />
//                 )}
//               </TouchableOpacity>
//             </View>
//             {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
//           </View>

//           {error && (
//             <View style={styles.errorContainer}>
//               <Text style={styles.errorText}>{error}</Text>
//             </View>
//           )}

//           <View style={styles.loginTypeContainer}>
//             <View style={styles.loginTypeButtons}>
//               <TouchableOpacity
//                 style={[
//                   styles.loginTypeButton,
//                   loginType === 'vetician' && styles.loginTypeButtonActive
//                 ]}
//                 onPress={() => setLoginType('vetician')}
//               >
//                 <Text style={[
//                   styles.loginTypeText,
//                   loginType === 'vetician' && styles.loginTypeTextActive
//                 ]}>
//                   Vetician
//                 </Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[
//                   styles.loginTypeButton,
//                   loginType === 'veterinarian' && styles.loginTypeButtonActive
//                 ]}
//                 onPress={() => setLoginType('veterinarian')}
//               >
//                 <Text style={[
//                   styles.loginTypeText,
//                   loginType === 'veterinarian' && styles.loginTypeTextActive
//                 ]}>
//                   Veterinarian
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>

//           <TouchableOpacity
//             style={[styles.signInButton, isLoading && styles.buttonDisabled]}
//             onPress={handleSignIn}
//             disabled={isLoading}
//           >
//             <Text style={styles.signInButtonText}>
//               {isLoading ? 'Signing In...' : 'Sign In'}
//             </Text>
//           </TouchableOpacity>

//           <View style={styles.signUpContainer}>
//             <Text style={styles.signUpText}>Don't have an account? </Text>
//             <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
//               <Text style={styles.signUpLink}>Sign Up</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   content: {
//     flex: 1,
//     justifyContent: 'center',
//     paddingHorizontal: 32,
//   },
//   header: {
//     alignItems: 'center',
//     marginBottom: 48,
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#1a1a1a',
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#666',
//   },
//   form: {
//     width: '100%',
//   },
//   inputContainer: {
//     marginBottom: 24,
//   },
//   inputWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#e1e5e9',
//     paddingHorizontal: 16,
//     height: 56,
//   },
//   inputIcon: {
//     marginRight: 12,
//   },
//   input: {
//     flex: 1,
//     fontSize: 16,
//     color: '#1a1a1a',
//   },
//   inputError: {
//     borderColor: '#ff3b30',
//   },
//   eyeButton: {
//     padding: 4,
//   },
//   errorContainer: {
//     marginTop: 8,
//     marginBottom: 16,
//   },
//   errorText: {
//     color: '#ff3b30',
//     fontSize: 14,
//     marginTop: 8,
//   },
//   loginTypeContainer: {
//     marginBottom: 24,
//   },
//   loginTypeLabel: {
//     fontSize: 16,
//     color: '#666',
//     marginBottom: 8,
//   },
//   loginTypeButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     gap: 12,
//   },
//   loginTypeButton: {
//     flex: 1,
//     paddingVertical: 12,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#e1e5e9',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//   },
//   loginTypeButtonActive: {
//     backgroundColor: '#007AFF',
//     borderColor: '#007AFF',
//   },
//   loginTypeText: {
//     fontSize: 16,
//     color: '#666',
//   },
//   loginTypeTextActive: {
//     color: '#fff',
//     fontWeight: '600',
//   },
//   signInButton: {
//     backgroundColor: '#007AFF',
//     borderRadius: 12,
//     height: 56,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   buttonDisabled: {
//     backgroundColor: '#a0a0a0',
//   },
//   signInButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   signUpContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 32,
//   },
//   signUpText: {
//     fontSize: 16,
//     color: '#666',
//   },
//   signUpLink: {
//     fontSize: 16,
//     color: '#007AFF',
//     fontWeight: '600',
//   },
// });

import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { signInUser } from '../../store/slices/authSlice';
import { validateEmail } from '../../utils/validation';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react-native';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginType, setLoginType] = useState('vetician');

  const router = useRouter();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector(state => state.auth);

  const handleSignIn = async () => {
    // Reset errors
    setErrors({});

    // Validation
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      console.log('Login Page:=> ', email, password, loginType);
      const result = await dispatch(signInUser({ email, password, loginType })).unwrap();
      if (result.success) {
        // Route to appropriate tabs based on login type
        switch(loginType) {
          case 'veterinarian':
            router.replace('/(doc_tabs)');
            break;
          case 'pet_resort':
            router.replace('/(pet_resort_tabs)');
            break;
          case 'peravet':
            router.replace('/(peravet_tabs)');
            break;
          default: // vetician
            router.replace('/(vetician_tabs)');
        }
      }
    } catch (error) {
      Alert.alert('Sign In Failed', error || 'An error occurred during sign in');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Mail size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Lock size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#666" />
                ) : (
                  <Eye size={20} color="#666" />
                )}
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.loginTypeContainer}>
            <View style={styles.loginTypeButtons}>
              <TouchableOpacity
                style={[
                  styles.loginTypeButton,
                  loginType === 'vetician' && styles.loginTypeButtonActive
                ]}
                onPress={() => setLoginType('vetician')}
              >
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
                <Text style={[
                  styles.loginTypeText,
                  loginType === 'veterinarian' && styles.loginTypeTextActive
                ]}>
                  Vet
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.loginTypeButton,
                  loginType === 'peravet' && styles.loginTypeButtonActive
                ]}
                onPress={() => setLoginType('peravet')}
              >
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
                <Text style={[
                  styles.loginTypeText,
                  loginType === 'pet_resort' && styles.loginTypeTextActive
                ]}>
                  Pet Resort
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.signInButton, isLoading && styles.buttonDisabled]}
            onPress={handleSignIn}
            disabled={isLoading}
          >
            <Text style={styles.signInButtonText}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e1e5e9',
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  eyeButton: {
    padding: 4,
  },
  errorContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    marginTop: 8,
  },
  loginTypeContainer: {
    marginBottom: 24,
  },
  loginTypeLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  loginTypeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  loginTypeButton: {
    flex: 1,
    minWidth: '48%',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1e5e9',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  loginTypeButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  loginTypeText: {
    fontSize: 14,
    color: '#666',
  },
  loginTypeTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  signInButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#a0a0a0',
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  signUpText: {
    fontSize: 16,
    color: '#666',
  },
  signUpLink: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
});