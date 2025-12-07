import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Colors } from '../styles/colors';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../utils/translations';
import { ScreenHeader, TextInputField, Card } from '../components';

interface AppLanguageScreenProps {
  onBack?: () => void;
}

const AppLanguageScreen: React.FC<AppLanguageScreenProps> = ({ onBack }) => {
  const { language, setLanguage } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(language);
  const [searchQuery, setSearchQuery] = useState('');

  const languages = [
    { id: 1, name: 'English', nativeName: 'English' },
    { id: 2, name: 'Hindi', nativeName: 'हिंदी' },
    { id: 3, name: 'Gujarati', nativeName: 'ગુજરાતી' },
    { id: 4, name: 'Marathi', nativeName: 'मराठी' },
    { id: 5, name: 'Bengali', nativeName: 'বাংলা' },
    { id: 6, name: 'Tamil', nativeName: 'தமிழ்' },
    { id: 7, name: 'Telugu', nativeName: 'తెలుగు' },
    { id: 8, name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { id: 9, name: 'Malayalam', nativeName: 'മലയാളം' },
    { id: 10, name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
    { id: 11, name: 'Urdu', nativeName: 'اردو' },
  ];

  const filteredLanguages = languages.filter(lang =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLanguageSelect = (languageName: string) => {
    setSelectedLanguage(languageName);
    setLanguage(languageName as Language);
    console.log('Language selected:', languageName);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <ScreenHeader title="App Language" onBack={onBack} />

        {/* Language List Container */}
        <Card style={styles.languageCard}>
          {/* Search */}
          <TextInputField
            placeholder="Search"
            value={searchQuery}
            onChangeText={setSearchQuery}
            containerStyle={styles.searchContainer}
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
                onPress={() => handleLanguageSelect(language.name)}
                activeOpacity={0.7}
              >
                <View style={styles.languageInfo}>
                  <Text style={styles.languageName}>{language.name}</Text>
                  <Text style={styles.nativeName}>{language.nativeName}</Text>
                </View>
                {selectedLanguage === language.name && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Card>
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
});

export default AppLanguageScreen;
