import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Colors } from '../styles/colors';
import { useLanguage } from '../contexts/LanguageContext';
import BottomNavigation from '../components/BottomNavigation';

interface HomeScreenProps {
  onSettingsPress?: () => void;
  onSchedulePress?: () => void;
  onOrdersPress?: () => void;
  onWorkItemPress?: (workId: string, status: string) => void;
  onHomePress?: () => void;
}

type ViewMode = 'day' | 'week' | 'month';

interface WorkItem {
  id: string;
  clientName: string;
  time: string;
  status: 'Pending' | 'Confirmed' | 'Completed';
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onSettingsPress, onSchedulePress, onOrdersPress, onWorkItemPress, onHomePress }) => {
  const { t } = useLanguage();
  const userName = 'Prayag Ahire'; // TODO: Get from user profile
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'home' | 'orders' | 'schedule' | 'profile'>('home');

  // Sample data - Day view
  const todayWork: WorkItem[] = [
    { id: '1', clientName: 'Prayag', time: '2:00-3:00', status: 'Pending' },
  ];

  // Sample data - Week view
  const weekWork = [
    { day: t('calendar.sunday'), count: '0' },
    { day: t('calendar.monday'), count: '7' },
    { day: t('calendar.tuesday'), count: '2' },
    { day: t('calendar.wednesday'), count: '4' },
    { day: t('calendar.thursday'), count: '8' },
    { day: t('calendar.friday'), count: '5' },
    { day: t('calendar.saturday'), count: '0' },
  ];

  // Sample data - Month view (calendar grid)
  const monthWork = [
    [null, null, null, null, 1, 2, 3],
    [4, 5, 6, 7, 8, 9, 10],
    [11, 12, 13, 14, 15, 16, 17],
    [18, 19, 20, 21, 22, 23, 24],
    [25, 26, 27, 28, 29, 30, null],
  ];

  // Work count per day for month view
  const monthWorkCount: { [key: number]: number } = {
    1: 3, 5: 2, 8: 5, 12: 1, 15: 4, 18: 6, 22: 3, 25: 2, 28: 7,
  };

  const handleSettingsPress = () => {
    if (onSettingsPress) {
      onSettingsPress();
    }
  };

  const handlePrevious = () => {
    const newDate = new Date(selectedDate);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setSelectedDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(selectedDate);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setSelectedDate(newDate);
  };

  const formatDate = () => {
    const day = selectedDate.getDate();
    const days = [
      t('calendar.sunday'),
      t('calendar.monday'),
      t('calendar.tuesday'),
      t('calendar.wednesday'),
      t('calendar.thursday'),
      t('calendar.friday'),
      t('calendar.saturday')
    ];
    const dayName = days[selectedDate.getDay()];
    return `${day}, ${dayName}`;
  };

  const getWeekNumber = (date: Date) => {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const dayOfMonth = date.getDate();
    const dayOfWeek = firstDayOfMonth.getDay();
    return Math.ceil((dayOfMonth + dayOfWeek) / 7);
  };

  const formatWeek = () => {
    const weekNum = getWeekNumber(selectedDate);
    const months = [
      t('calendar.january'),
      t('calendar.february'),
      t('calendar.march'),
      t('calendar.april'),
      t('calendar.may'),
      t('calendar.june'),
      t('calendar.july'),
      t('calendar.august'),
      t('calendar.september'),
      t('calendar.october'),
      t('calendar.november'),
      t('calendar.december')
    ];
    const monthName = months[selectedDate.getMonth()];
    return `${t('calendar.week')} ${weekNum}, ${monthName}`;
  };

  const formatMonth = () => {
    const months = [
      t('calendar.january'),
      t('calendar.february'),
      t('calendar.march'),
      t('calendar.april'),
      t('calendar.may'),
      t('calendar.june'),
      t('calendar.july'),
      t('calendar.august'),
      t('calendar.september'),
      t('calendar.october'),
      t('calendar.november'),
      t('calendar.december')
    ];
    const monthName = months[selectedDate.getMonth()];
    const year = selectedDate.getFullYear();
    return `${monthName} ${year}`;
  };

  const generateMonthCalendar = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    const calendar: (number | null)[][] = [];
    let week: (number | null)[] = [];
    
    // Fill empty days before month starts
    for (let i = 0; i < firstDayOfWeek; i++) {
      week.push(null);
    }
    
    // Fill days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      week.push(day);
      if (week.length === 7) {
        calendar.push(week);
        week = [];
      }
    }
    
    // Fill remaining days
    if (week.length > 0) {
      while (week.length < 7) {
        week.push(null);
      }
      calendar.push(week);
    }
    
    return calendar;
  };

  const handleWeekDayClick = (dayIndex: number) => {
    // dayIndex: 0 = Sunday, 1 = Monday, etc.
    const currentDayOfWeek = selectedDate.getDay();
    const daysToAdd = dayIndex - currentDayOfWeek;
    
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + daysToAdd);
    
    setSelectedDate(newDate);
    setViewMode('day');
  };

  const handleMonthDayClick = (day: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(day);
    
    setSelectedDate(newDate);
    setViewMode('day');
  };

  const handleDayTabClick = () => {
    setSelectedDate(new Date()); // Reset to today
    setViewMode('day');
  };

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={Colors.accent} 
        translucent={true} 
      />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>{t('home.greeting')}, {userName}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* View Mode Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, viewMode === 'day' && styles.tabActive]}
            onPress={handleDayTabClick}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, viewMode === 'day' && styles.tabTextActive]}>
              {t('home.day')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, viewMode === 'week' && styles.tabActive]}
            onPress={() => setViewMode('week')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, viewMode === 'week' && styles.tabTextActive]}>
              {t('home.week')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, viewMode === 'month' && styles.tabActive]}
            onPress={() => setViewMode('month')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, viewMode === 'month' && styles.tabTextActive]}>
              {t('home.month')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Date Navigation */}
        <View style={styles.dateNavigation}>
          <TouchableOpacity 
            style={styles.navButton} 
            onPress={handlePrevious}
            activeOpacity={0.6}
          >
            <Text style={styles.navButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.dateText}>
            {viewMode === 'day' && formatDate()}
            {viewMode === 'week' && formatWeek()}
            {viewMode === 'month' && formatMonth()}
          </Text>
          <TouchableOpacity 
            style={styles.navButton} 
            onPress={handleNext}
            activeOpacity={0.6}
          >
            <Text style={styles.navButtonText}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Day View */}
        {viewMode === 'day' && (
          <View style={styles.workList}>
            {todayWork.map((work) => (
              <TouchableOpacity
                key={work.id}
                style={styles.workCard}
                onPress={() => onWorkItemPress && onWorkItemPress(work.id, work.status)}
                activeOpacity={0.7}
              >
                <View style={styles.workInfo}>
                  <Text style={styles.clientName}>{work.clientName}</Text>
                  <Text style={styles.workTime}>{work.time}</Text>
                </View>
                <Text style={styles.workStatus}>{work.status}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Week View */}
        {viewMode === 'week' && (
          <View style={styles.weekList}>
            {weekWork.map((item, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.weekCard}
                onPress={() => handleWeekDayClick(index)}
                activeOpacity={0.7}
              >
                <Text style={styles.weekDay}>{item.day}</Text>
                <Text style={styles.weekCount}>{item.count}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Month View */}
        {viewMode === 'month' && (
          <View style={styles.monthContainer}>
            {/* Day Headers */}
            <View style={styles.monthHeader}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                <Text key={index} style={styles.monthHeaderText}>{day}</Text>
              ))}
            </View>
            
            {/* Calendar Grid */}
            {generateMonthCalendar().map((week, weekIndex) => (
              <View key={weekIndex} style={styles.monthWeek}>
                {week.map((day, dayIndex) => (
                  <TouchableOpacity 
                    key={dayIndex} 
                    style={styles.monthDay}
                    onPress={() => day !== null && handleMonthDayClick(day)}
                    disabled={day === null}
                    activeOpacity={0.7}
                  >
                    {day !== null && (
                      <>
                        <Text style={styles.monthDayNumber}>{day}</Text>
                        {monthWorkCount[day] && (
                          <View style={styles.workCountBadge}>
                            <Text style={styles.workCountText}>{monthWorkCount[day]}</Text>
                          </View>
                        )}
                      </>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <BottomNavigation
        activeTab="home"
        onHomePress={onHomePress}
        onOrdersPress={onOrdersPress}
        onSchedulePress={onSchedulePress}
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
    zIndex: 10,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: -0.3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  tabActive: {
    backgroundColor: Colors.white, // White active tab
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  tabTextActive: {
    color: Colors.accent, // Sky blue for active text (20%)
    fontWeight: '700',
  },
  dateNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: Colors.backgroundAccent, // Light blue background (10%)
    borderRadius: 12,
  },
  navButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: Colors.white,
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  navButtonText: {
    fontSize: 24,
    color: Colors.accent, // Sky blue arrows (20%)
    fontWeight: '700',
    textAlign: 'center',
    marginTop: -2, // Adjust for vertical centering
  },
  dateText: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.2,
  },
  workList: {
    marginBottom: 20,
  },
  workCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16, // More rounded for modern look
    padding: 24, // Increased padding
    marginBottom: 16, // More spacing between cards
    marginHorizontal: 4, // Slight horizontal margin for shadow visibility
    // Modern shadow effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    // Removed border for cleaner look
  },
  workInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  workTime: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  workStatus: {
    fontSize: 13,
    color: Colors.accent,
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.backgroundAccent,
    borderRadius: 12, // More rounded
  },
  weekList: {
    marginBottom: 20,
  },
  weekCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16, // More rounded
    padding: 20,
    marginBottom: 12,
    marginHorizontal: 4, // Slight horizontal margin for shadow visibility
    // Modern shadow effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  weekDay: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  weekCount: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.accent, // Sky blue count (20%)
    minWidth: 32,
    height: 32,
    textAlign: 'center',
    lineHeight: 32,
    backgroundColor: Colors.backgroundAccent, // Light blue background (10%)
    borderRadius: 16,
    paddingHorizontal: 8,
  },
  monthContainer: {
    marginBottom: 20,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  monthHeader: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  monthHeaderText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },
  monthWeek: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  monthDay: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: Colors.white, // Changed to white for better shadow visibility
    borderRadius: 12, // More rounded for modern look
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 3, // Slightly more margin for shadow visibility
    marginVertical: 2,
    position: 'relative',
    // Modern shadow effect
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2, // Android shadow
  },
  monthDayNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  workCountBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Colors.accent, // Sky blue badge (20%)
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  workCountText: {
    fontSize: 10,
    color: Colors.white,
    fontWeight: '700',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  iconContainerActive: {
    backgroundColor: Colors.accent,
  },
  navIcon: {
    fontSize: 22,
    color: Colors.textSecondary,
    fontWeight: '400',
  },
  navIconActive: {
    fontSize: 22,
    color: Colors.white,
    fontWeight: '400',
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
    textAlign: 'center',
    letterSpacing: -0.1,
  },
  navLabelActive: {
    color: Colors.accent,
    fontWeight: '700',
  },
});

export default HomeScreen;
