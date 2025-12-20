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
import { useLanguage } from '../contexts/LanguageContext';
import BottomNavigation from '../components/BottomNavigation';

interface ScheduleMainScreenProps {
  onBack?: () => void;
  onNavigate?: (screen: 'weekly' | 'monthly') => void;
  onHomePress?: () => void;
  onOrdersPress?: () => void;
  onSettingsPress?: () => void;
}

const ScheduleMainScreen: React.FC<ScheduleMainScreenProps> = ({ onBack, onNavigate, onHomePress, onOrdersPress, onSettingsPress }) => {
  const { t } = useLanguage();
  
  const scheduleOptions = [
    { id: 1, title: t('schedule.weeklySchedule'), key: 'weekly' as const },
    { id: 2, title: t('schedule.monthlySchedule'), key: 'monthly' as const },
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
        <View style={styles.optionsList}>
          {scheduleOptions.map((option, index) => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionCard}
              onPress={() => onNavigate && onNavigate(option.key)}
              activeOpacity={0.7}
            >
              <View style={styles.optionIcon}>
                <View style={styles.calendarIcon}>
                  <View style={styles.calendarTop} />
                  <View style={styles.calendarBody}>
                    <View style={styles.calendarDot} />
                    <View style={styles.calendarDot} />
                    <View style={styles.calendarDot} />
                  </View>
                </View>
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionText}>{option.title}</Text>
              </View>
              <View style={styles.arrowContainer}>
                <Text style={styles.arrow}>›</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <BottomNavigation
        activeTab="schedule"
        onHomePress={onHomePress}
        onOrdersPress={onOrdersPress}
        onSchedulePress={undefined}
        onProfilePress={onSettingsPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundPrimary,
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
    paddingTop: 20,
    paddingBottom: 20,
  },
  optionsList: {
    gap: 16,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.backgroundAccent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  calendarIcon: {
    width: 22,
    height: 22,
  },
  calendarTop: {
    width: 22,
    height: 4,
    backgroundColor: Colors.accent,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  calendarBody: {
    width: 22,
    height: 18,
    borderWidth: 2,
    borderColor: Colors.accent,
    borderTopWidth: 0,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  calendarDot: {
    width: 3,
    height: 3,
    backgroundColor: Colors.accent,
    borderRadius: 1.5,
  },
  optionInfo: {
    flex: 1,
  },
  optionText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  arrow: {
    fontSize: 40,
    color: Colors.accent,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default ScheduleMainScreen;
