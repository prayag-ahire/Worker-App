import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Colors } from '../styles/colors';
import { useLanguage } from '../contexts/LanguageContext';
import { ScreenHeader, ListItem, Card } from '../components';

interface SettingsScreenProps {
  onBack?: () => void;
  onNavigate?: (screen: string) => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack, onNavigate }) => {
  const { t } = useLanguage();
  
  const settingsOptions = [
    { id: 1, title: t('settings.userProfile'), key: 'userProfile' },
    { id: 2, title: t('settings.imagesVideos'), key: 'images' },
    { id: 3, title: t('settings.location'), key: 'location' },
    { id: 4, title: t('settings.appLanguage'), key: 'appLanguage' },
    { id: 5, title: t('settings.inviteFriend'), key: 'inviteFriend' },
    { id: 6, title: t('settings.tutorialVideos'), key: 'tutorialVideos' },
    { id: 7, title: t('settings.help'), key: 'help' },
  ];

  const handleOptionPress = (key: string) => {
    console.log(`${key} pressed`);
    if (onNavigate) {
      onNavigate(key);
    }
  };

  const handleLogout = () => {
    console.log('Logout pressed');
    if (onNavigate) {
      onNavigate('Login');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.accent} translucent={true} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <ScreenHeader 
            title={t('settings.settings')} 
            onBack={onBack}
            variant="blue"
          />
        </View>

        {/* Settings Options */}
        <Card style={styles.settingsCard}>
          {settingsOptions.map((option, index) => (
            <ListItem
              key={option.id}
              title={option.title}
              onPress={() => handleOptionPress(option.key)}
              style={index === settingsOptions.length - 1 ? styles.lastItem : undefined}
            />
          ))}

          {/* Logout Option */}
          <ListItem
            title={t('settings.logout')}
            onPress={handleLogout}
            showArrow={false}
            textStyle={styles.logoutText}
            style={styles.logoutItem}
          />
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white, // Clean white background
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  header: {
    marginBottom: 16,
  },
  settingsCard: {
    padding: 0,
    overflow: 'hidden',
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  lastItem: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#FF0000',
  },
});

export default SettingsScreen;
