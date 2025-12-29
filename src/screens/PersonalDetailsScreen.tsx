import React, { useState, useRef } from 'react';
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
import { useLanguage } from '../contexts/LanguageContext';
import { createWorkerProfile, getUserProfile as fetchUserProfile } from '../services/apiClient';
import { getAuthToken, saveProfileCompleted, saveUserProfile } from '../utils/storage';

interface PersonalDetailsScreenProps {
  onComplete?: () => void;
  referralCode?: string;
  onShowError?: (fromScreen: 'personalDetails', message?: string) => void;
}

const PersonalDetailsScreen: React.FC<PersonalDetailsScreenProps> = ({ onComplete, referralCode, onShowError }) => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
  const [profession, setProfession] = useState('');
  const [description, setDescription] = useState('');
  const [charges, setCharges] = useState('');
  const [distanceCharges, setDistanceCharges] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Refs for keyboard navigation
  const ageInputRef = useRef<TextInput>(null);
  const emailInputRef = useRef<TextInput>(null);
  const professionInputRef = useRef<TextInput>(null);
  const descriptionInputRef = useRef<TextInput>(null);
  const chargesInputRef = useRef<TextInput>(null);
  const distanceChargesInputRef = useRef<TextInput>(null);


  // ---------- VALIDATION HELPERS ----------
  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const isValidAge = (value: string) => {
    const num = Number(value);
    return num >= 18 && num <= 120;
  };

  const isValidCharges = (value: string) => {
    const num = Number(value);
    return num > 0 && num <= 10000;
  };

  // ---------- SUBMIT ----------
  const handleCreateProfile = async () => {
    if (name.trim().length < 2) {
      Toast.show({
        type: 'error',
        text1: t('personalDetails.invalidName'),
        text2: t('personalDetails.invalidNameMessage'),
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    if (!age || !isValidAge(age)) {
      Toast.show({
        type: 'error',
        text1: t('personalDetails.invalidAge'),
        text2: t('personalDetails.invalidAgeMessage'),
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    if (!email || !isValidEmail(email)) {
      Toast.show({
        type: 'error',
        text1: t('personalDetails.invalidEmail'),
        text2: t('personalDetails.invalidEmailMessage'),
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    if (!gender) {
      Toast.show({
        type: 'error',
        text1: t('personalDetails.genderRequired'),
        text2: t('personalDetails.genderRequiredMessage'),
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    if (profession.trim().length < 2) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Profession',
        text2: 'Please enter your profession.',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    if (description.trim().length < 10) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Description',
        text2: 'Please provide a description (at least 10 characters).',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    if (!charges || !isValidCharges(charges)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Charges',
        text2: 'Please enter valid charges per visit (1-10000).',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    if (!distanceCharges || !isValidCharges(distanceCharges)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Distance Charges',
        text2: 'Please enter valid distance charges (1-10000).',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    setIsLoading(true);

    try {
      // Get the auth token
      const token = await getAuthToken();
      
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      // Create the profile with proper gender enum values
      const profileData: any = {
        username: name.trim(),
        Email: email.trim(),
        Age: Number(age),
        gender: gender === 'male' ? 'MALE' : 'Female', // Convert to API enum format
        profession: profession.trim(),
        Description: description.trim(),
        Distance_charges: Number(distanceCharges),
        Charges_PerVisit: Number(charges),
        ImgURL: '', // Optional, can be added later
      };

      // Add ReferenceId if referral code was provided
      if (referralCode && referralCode.trim()) {
        profileData.ReferenceId = Number(referralCode.trim());
      }

      await createWorkerProfile(token, profileData);

      // Update profile completed status
      await saveProfileCompleted(true);

      // Fetch and cache the created profile
      try {
        const createdProfile = await fetchUserProfile(token);
        await saveUserProfile(createdProfile);
        console.log('User profile cached after creation');
      } catch (profileError) {
        console.error('Error fetching profile after creation:', profileError);
        // Don't fail if profile fetch fails
      }

      // Show success message
      Toast.show({
        type: 'success',
        text1: 'Profile Created',
        text2: 'Your worker profile has been created successfully!',
        position: 'top',
        visibilityTime: 2000,
      });

      // Call the success callback after a short delay
      setTimeout(() => {
        onComplete?.();
      }, 500);

    } catch (error: any) {
      console.error('Profile creation error:', error);
      
      // Show error message
      Toast.show({
        type: 'error',
        text1: 'Profile Creation Failed',
        text2: error.message || 'An error occurred. Please try again.',
        position: 'top',
        visibilityTime: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.accent} translucent />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{t('personalDetails.title')}</Text>
            <Text style={styles.subtitle}>{t('personalDetails.subtitle')}</Text>
          </View>

          {/* Profile Image */}
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <Text style={styles.profileImageText}>📷</Text>
            </View>
            <Text style={styles.uploadText}>{t('personalDetails.uploadPhoto')}</Text>
          </View>

          {/* Form */}
          <View style={styles.formCard}>
            {/* Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('personalDetails.name')}</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder={t('personalDetails.namePlaceholder')}
                  placeholderTextColor={Colors.textLight}
                  value={name}
                  onChangeText={setName}
                  returnKeyType="next"
                  onSubmitEditing={() => ageInputRef.current?.focus()}
                  blurOnSubmit={false}
                />
              </View>
            </View>

            {/* Age */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('personalDetails.age')}</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  ref={ageInputRef}
                  style={styles.input}
                  placeholder={t('personalDetails.agePlaceholder')}
                  placeholderTextColor={Colors.textLight}
                  value={age}
                  keyboardType="number-pad"
                  returnKeyType="next"
                  onChangeText={(t) => setAge(t.replace(/[^0-9]/g, ''))}
                  onSubmitEditing={() => emailInputRef.current?.focus()}
                  blurOnSubmit={false}
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('personalDetails.email')}</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  ref={emailInputRef}
                  style={styles.input}
                  placeholder={t('personalDetails.emailPlaceholder')}
                  placeholderTextColor={Colors.textLight}
                  value={email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="next"
                  onChangeText={setEmail}
                  onSubmitEditing={() => professionInputRef.current?.focus()}
                  blurOnSubmit={false}
                />
              </View>
            </View>

            {/* Gender */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('personalDetails.gender')}</Text>
              <View style={styles.genderContainer}>
                {(['male', 'female'] as const).map((g) => (
                  <TouchableOpacity
                    key={g}
                    style={[
                      styles.genderButton,
                      gender === g && styles.genderButtonActive,
                    ]}
                    onPress={() => setGender(g)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.radioOuter}>
                      {gender === g && <View style={styles.radioInner} />}
                    </View>
                    <Text
                      style={[
                        styles.genderText,
                        gender === g && styles.genderTextActive,
                      ]}
                    >
                      {t(`personalDetails.${g}`)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Profession */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Profession</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  ref={professionInputRef}
                  style={styles.input}
                  placeholder="e.g., Plumber, Electrician, Carpenter"
                  placeholderTextColor={Colors.textLight}
                  value={profession}
                  onChangeText={setProfession}
                  returnKeyType="next"
                  onSubmitEditing={() => descriptionInputRef.current?.focus()}
                  blurOnSubmit={false}
                />
              </View>
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>About Your Services</Text>
              <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
                <TextInput
                  ref={descriptionInputRef}
                  style={[styles.input, styles.textArea]}
                  placeholder="Describe your skills and experience..."
                  placeholderTextColor={Colors.textLight}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  returnKeyType="next"
                  onSubmitEditing={() => chargesInputRef.current?.focus()}
                  blurOnSubmit={false}
                />
              </View>
            </View>

            {/* Charges */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Charges Per Visit (₹)</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  ref={chargesInputRef}
                  style={styles.input}
                  placeholder="Enter your service charge"
                  placeholderTextColor={Colors.textLight}
                  value={charges}
                  keyboardType="number-pad"
                  returnKeyType="next"
                  onChangeText={(t) => setCharges(t.replace(/[^0-9]/g, ''))}
                  onSubmitEditing={() => distanceChargesInputRef.current?.focus()}
                  blurOnSubmit={false}
                />
              </View>
            </View>

            {/* Distance Charges */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Distance Charges (₹/km)</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  ref={distanceChargesInputRef}
                  style={styles.input}
                  placeholder="Enter distance charges per km"
                  placeholderTextColor={Colors.textLight}
                  value={distanceCharges}
                  keyboardType="number-pad"
                  returnKeyType="done"
                  onChangeText={(t) => setDistanceCharges(t.replace(/[^0-9]/g, ''))}
                  onSubmitEditing={handleCreateProfile}
                />
              </View>
            </View>

            {/* Button */}
            <TouchableOpacity
              style={[styles.createButton, isLoading && styles.createButtonDisabled]}
              onPress={handleCreateProfile}
              activeOpacity={0.9}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.white} size="small" />
              ) : (
                <Text style={styles.createButtonText}>{t('personalDetails.createProfile')}</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 60,
    backgroundColor: Colors.accent,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.95,
    fontWeight: '400',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginTop: -50,
    marginBottom: 24,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: Colors.white,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  profileImageText: {
    fontSize: 40,
  },
  uploadText: {
    fontSize: 12,
    color: Colors.textMedium,
    marginTop: 10,
    fontWeight: '500',
  },
  formCard: {
    marginHorizontal: 20,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    color: Colors.textDark,
    letterSpacing: 0.3,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E0E4E8',
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.textDark,
    fontWeight: '500',
  },
  textAreaWrapper: {
    height: 100,
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  textArea: {
    height: '100%',
    textAlignVertical: 'top',
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E0E4E8',
    backgroundColor: '#F9FAFB',
  },
  genderButtonActive: {
    borderColor: Colors.accent,
    backgroundColor: Colors.backgroundAccent,
    elevation: 2,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#E0E4E8',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.accent,
  },
  genderText: {
    fontSize: 15,
    color: Colors.textMedium,
    fontWeight: '600',
  },
  genderTextActive: {
    color: Colors.accent,
    fontWeight: '700',
  },
  createButton: {
    marginTop: 24,
    borderRadius: 14,
    backgroundColor: Colors.accent,
    paddingVertical: 16,
    alignItems: 'center',
    elevation: 8,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 0.5,
  },
});
export default PersonalDetailsScreen;
