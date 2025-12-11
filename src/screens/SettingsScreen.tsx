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
    { id: 1, title: t.userProfile, key: 'userProfile' },
    { id: 2, title: "Image's & Video's", key: 'images' },
    { id: 3, title: t.location, key: 'location' },
    { id: 4, title: t.appLanguage, key: 'appLanguage' },
    { id: 5, title: t.inviteFriend, key: 'inviteFriend' },
    { id: 6, title: t.tutorialVideos, key: 'tutorialVideos' },
    { id: 7, title: t.help, key: 'help' },
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
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <ScreenHeader title={t.settings} onBack={onBack} />
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
            title="LogOut →"
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
    backgroundColor: Colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  header: {
    marginBottom: 8,
  },
  settingsCard: {
    padding: 0,
    overflow: 'hidden',
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
