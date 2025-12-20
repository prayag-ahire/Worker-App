import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Colors } from '../styles/colors';
import { useLanguage } from '../contexts/LanguageContext';
import { ScreenHeader } from '../components';

interface EditProfileScreenProps {
  onBack?: () => void;
  onSave?: (data: any) => void;
}

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ onBack, onSave }) => {
  const { t } = useLanguage();
  const [name, setName] = useState('Praveg Amine');
  const [charges, setCharges] = useState('200');
  const [description, setDescription] = useState('Hi, i am professional developer and i have 2 year\'s of experience');
  const [distanceCharges, setDistanceCharges] = useState('50');

  const handleSave = () => {
    console.log('Save pressed');
    const data = { name, charges, description };
    if (onSave) {
      onSave(data);
    }
    if (onBack) {
      onBack();
    }
  };

  const handleSelectImage = () => {
    console.log('Select image pressed');
    // Add image picker logic here
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.accent} translucent={true} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <ScreenHeader title={t('profile.editProfile')} onBack={onBack} variant="blue" />
        </View>

        {/* Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor={Colors.textLight}
          />
        </View>

        {/* Image */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Image</Text>
          <TouchableOpacity style={styles.selectImageButton} onPress={handleSelectImage}>
            <Text style={styles.selectImageText}>Select image</Text>
          </TouchableOpacity>
        </View>

        {/* Visit Charge */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('profile.visitCharge')}</Text>
          <TextInput
            style={styles.input}
            value={charges}
            onChangeText={setCharges}
            placeholder="Enter visit charge"
            placeholderTextColor={Colors.textLight}
            keyboardType="number-pad"
          />
        </View>

        {/* Distance Charges */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('profile.distanceCharges')}</Text>
          <TextInput
            style={styles.input}
            value={distanceCharges}
            onChangeText={setDistanceCharges}
            placeholder="Enter distance charges"
            placeholderTextColor={Colors.textLight}
            keyboardType="number-pad"
          />
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.descriptionInput}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter description"
            placeholderTextColor={Colors.textLight}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        </View>

        {/* Update Button */}
        <TouchableOpacity style={styles.updateButton} onPress={handleSave}>
          <Text style={styles.updateButtonText}>Update</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
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
  updateButtonText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default EditProfileScreen;
