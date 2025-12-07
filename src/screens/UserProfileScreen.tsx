import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Switch,
} from 'react-native';
import { Colors } from '../styles/colors';

interface UserProfileScreenProps {
  onBack?: () => void;
  onEdit?: () => void;
}

const UserProfileScreen: React.FC<UserProfileScreenProps> = ({ onBack, onEdit }) => {
  const [name, setName] = useState('Praveg Amine');
  const [charges, setCharges] = useState('200/hr');
  const [rating] = useState(4); // 4 out of 6 stars
  const [distanceCharges, setDistanceCharges] = useState(true);
  const [description, setDescription] = useState('');
  const [activeTab, setActiveTab] = useState<'image' | 'video' | 'review'>('image');

  const handleEdit = () => {
    console.log('Edit pressed');
    if (onEdit) {
      onEdit();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>User Profile</Text>
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          {/* Left: Profile Image */}
          <View style={styles.profileImage}>
            <Text style={styles.profileImageText}>📷</Text>
          </View>

          {/* Right: Details */}
          <View style={styles.detailsSection}>
            {/* Name */}
            <Text style={styles.nameText}>{name}</Text>

            {/* Charges */}
            <View style={styles.infoRow}>
              <Text style={styles.label}>charges : </Text>
              <Text style={styles.value}>{charges}</Text>
            </View>

            {/* Rating */}
            <View style={styles.ratingRow}>
              <Text style={styles.label}>Rating </Text>
              <View style={styles.stars}>
                {[1, 2, 3, 4, 5, 6].map((star) => (
                  <Text key={star} style={styles.star}>
                    {star <= rating ? '⭐' : '☆'}
                  </Text>
                ))}
              </View>
            </View>

            {/* Distance Charges */}
            <View style={styles.distanceRow}>
              <Text style={styles.distanceLabel}>Distance Charges</Text>
              <View style={styles.switchContainer}>
                <Switch
                  value={distanceCharges}
                  onValueChange={setDistanceCharges}
                  trackColor={{ false: Colors.border, true: Colors.accent }}
                  thumbColor={Colors.white}
                />
                <Text style={styles.switchLabel}>{distanceCharges ? 'ON' : 'OFF'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Description..."
            placeholderTextColor={Colors.textLight}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'image' && styles.tabActive]}
            onPress={() => setActiveTab('image')}
          >
            <Text style={[styles.tabText, activeTab === 'image' && styles.tabTextActive]}>
              image
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'video' && styles.tabActive]}
            onPress={() => setActiveTab('video')}
          >
            <Text style={[styles.tabText, activeTab === 'video' && styles.tabTextActive]}>
              video
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'review' && styles.tabActive]}
            onPress={() => setActiveTab('review')}
          >
            <Text style={[styles.tabText, activeTab === 'review' && styles.tabTextActive]}>
              review
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content Area */}
        <View style={styles.contentArea}>
          <Text style={styles.contentPlaceholder}>
            {activeTab === 'image' && 'Images will appear here'}
            {activeTab === 'video' && 'Videos will appear here'}
            {activeTab === 'review' && 'Reviews will appear here'}
          </Text>
        </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginTop: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 28,
    color: Colors.accent,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textDark,
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
  },
  editButtonText: {
    fontSize: 14,
    color: Colors.textDark,
    fontWeight: '500',
  },
  profileSection: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.backgroundSoft,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  profileImageText: {
    fontSize: 32,
  },
  detailsSection: {
    flex: 1,
    justifyContent: 'center',
  },
  nameText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: Colors.textDark,
    fontWeight: '400',
  },
  value: {
    fontSize: 14,
    color: Colors.textDark,
    fontWeight: '600',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stars: {
    flexDirection: 'row',
    gap: 4,
  },
  star: {
    fontSize: 16,
  },
  distanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  distanceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textDark,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textDark,
  },
  descriptionContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: Colors.textDark,
    minHeight: 80,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  tabActive: {
    backgroundColor: Colors.backgroundSoft,
  },
  tabText: {
    fontSize: 14,
    color: Colors.textMedium,
    fontWeight: '500',
  },
  tabTextActive: {
    color: Colors.textDark,
    fontWeight: '600',
  },
  contentArea: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    minHeight: 300,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentPlaceholder: {
    fontSize: 14,
    color: Colors.textLight,
  },
});

export default UserProfileScreen;
