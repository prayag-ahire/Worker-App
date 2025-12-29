import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Switch,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { Colors } from '../styles/colors';
import { useLanguage } from '../contexts/LanguageContext';
import { ScreenHeader } from '../components';
import { getUserProfile, UserProfileResponse } from '../services/apiClient';
import { getAuthToken } from '../utils/storage';

interface UserProfileScreenProps {
  onBack?: () => void;
  onEdit?: () => void;
  onShowError?: (fromScreen: 'userProfile', message?: string) => void;
  shouldRefresh?: boolean; // Flag to indicate if data should be refreshed
}

const UserProfileScreen: React.FC<UserProfileScreenProps> = ({ onBack, onEdit, onShowError, shouldRefresh = false }) => {
  const { t } = useLanguage();
  const [profileData, setProfileData] = useState<UserProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [distanceCharges, setDistanceCharges] = useState(true);
  const [activeTab, setActiveTab] = useState<'image' | 'video' | 'review'>('image');
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  // Fetch user profile on mount or when shouldRefresh changes
  useEffect(() => {
    const fetchProfile = async () => {
      // Skip if already loaded and not forced to refresh
      if (hasLoadedOnce && !shouldRefresh) {
        console.log('Using cached profile data');
        return;
      }

      setIsLoading(true);
      try {
        const token = await getAuthToken();
        if (!token) {
          throw new Error('No authentication token found. Please login again.');
        }

        console.log('Fetching fresh profile data...');
        const data = await getUserProfile(token);
        setProfileData(data);
        setHasLoadedOnce(true);
        console.log('Fetched user profile:', data);
      } catch (error: any) {
        console.error('Error fetching profile:', error);
        
        // Show error screen instead of toast
        if (onShowError) {
          const errorMessage = error.message === 'No authentication token found. Please login again.'
            ? 'Your session has expired. Please login again.'
            : 'Unable to load your profile. Please check your internet connection and try again.';
          
          onShowError('userProfile', errorMessage);
        } else {
          // Fallback to toast if onShowError is not provided
          Toast.show({
            type: 'error',
            text1: 'Failed to Load Profile',
            text2: error.message || 'Could not fetch profile data',
            position: 'top',
            visibilityTime: 3000,
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [shouldRefresh]); // Only refetch when shouldRefresh changes

  const handleEdit = () => {
    // TODO: Navigate to edit profile screen
    if (onEdit) {
      onEdit();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.accent} translucent={true} />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.accent} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      ) : (
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

          {/* Profile Section - No Card */}
          <View>
            {/* Profile Header */}
            <View style={styles.profileHeader}>
              {/* Left: Profile Image */}
              <View style={styles.profileImage}>
                <Text style={styles.profileImageText}>📷</Text>
              </View>

              {/* Right: Details */}
              <View style={styles.detailsSection}>
                {/* Name */}
                <Text style={styles.nameText}>{profileData?.username || 'N/A'}</Text>

                {/* Visit Charge */}
                <View style={styles.infoRow}>
                  <Text style={styles.label}>{t('profile.visitCharge')} : </Text>
                  <Text style={styles.value}>₹{profileData?.Charges_PerVisit || 0}</Text>
                </View>

                {/* Rating */}
                <View style={styles.ratingRow}>
                  <Text style={styles.label}>{t('profile.rating')} </Text>
                  <View style={styles.stars}>
                    {[1, 2, 3, 4, 5].map((star) => {
                      const rating = parseFloat(profileData?.Rating || '0');
                      const isFilled = star <= rating;
                      return (
                        <Text 
                          key={star} 
                          style={[
                            styles.star,
                            isFilled ? styles.starFilled : styles.starEmpty
                          ]}
                        >
                          ★
                        </Text>
                      );
                    })}
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

            {/* Divider */}
            <View style={styles.divider} />

            {/* Description - In Card */}
            <View style={styles.descriptionCard}>
              <Text style={styles.descriptionLabel}>{t('profile.description')}</Text>
              <Text style={styles.descriptionText}>
                {profileData?.Description || t('profile.noDescription')}
              </Text>
            </View>
          </View>

          {/* Media Card - Combined */}
          <View style={styles.mediaCard}>
            {/* Tabs */}
            <View style={styles.tabsContainer}>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'image' && styles.tabActive]}
                onPress={() => setActiveTab('image')}
              >
                <Text style={[styles.tabText, activeTab === 'image' && styles.tabTextActive]}>
                  {t('profile.image')} ({profileData?.worker_image?.length || 0})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'video' && styles.tabActive]}
                onPress={() => setActiveTab('video')}
              >
                <Text style={[styles.tabText, activeTab === 'video' && styles.tabTextActive]}>
                  {t('profile.video')} ({profileData?.Worker_video?.length || 0})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'review' && styles.tabActive]}
                onPress={() => setActiveTab('review')}
              >
                <Text style={[styles.tabText, activeTab === 'review' && styles.tabTextActive]}>
                  {t('profile.review')} ({profileData?.review?.length || 0})
                </Text>
              </TouchableOpacity>
            </View>

            {/* Content Area */}
            <View style={styles.contentArea}>
              {activeTab === 'image' && (profileData?.worker_image?.length || 0) === 0 && (
                <Text style={styles.contentPlaceholder}>{t('profile.imagesPlaceholder')}</Text>
              )}
              {activeTab === 'video' && (profileData?.Worker_video?.length || 0) === 0 && (
                <Text style={styles.contentPlaceholder}>{t('profile.videosPlaceholder')}</Text>
              )}
              {activeTab === 'review' && (profileData?.review?.length || 0) === 0 && (
                <Text style={styles.contentPlaceholder}>{t('profile.reviewsPlaceholder')}</Text>
              )}
              {/* TODO: Display actual images, videos, and reviews when available */}
            </View>
          </View>
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
  profileCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  profileImage: {
    width: 100,              // Reduced width for vertical rectangle
    height: 160,             // Keep height
    borderRadius: 12,        // Square with rounded corners
    backgroundColor: Colors.backgroundAccent,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.accent,
  },
  profileImageText: {
    fontSize: 64,            // 2x icon size
  },
  detailsSection: {
    flex: 1,
    justifyContent: 'center',
  },
  nameText: {
    fontSize: 20,        // Increased from 18
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 15,        // Increased from 14
    color: Colors.textMedium,
    fontWeight: '500',
  },
  value: {
    fontSize: 18,        // Increased from 14 (charges - bigger!)
    color: Colors.accent,
    fontWeight: '700',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  star: {
    fontSize: 27,        // Increased to 1.5x (27px) - much bigger!
  },
  starFilled: {
    color: '#FFD700',    // Golden yellow for filled stars
  },
  starEmpty: {
    color: '#D1D5DB',    // Light gray for empty stars
  },
  distanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  distanceLabel: {
    fontSize: 15,        // Increased from 14
    fontWeight: '600',
    color: Colors.textDark,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  switchLabel: {
    fontSize: 14,        // Increased from 13
    fontWeight: '600',
    color: Colors.accent,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginBottom: 20,
  },
  descriptionCard: {
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
  descriptionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  descriptionText: {
    fontSize: 14,
    color: Colors.textDark,
    lineHeight: 22,
  },
  mediaCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  tabActive: {
    backgroundColor: Colors.white,
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  tabTextActive: {
    color: Colors.accent,
    fontWeight: '700',
  },
  contentArea: {
    minHeight: 300,
    paddingVertical: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentPlaceholder: {
    fontSize: 14,
    color: Colors.textLight,
    fontWeight: '500',
  },
});

export default UserProfileScreen;
