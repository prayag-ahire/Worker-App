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
    console.log('Create Profile pressed');
    console.log({ name, age, email, phone, gender });
    // Add your profile creation logic here
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.backgroundLight} />
      
      {/* Gradient Background Overlay */}
      <View style={styles.gradientOverlay}>
        <View style={[styles.blob, styles.blob1]} />
        <View style={[styles.blob, styles.blob2]} />
      </View>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Personal Details</Text>
            
            {/* Profile Image Placeholder */}
            <View style={styles.profileImageContainer}>
              <View style={styles.profileImage}>
                <Text style={styles.profileImageText}>📷</Text>
              </View>
            </View>
          </View>

          {/* Form Section */}
          <View style={styles.formContainer}>
              {/* Name Input */}
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

              {/* Age Input */}
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
                    onChangeText={setAge}
                    keyboardType="number-pad"
                    onFocus={() => setFocusedField('age')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>

              {/* Email Input */}
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
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>

              {/* Phone Input */}
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
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    onFocus={() => setFocusedField('phone')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>

              {/* Gender Selection */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Gender</Text>
                <View style={styles.genderContainer}>
                  <TouchableOpacity
                    style={[
                      styles.genderButton,
                      gender === 'male' && styles.genderButtonActive,
                    ]}
                    onPress={() => setGender('male')}
                  >
                    <View style={styles.radioOuter}>
                      {gender === 'male' && <View style={styles.radioInner} />}
                    </View>
                    <Text style={[
                      styles.genderText,
                      gender === 'male' && styles.genderTextActive,
                    ]}>
                      Male
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.genderButton,
                      gender === 'female' && styles.genderButtonActive,
                    ]}
                    onPress={() => setGender('female')}
                  >
                    <View style={styles.radioOuter}>
                      {gender === 'female' && <View style={styles.radioInner} />}
                    </View>
                    <Text style={[
                      styles.genderText,
                      gender === 'female' && styles.genderTextActive,
                    ]}>
                      Female
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Create Profile Button */}
              <TouchableOpacity
                style={styles.createButton}
                onPress={handleCreateProfile}
                activeOpacity={0.9}
              >
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
    position: 'relative',
  },
  gradientOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 32,
    paddingVertical: 20,
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
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  profileImageContainer: {
    marginBottom: 4,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.accent,
    shadowColor: Colors.accent,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
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
    color: Colors.textDark,
    marginBottom: 6,
    fontWeight: '600',
  },
  inputWrapper: {
    backgroundColor: Colors.backgroundSoft,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    height: 44,
    justifyContent: 'center',
  },
  inputWrapperFocused: {
    borderColor: Colors.accent,
    backgroundColor: Colors.white,
    shadowColor: Colors.accent,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  input: {
    fontSize: 14,
    color: Colors.textDark,
    padding: 0,
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
    paddingVertical: 10,
    paddingHorizontal: 12,
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
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
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
    fontWeight: '500',
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
    justifyContent: 'center',
    shadowColor: Colors.accent,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  createButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 0.5,
  },
});

export default PersonalDetailsScreen;
