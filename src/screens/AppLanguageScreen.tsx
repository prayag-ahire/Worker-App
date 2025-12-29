import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { Colors } from '../styles/colors';
import { useLanguage } from '../contexts/LanguageContext';
import { ScreenHeader, TextInputField, Card } from '../components';
import { getUserLanguage, updateUserLanguage } from '../services/apiClient';
import { getAuthToken } from '../utils/storage';

interface AppLanguageScreenProps {
  onBack?: () => void;
  onComplete?: () => void;
  onShowError?: (fromScreen: 'appLanguage', message?: string) => void;
}

const AppLanguageScreen: React.FC<AppLanguageScreenProps> = ({ onBack, onComplete, onShowError }) => {
  const { language, changeLanguage } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(language);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Only show implemented languages
  const languages = [
    { id: 1, code: 'en', name: 'English', nativeName: 'English' },
    { id: 2, code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
    // Add more as you implement them:
    // { id: 3, code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
    // { id: 4, code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  ];

  // Fetch user's current language on mount (skip during signup flow)
  useEffect(() => {
    const fetchUserLanguage = async () => {
      // Skip fetching if this is part of signup flow (onComplete exists)
      if (onComplete) {
        console.log('Signup flow detected, skipping language fetch');
        setIsFetching(false);
        return;
      }

      try {
        const token = await getAuthToken();
        if (!token) {
          console.log('No auth token, using default language');
          setIsFetching(false);
          return;
        }

        const response = await getUserLanguage(token);
        const apiLanguage = response.AppLanguage;
        
        // Map API language to language code
        const languageCode = apiLanguage === 'Hindi' ? 'hi' : 'en';
        setSelectedLanguage(languageCode);
        await changeLanguage(languageCode as 'en' | 'hi');
        
        console.log('Fetched user language:', apiLanguage);
      } catch (error: any) {
        console.error('Error fetching language:', error);
        
        // Show error screen for critical errors during settings flow
        if (!onComplete && onShowError) {
          const errorMessage = error.message === 'No authentication token found. Please login again.'
            ? 'Your session has expired. Please login again.'
            : 'Unable to load language settings. Please check your internet connection and try again.';
          
          onShowError('appLanguage', errorMessage);
        }
        // Don't show error during signup flow, just use default
      } finally {
        setIsFetching(false);
      }
    };

    fetchUserLanguage();
  }, [onComplete]);

  const filteredLanguages = languages.filter(lang =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLanguageSelect = async (languageCode: string) => {
    // Update UI immediately for better UX
    setSelectedLanguage(languageCode);
    await changeLanguage(languageCode as 'en' | 'hi');

    // If in settings (no onComplete), update API immediately
    if (!onComplete) {
      setIsLoading(true);
      try {
        const token = await getAuthToken();
        if (!token) {
          throw new Error('No authentication token found. Please login again.');
        }

        // Map language code to API language name
        const apiLanguage = languageCode === 'hi' ? 'Hindi' : 'English';
        await updateUserLanguage(token, apiLanguage);

        Toast.show({
          type: 'success',
          text1: 'Language Updated',
          text2: `App language changed to ${apiLanguage}`,
          position: 'top',
          visibilityTime: 2000,
        });
      } catch (error: any) {
        console.error('Error updating language:', error);
        
        // Show error screen instead of toast if onShowError is provided
        if (onShowError) {
          const errorMessage = error.message === 'No authentication token found. Please login again.'
            ? 'Your session has expired. Please login again.'
            : 'Unable to update language. Please check your internet connection and try again.';
          
          onShowError('appLanguage', errorMessage);
        } else {
          Toast.show({
            type: 'error',
            text1: 'Update Failed',
            text2: error.message || 'Failed to update language',
            position: 'top',
            visibilityTime: 3000,
          });
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleContinue = async () => {
    if (!onComplete) return;

    // During signup flow, just continue without API call
    // User's language will be saved when they complete their profile
    console.log('Language selected during signup:', selectedLanguage);
    onComplete();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.accent} translucent={true} />

      {isFetching ? (
        <View style={styles.fullScreenLoadingContainer}>
          <ActivityIndicator size="large" color={Colors.accent} />
          <Text style={styles.loadingText}>Loading language settings...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <ScreenHeader 
            title="App Language" 
            onBack={onBack} 
            showBackButton={!onComplete}
            variant="blue" 
          />

          {/* Language List Container */}
          <Card style={styles.languageCard}>
            {/* Search */}
            <TextInputField
              placeholder="Search"
              value={searchQuery}
              onChangeText={setSearchQuery}
              containerStyle={styles.searchContainer}
              editable={!isLoading}
            />

            {/* Language List */}
            <View style={styles.languageList}>
              {filteredLanguages.map((language, index) => (
                <TouchableOpacity
                  key={language.id}
                  style={[
                    styles.languageItem,
                    index === filteredLanguages.length - 1 && styles.lastLanguageItem
                  ]}
                  onPress={() => handleLanguageSelect(language.code)}
                  activeOpacity={0.7}
                  disabled={isLoading}
                >
                  <View style={styles.languageInfo}>
                    <Text style={styles.languageName}>{language.name}</Text>
                    <Text style={styles.nativeName}>{language.nativeName}</Text>
                  </View>
                  {selectedLanguage === language.code && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          {/* Continue Button - Only show during signup flow */}
          {onComplete && (
            <TouchableOpacity 
              style={[styles.continueButton, isLoading && styles.continueButtonDisabled]}
              onPress={handleContinue}
              activeOpacity={0.9}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.white} size="small" />
              ) : (
                <Text style={styles.continueButtonText}>Continue</Text>
              )}
            </TouchableOpacity>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  fullScreenLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  languageCard: {
    padding: 16,
  },
  searchContainer: {
    marginBottom: 16,
  },
  languageList: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  lastLanguageItem: {
    borderBottomWidth: 0,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: 4,
  },
  nativeName: {
    fontSize: 14,
    color: Colors.textMedium,
  },
  checkmark: {
    fontSize: 24,
    color: Colors.accent,
    fontWeight: '700',
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.textMedium,
  },
  continueButton: {
    marginTop: 24,
    marginBottom: 16,
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
  continueButtonDisabled: {
    opacity: 0.6,
  },
  continueButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 0.5,
  },
});

export default AppLanguageScreen;
