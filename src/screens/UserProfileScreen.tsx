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
import { useLanguage } from '../contexts/LanguageContext';
import { ScreenHeader } from '../components';

interface UserProfileScreenProps {
  onBack?: () => void;
  onEdit?: () => void;
}

const UserProfileScreen: React.FC<UserProfileScreenProps> = ({ onBack, onEdit }) => {
  const { t } = useLanguage();
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
      <StatusBar barStyle="light-content" backgroundColor={Colors.accent} translucent={true} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Edit Button */}
        <View style={styles.headerContainer}>
          <ScreenHeader title={t('profile.title')} onBack={onBack} variant="blue" />
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Text style={styles.editButtonText}>{t('profile.edit')}</Text>
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
              <Text style={styles.label}>{t('profile.charges')} : </Text>
              <Text style={styles.value}>{charges}</Text>
            </View>

            {/* Rating */}
            <View style={styles.ratingRow}>
              <Text style={styles.label}>{t('profile.rating')} </Text>
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
              <Text style={styles.distanceLabel}>{t('profile.distanceCharges')}</Text>
              <View style={styles.switchContainer}>
                <Switch
                  value={distanceCharges}
                  onValueChange={setDistanceCharges}
                  trackColor={{ false: Colors.border, true: Colors.accent }}
                  thumbColor={Colors.white}
                />
                <Text style={styles.switchLabel}>{distanceCharges ? t('profile.on') : t('profile.off')}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <TextInput
            style={styles.descriptionInput}
            placeholder={t('profile.description')}
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
              {t('profile.image')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'video' && styles.tabActive]}
            onPress={() => setActiveTab('video')}
          >
            <Text style={[styles.tabText, activeTab === 'video' && styles.tabTextActive]}>
              {t('profile.video')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'review' && styles.tabActive]}
            onPress={() => setActiveTab('review')}
          >
            <Text style={[styles.tabText, activeTab === 'review' && styles.tabTextActive]}>
              {t('profile.review')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content Area */}
        <View style={styles.contentArea}>
          <Text style={styles.contentPlaceholder}>
            {activeTab === 'image' && t('profile.imagesPlaceholder')}
            {activeTab === 'video' && t('profile.videosPlaceholder')}
            {activeTab === 'review' && t('profile.reviewsPlaceholder')}
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
  headerContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  editButton: {
    position: 'absolute',
    top: 46, // Vertically centered with title text
    right: 0,
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: Colors.white,
    borderRadius: 8,
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editButtonText: {
    fontSize: 14,
    color: Colors.accent,
    fontWeight: '700',
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
