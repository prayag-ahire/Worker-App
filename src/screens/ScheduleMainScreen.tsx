import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Colors } from '../styles/colors';
import { Card } from '../components';
import { useLanguage } from '../contexts/LanguageContext';
import BottomNavigation from '../components/BottomNavigation';

interface ScheduleMainScreenProps {
  onBack?: () => void;
  onNavigate?: (screen: string) => void;
  onHomePress?: () => void;
  onOrdersPress?: () => void;
  onSettingsPress?: () => void;
}

const ScheduleMainScreen: React.FC<ScheduleMainScreenProps> = ({ onBack, onNavigate, onHomePress, onOrdersPress, onSettingsPress }) => {
  const { t } = useLanguage();
  
  const scheduleOptions = [
    { id: 1, title: t('schedule.weeklySchedule'), icon: '📅', key: 'weekly' },
    { id: 2, title: t('schedule.monthlySchedule'), icon: '🗓️', key: 'monthly' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.accent} translucent={true} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('schedule.title')}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Schedule Options */}
        <Card style={styles.optionsCard}>
          {scheduleOptions.map((option, index) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionItem,
                index === scheduleOptions.length - 1 && styles.lastOption
              ]}
              onPress={() => onNavigate && onNavigate(option.key)}
              activeOpacity={0.7}
            >
              <Text style={styles.optionIcon}>{option.icon}</Text>
              <Text style={styles.optionText}>{option.title}</Text>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          ))}
        </Card>
      </ScrollView>

      <BottomNavigation
        activeTab="schedule"
        onHomePress={onHomePress}
        onOrdersPress={onOrdersPress}
        onSchedulePress={onBack}
        onProfilePress={onSettingsPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: Colors.accent,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: -0.3,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  optionsCard: {
    padding: 0,
    overflow: 'hidden',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  lastOption: {
    borderBottomWidth: 0,
  },
  optionIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textDark,
  },
  arrow: {
    fontSize: 24,
    color: Colors.textLight,
    fontWeight: '300',
  },
});

export default ScheduleMainScreen;
