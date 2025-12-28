import React, { useState, useEffect } from 'react';
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
import { useLanguage } from '../contexts/LanguageContext';
import { ScreenHeader } from '../components';
import { getUserProfile, updateUserProfile } from '../services/apiClient';
import { getAuthToken } from '../utils/storage';

interface EditProfileScreenProps {
  onBack?: () => void;
  onSave?: (data: any) => void;
}

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ onBack, onSave }) => {
  const { t } = useLanguage();
  
  // Personal Details
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  
  // Professional Details
  const [profession, setProfession] = useState('');
  const [description, setDescription] = useState('');
  const [charges, setCharges] = useState('');
  const [distanceCharges, setDistanceCharges] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Fetch current profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await getAuthToken();
        if (!token) {
          throw new Error('No authentication token found. Please login again.');
        }

        const data = await getUserProfile(token);
        
        // Populate form with current data
        setName(data.username || '');
        setAge(data.Age?.toString() || '');
        setEmail(data.Email || '');
        setGender(data.gender === 'MALE' ? 'male' : 'female');
        setProfession(data.profession || '');
        setDescription(data.Description || '');
        setCharges(data.Charges_PerVisit?.toString() || '');
        setDistanceCharges(data.Distance_charges?.toString() || '');
        
        console.log('Loaded profile data for editing');
      } catch (error: any) {
        console.error('Error fetching profile:', error);
        Toast.show({
          type: 'error',
          text1: 'Failed to Load Profile',
          text2: error.message || 'Could not fetch profile data',
          position: 'top',
          visibilityTime: 3000,
        });
      } finally {
        setIsFetching(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    // Validation
    if (name.trim().length < 2) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Name',
        text2: 'Name must be at least 2 characters',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    if (!age || Number(age) < 18 || Number(age) > 120) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Age',
        text2: 'Age must be between 18 and 120',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Email',
        text2: 'Please enter a valid email address',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    if (!charges || Number(charges) < 1 || Number(charges) > 10000) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Charges',
        text2: 'Charges must be between 1 and 10000',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    if (!distanceCharges || Number(distanceCharges) < 1 || Number(distanceCharges) > 10000) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Distance Charges',
        text2: 'Distance charges must be between 1 and 10000',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    setIsLoading(true);

    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      // Prepare update data
      const updateData = {
        Name: name.trim(),
        Email: email.trim(),
        Age: Number(age),
        gender: gender === 'male' ? 'MALE' : 'Female',
        profession: profession.trim(),
        Description: description.trim(),
        Distance_charges: Number(distanceCharges),
        Charges_PerVisit: Number(charges),
      };

      const updatedProfile = await updateUserProfile(token, updateData);

      Toast.show({
        type: 'success',
        text1: 'Profile Updated',
        text2: 'Your profile has been updated successfully!',
        position: 'top',
        visibilityTime: 2000,
      });

      // Call callbacks
      if (onSave) {
        onSave(updatedProfile);
      }

      // Navigate back after a short delay
      setTimeout(() => {
        if (onBack) {
          onBack();
        }
      }, 500);

    } catch (error: any) {
      console.error('Profile update error:', error);
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: error.message || 'Failed to update profile',
        position: 'top',
        visibilityTime: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectImage = () => {
    console.log('Select image pressed');
    // Add image picker logic here
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.accent} translucent={true} />

      {isFetching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.accent} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.headerContainer}>
            <ScreenHeader title={t('profile.editProfile')} onBack={onBack} variant="blue" />
          </View>

          {/* Professional Details Section */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Professional Details</Text>
            
            {/* Profession */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Profession</Text>
              <TextInput
                style={styles.input}
                value={profession}
                onChangeText={setProfession}
                placeholder="e.g., Plumber, Electrician"
                placeholderTextColor={Colors.textLight}
                editable={!isLoading}
              />
            </View>

            {/* Visit Charge */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Charges Per Visit (₹)</Text>
              <TextInput
                style={styles.input}
                value={charges}
                onChangeText={setCharges}
                placeholder="Enter visit charge"
                placeholderTextColor={Colors.textLight}
                keyboardType="number-pad"
                editable={!isLoading}
              />
            </View>

            {/* Distance Charges */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Distance Charges (₹/km)</Text>
              <TextInput
                style={styles.input}
                value={distanceCharges}
                onChangeText={setDistanceCharges}
                placeholder="Enter distance charges"
                placeholderTextColor={Colors.textLight}
                keyboardType="number-pad"
                editable={!isLoading}
              />
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>About Your Services</Text>
              <TextInput
                style={styles.descriptionInput}
                value={description}
                onChangeText={setDescription}
                placeholder="Describe your skills and experience..."
                placeholderTextColor={Colors.textLight}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Personal Details Section */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Personal Details</Text>
            
            {/* Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor={Colors.textLight}
                editable={!isLoading}
              />
            </View>

            {/* Age */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Age</Text>
              <TextInput
                style={styles.input}
                value={age}
                onChangeText={setAge}
                placeholder="Enter your age"
                placeholderTextColor={Colors.textLight}
                keyboardType="number-pad"
                editable={!isLoading}
              />
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor={Colors.textLight}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>

            {/* Gender */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Gender</Text>
              <View style={styles.genderContainer}>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    gender === 'male' && styles.genderButtonActive,
                  ]}
                  onPress={() => setGender('male')}
                  activeOpacity={0.8}
                  disabled={isLoading}
                >
                  <View style={styles.radioOuter}>
                    {gender === 'male' && <View style={styles.radioInner} />}
                  </View>
                  <Text
                    style={[
                      styles.genderText,
                      gender === 'male' && styles.genderTextActive,
                    ]}
                  >
                    Male
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    gender === 'female' && styles.genderButtonActive,
                  ]}
                  onPress={() => setGender('female')}
                  activeOpacity={0.8}
                  disabled={isLoading}
                >
                  <View style={styles.radioOuter}>
                    {gender === 'female' && <View style={styles.radioInner} />}
                  </View>
                  <Text
                    style={[
                      styles.genderText,
                      gender === 'female' && styles.genderTextActive,
                    ]}
                  >
                    Female
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Profile Image */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Profile Image</Text>
              <TouchableOpacity 
                style={styles.selectImageButton} 
                onPress={handleSelectImage}
                disabled={isLoading}
              >
                <Text style={styles.selectImageText}>Select image</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Update Button */}
          <TouchableOpacity 
            style={[styles.updateButton, isLoading && styles.updateButtonDisabled]} 
            onPress={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <Text style={styles.updateButtonText}>Update Profile</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      )}
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textMedium,
    fontWeight: '500',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  headerContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    color: Colors.textDark,
    marginBottom: 10,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.textDark,
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    backgroundColor: Colors.white,
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
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
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
  selectImageButton: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: Colors.backgroundAccent,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectImageText: {
    fontSize: 15,
    color: Colors.accent,
    fontWeight: '600',
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.textDark,
    minHeight: 120,
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  updateButton: {
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 24,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  updateButtonDisabled: {
    opacity: 0.6,
  },
  updateButtonText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default EditProfileScreen;
