import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { Colors } from '../styles/colors';
import { signupWorker } from '../services/apiClient';
import { saveAuthToken, saveProfileCompleted, clearAuthData } from '../utils/storage';

interface SignUpScreenProps {
  onSignUpComplete?: (referralCode?: string) => void;
  onLoginPress?: () => void;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ onSignUpComplete, onLoginPress }) => {
  const [phoneNo, setPhoneNo] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 🔹 Same phone validation logic as Login page
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

  const handleSignUp = async () => {
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

    if (password !== rePassword) {
      Toast.show({
        type: 'error',
        text1: 'Password Mismatch',
        text2: 'Passwords do not match.',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    // Validate referral code if provided
    if (referralCode && referralCode.trim()) {
      if (referralCode.trim().length < 3) {
        Toast.show({
          type: 'error',
          text1: 'Invalid Referral Code',
          text2: 'Referral code must be at least 3 digits.',
          position: 'top',
          visibilityTime: 3000,
        });
        return;
      }
      // Additional validation: check if it's a valid number
      if (isNaN(Number(referralCode.trim()))) {
        Toast.show({
          type: 'error',
          text1: 'Invalid Referral Code',
          text2: 'Referral code must contain only numbers.',
          position: 'top',
          visibilityTime: 3000,
        });
        return;
      }
    }

    if (!termsAccepted) {
      Toast.show({
        type: 'error',
        text1: 'Terms & Privacy Policy',
        text2: 'Please accept the Terms & Privacy Policy to continue.',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    setIsLoading(true);

    try {
      // Clear any existing auth data before signing up
      await clearAuthData();

      // Call the signup API
      const response = await signupWorker(phoneNo, password);

      // Save the auth token and profile completion status
      await saveAuthToken(response.token);
      await saveProfileCompleted(response.profileCompleted);

      // Show success message
      Toast.show({
        type: 'success',
        text1: 'Account Created',
        text2: 'Welcome to ProWorker!',
        position: 'top',
        visibilityTime: 2000,
      });

      // Call the success callback after a short delay, passing referral code
      setTimeout(() => {
        onSignUpComplete?.(referralCode);
      }, 500);

    } catch (error: any) {
      console.error('Signup error:', error);
      
      // Show error message
      Toast.show({
        type: 'error',
        text1: 'Signup Failed',
        text2: error.message || 'An error occurred during signup. Please try again.',
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

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.appTitle}>ProWorker</Text>
          </View>

          {/* Card */}
          <View style={styles.mainCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.signUpTitle}>Create Account</Text>
              <Text style={styles.subtitle}>Join thousands of professionals</Text>
            </View>

            {/* Phone Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <View
                style={[
                  styles.inputWrapper,
                  focusedField === 'phone' && styles.inputWrapperFocused,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="Enter 10-digit phone number"
                  placeholderTextColor={Colors.textLight}
                  keyboardType="number-pad"
                  value={phoneNo}
                  onChangeText={handlePhoneChange}
                  maxLength={10}
                  autoCorrect={false}
                  autoCapitalize="none"
                  textContentType="telephoneNumber"
                  onFocus={() => setFocusedField('phone')}
                  onBlur={() => {
                    setFocusedField(null);
                    if (phoneNo.length > 0 && phoneNo.length < 10) {
                      validatePhone();
                    }
                  }}
                />
              </View>

              {phoneNo.length > 0 && phoneNo.length < 10 && (
                <Text style={styles.errorText}>
                  Phone number must be 10 digits ({phoneNo.length}/10)
                </Text>
              )}
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View
                style={[
                  styles.inputWrapper,
                  focusedField === 'password' && styles.inputWrapperFocused,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="Create a strong password"
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
                      <View style={styles.eyeShape}>
                        <View style={styles.eyePupil} />
                      </View>
                      <View style={styles.eyeSlash} />
                    </View>
                  ) : (
                    <View style={styles.eyeIconContainer}>
                      <View style={styles.eyeShape}>
                        <View style={styles.eyePupil} />
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <View
                style={[
                  styles.inputWrapper,
                  focusedField === 'rePassword' && styles.inputWrapperFocused,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="Re-enter your password"
                  placeholderTextColor={Colors.textLight}
                  secureTextEntry
                  value={rePassword}
                  onChangeText={setRePassword}
                  onFocus={() => setFocusedField('rePassword')}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>

            {/* Referral Code (Optional) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Referral Code (Optional)</Text>
              <View
                style={[
                  styles.inputWrapper,
                  focusedField === 'referralCode' && styles.inputWrapperFocused,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="Enter referral code"
                  placeholderTextColor={Colors.textLight}
                  value={referralCode}
                  onChangeText={(text) => {
                    // Only allow numeric input
                    const numericText = text.replace(/[^0-9]/g, '');
                    setReferralCode(numericText);
                  }}
                  onFocus={() => setFocusedField('referralCode')}
                  onBlur={() => setFocusedField(null)}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Terms Checkbox */}
            <TouchableOpacity 
              style={styles.termsContainer}
              onPress={() => setTermsAccepted(!termsAccepted)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
                {termsAccepted && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.termsText}>
                I agree to the <Text style={styles.termsLink}>Terms & Privacy Policy</Text>
              </Text>
            </TouchableOpacity>

            {/* Button */}
            <TouchableOpacity 
              style={[styles.signUpButton, isLoading && styles.signUpButtonDisabled]} 
              onPress={handleSignUp}
              disabled={isLoading}
            >
              <View style={styles.buttonGradient}>
                {isLoading ? (
                  <ActivityIndicator color={Colors.white} size="small" />
                ) : (
                  <Text style={styles.signUpButtonText}>Create Account →</Text>
                )}
              </View>
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginLink}>
              <Text style={styles.loginText}>
                Already have an account?{' '}
                <Text style={styles.loginTextBold} onPress={onLoginPress}>
                  Login
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Toast />
    </View>
  );
};

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
  cardHeader: {
    marginBottom: 20,
  },
  signUpTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textDark,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textMedium,
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
  eyeIcon: {
    marginLeft: 8,
    padding: 4,
  },
  eyeIconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
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
  signUpButton: {
    marginTop: 18,
    borderRadius: 12,
    overflow: 'hidden',
  },
  signUpButtonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    backgroundColor: Colors.accent,
    paddingVertical: 15,
    alignItems: 'center',
  },
  signUpButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },
  footerText: {
    fontSize: 11,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: 14,
  },
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: Colors.textMedium,
  },
  loginTextBold: {
    color: Colors.accent,
    fontWeight: '700',
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 4,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.border,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  checkmark: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textMedium,
    lineHeight: 18,
  },
  termsLink: {
    color: Colors.accent,
    fontWeight: '600',
  },
});
export default SignUpScreen;
