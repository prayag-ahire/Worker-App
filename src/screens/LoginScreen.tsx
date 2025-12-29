import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { Colors } from '../styles/colors';
import { loginWorker, getUserProfile as fetchUserProfile } from '../services/apiClient';
import { saveAuthToken, saveProfileCompleted, saveUserProfile, clearAuthData } from '../utils/storage';

interface LoginScreenProps {
  onLoginSuccess?: () => void;
  onSignUpPress?: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onSignUpPress,
}) => {
  const [phoneNo, setPhoneNo] = useState('');
  const [password, setPassword] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const phoneInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const handlePhoneChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');
    if (numericText.length <= 10) {
      setPhoneNo(numericText);
    }
  };

  const validatePhone = () => {
    if (phoneNo.length !== 10) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Phone Number',
        text2: 'Please enter a valid 10-digit phone number.',
        position: 'top',
        visibilityTime: 3000,
      });
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validatePhone()) return;

    if (!password) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Password',
        text2: 'Please enter your password.',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    setIsLoading(true);

    try {
      // Clear any existing auth data before logging in
      await clearAuthData();

      // Call the login API
      const response = await loginWorker(phoneNo, password);

      // Save the auth token and profile completion status
      await saveAuthToken(response.token);
      await saveProfileCompleted(response.profileCompleted);

      // Fetch and cache user profile
      try {
        const profileData = await fetchUserProfile(response.token);
        await saveUserProfile(profileData);
        console.log('User profile cached after login');
      } catch (profileError) {
        // App-level error handler will catch session issues, 
        // and we don't want to block login success if just profile sync fails
        console.log('Post-login profile cache skipped:', profileError);
      }

      // Show success message
      Toast.show({
        type: 'success',
        text1: 'Login Successful',
        text2: 'Welcome back!',
        position: 'top',
        visibilityTime: 2000,
      });

      // Call the success callback after a short delay
      setTimeout(() => {
        onLoginSuccess?.();
      }, 500);

    } catch (error: any) {
      console.error('Login error:', error);
      
      // Show error message
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: error.message || 'An error occurred during login. Please try again.',
        position: 'top',
        visibilityTime: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.backgroundLight} />

      {/* Background blobs */}
      <View style={styles.gradientOverlay}>
        <View style={[styles.blob, styles.blob1]} />
        <View style={[styles.blob, styles.blob2]} />
        <View style={[styles.blob, styles.blob3]} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >
        <View style={styles.header}>
          <Text style={styles.appTitle}>ProWorker</Text>
        </View>

        <View style={styles.mainCard}>
          <Text style={styles.loginTitle}>Login</Text>

          {/* Phone Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone No</Text>
            <View
              style={[
                styles.inputWrapper,
                focusedField === 'phone' && styles.inputWrapperFocused,
              ]}
            >
              <TextInput
                ref={phoneInputRef}
                style={styles.input}
                placeholder="Enter 10-digit phone number"
                placeholderTextColor={Colors.textLight}
                keyboardType="number-pad"
                value={phoneNo}
                onChangeText={handlePhoneChange}
                onFocus={() => setFocusedField('phone')}
                onBlur={() => setFocusedField(null)}
                maxLength={10}
              />
            </View>
            {phoneNo.length > 0 && phoneNo.length < 10 && (
              <Text style={styles.errorText}>
                Phone number must be 10 digits ({phoneNo.length}/10)
              </Text>
            )}
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View
              style={[
                styles.inputWrapper,
                focusedField === 'password' && styles.inputWrapperFocused,
              ]}
            >
              <TextInput
                ref={passwordInputRef}
                style={[styles.input, styles.passwordInput]}
                placeholder="Enter your password"
                placeholderTextColor={Colors.textLight}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
              />

              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.7}
                accessible={false}
              >
                {showPassword ? (
                  <View style={styles.eyeIconContainer}>
                    {/* Eye with slash */}
                    <View style={styles.eyeShape}>
                      <View style={styles.eyePupil} />
                    </View>
                    <View style={styles.eyeSlash} />
                  </View>
                ) : (
                  <View style={styles.eyeIconContainer}>
                    {/* Eye without slash */}
                    <View style={styles.eyeShape}>
                      <View style={styles.eyePupil} />
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Login Button */}
          <TouchableOpacity 
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          {/* Signup */}
          <TouchableOpacity onPress={onSignUpPress} style={styles.signUpLink}>
            <Text style={styles.signUpText}>
              Don&apos;t have an account?{' '}
              <Text style={styles.signUpTextBold}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  gradientOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  blob: {
    position: 'absolute',
    borderRadius: 1000,
    opacity: 0.15,
  },
  blob1: {
    width: 300,
    height: 300,
    backgroundColor: Colors.primaryMedium,
    top: -100,
    right: -100,
  },
  blob2: {
    width: 240,
    height: 240,
    backgroundColor: Colors.primaryLight,
    bottom: -80,
    left: -80,
  },
  blob3: {
    width: 180,
    height: 180,
    backgroundColor: Colors.skyBlue,
    top: '45%',
    right: -50,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  appTitle: {
    fontSize: 48,
    fontWeight: '900',
    color: Colors.accent,
  },
  mainCard: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 20,
    elevation: 10,
  },
  loginTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    color: Colors.textDark,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    color: Colors.textDark,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    backgroundColor: Colors.backgroundSoft,
  },
  inputWrapperFocused: {
    borderColor: Colors.accent,
    backgroundColor: Colors.white,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.textDark,
  },
  passwordInput: {
    paddingRight: 10,
  },
  eyeIcon: {
    marginLeft: 8,
    padding: 4,
  },
  eyeIconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  eyeShape: {
    width: 20,
    height: 12,
    borderWidth: 2,
    borderColor: Colors.textMedium,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyePupil: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.textMedium,
  },
  eyeSlash: {
    position: 'absolute',
    width: 26,
    height: 2,
    backgroundColor: Colors.textMedium,
    transform: [{ rotate: '45deg' }],
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 4,
    marginLeft: 4,
  },
  loginButton: {
    marginTop: 18,
    borderRadius: 12,
    backgroundColor: Colors.accent,
    paddingVertical: 15,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  signUpLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 14,
    color: Colors.textMedium,
  },
  signUpTextBold: {
    color: Colors.accent,
    fontWeight: '700',
  },
});
