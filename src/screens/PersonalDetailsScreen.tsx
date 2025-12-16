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
import { Colors } from '../styles/colors';

interface PersonalDetailsScreenProps {
  onComplete?: () => void;
}

const PersonalDetailsScreen: React.FC<PersonalDetailsScreenProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleCreateProfile = () => {
    console.log({ name, age, email, phone, gender });
    onComplete?.();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.backgroundLight} />

      {/* Background blobs */}
      <View style={styles.gradientOverlay}>
        <View style={[styles.blob, styles.blob1]} />
        <View style={[styles.blob, styles.blob2]} />
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
            <Text style={styles.title}>Personal Details</Text>

            <View style={styles.profileImage}>
              <Text style={styles.profileImageText}>📷</Text>
            </View>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name</Text>
              <View
                style={[
                  styles.inputWrapper,
                  focusedField === 'name' && styles.inputWrapperFocused,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="Enter your name"
                  placeholderTextColor={Colors.textLight}
                  value={name}
                  onChangeText={setName}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>

            {/* Age */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Age</Text>
              <View
                style={[
                  styles.inputWrapper,
                  focusedField === 'age' && styles.inputWrapperFocused,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="Enter your age"
                  placeholderTextColor={Colors.textLight}
                  value={age}
                  keyboardType="number-pad"
                  onChangeText={setAge}
                  onFocus={() => setFocusedField('age')}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View
                style={[
                  styles.inputWrapper,
                  focusedField === 'email' && styles.inputWrapperFocused,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="example@gmail.com"
                  placeholderTextColor={Colors.textLight}
                  value={email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={setEmail}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>

            {/* Phone */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone</Text>
              <View
                style={[
                  styles.inputWrapper,
                  focusedField === 'phone' && styles.inputWrapperFocused,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="1234567890"
                  placeholderTextColor={Colors.textLight}
                  value={phone}
                  keyboardType="phone-pad"
                  onChangeText={setPhone}
                  onFocus={() => setFocusedField('phone')}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>

            {/* Gender */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Gender</Text>
              <View style={styles.genderContainer}>
                {(['male', 'female'] as const).map((g) => (
                  <TouchableOpacity
                    key={g}
                    style={[
                      styles.genderButton,
                      gender === g && styles.genderButtonActive,
                    ]}
                    onPress={() => setGender(g)}
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
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Button */}
            <TouchableOpacity style={styles.createButton} onPress={handleCreateProfile}>
              <Text style={styles.createButtonText}>Create Profile</Text>
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
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textDark,
  },
  profileImage: {
    marginTop: 16,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.accent,
  },
  profileImageText: {
    fontSize: 28,
  },
  formContainer: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    color: Colors.textDark,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    backgroundColor: Colors.backgroundSoft,
  },
  inputWrapperFocused: {
    borderColor: Colors.accent,
    backgroundColor: Colors.white,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.textDark,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.backgroundSoft,
  },
  genderButtonActive: {
    borderColor: Colors.accent,
    backgroundColor: Colors.white,
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: Colors.border,
    marginRight: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
  },
  genderText: {
    fontSize: 13,
    color: Colors.textMedium,
  },
  genderTextActive: {
    color: Colors.accent,
    fontWeight: '600',
  },
  createButton: {
    marginTop: 14,
    borderRadius: 10,
    backgroundColor: Colors.accent,
    paddingVertical: 13,
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
});

export default PersonalDetailsScreen;
