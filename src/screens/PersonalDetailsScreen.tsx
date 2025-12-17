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
} from 'react-native';
import Toast from 'react-native-toast-message';
import { Colors } from '../styles/colors';
import { useLanguage } from '../contexts/LanguageContext';

interface PersonalDetailsScreenProps {
  onComplete?: () => void;
}

const PersonalDetailsScreen: React.FC<PersonalDetailsScreenProps> = ({ onComplete }) => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | null>(null);

  // ---------- VALIDATION HELPERS ----------
  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const isValidPhone = (value: string) =>
    /^[0-9]{10}$/.test(value);

  const isValidAge = (value: string) => {
    const num = Number(value);
    return num >= 18 && num <= 120;
  };

  // ---------- SUBMIT ----------
  const handleCreateProfile = () => {
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

    if (!phone || !isValidPhone(phone)) {
      Toast.show({
        type: 'error',
        text1: t('personalDetails.invalidPhone'),
        text2: t('personalDetails.invalidPhoneMessage'),
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

    console.log({ name, age, email, phone, gender });
    onComplete?.();
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
                />
              </View>
            </View>

            {/* Age */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('personalDetails.age')}</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder={t('personalDetails.agePlaceholder')}
                  placeholderTextColor={Colors.textLight}
                  value={age}
                  keyboardType="number-pad"
                  onChangeText={(t) => setAge(t.replace(/[^0-9]/g, ''))}
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('personalDetails.email')}</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder={t('personalDetails.emailPlaceholder')}
                  placeholderTextColor={Colors.textLight}
                  value={email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={setEmail}
                />
              </View>
            </View>

            {/* Phone */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('personalDetails.phone')}</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder={t('personalDetails.phonePlaceholder')}
                  placeholderTextColor={Colors.textLight}
                  value={phone}
                  keyboardType="number-pad"
                  maxLength={10}
                  onChangeText={(t) => setPhone(t.replace(/[^0-9]/g, ''))}
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

            {/* Button */}
            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreateProfile}
              activeOpacity={0.9}
            >
              <Text style={styles.createButtonText}>{t('personalDetails.createProfile')}</Text>
            </TouchableOpacity>
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
  createButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 0.5,
  },
});
export default PersonalDetailsScreen;
