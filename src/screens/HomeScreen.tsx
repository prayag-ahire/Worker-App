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

interface HomeScreenProps {
  onSettingsPress?: () => void;
  onSchedulePress?: () => void;
  onOrdersPress?: () => void;
  onWorkItemPress?: (workId: string, status: string) => void;
}

type ViewMode = 'day' | 'week' | 'month';

interface WorkItem {
  id: string;
  clientName: string;
  time: string;
  status: 'Pending' | 'Confirmed' | 'Completed';
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onSettingsPress, onSchedulePress, onOrdersPress, onWorkItemPress }) => {
  const { t } = useLanguage();
  const userName = 'Prayag Ahire'; // TODO: Get from user profile
  const [showMenu, setShowMenu] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Sample data - Day view
  const todayWork: WorkItem[] = [
    { id: '1', clientName: 'Prayag', time: '2:00-3:00', status: 'Pending' },
  ];

  // Sample data - Week view
  const weekWork = [
    { day: 'Sunday', count: '0' },
    { day: 'Monday', count: '7' },
    { day: 'Tuesday', count: '2' },
    { day: 'Wednesday', count: '4' },
    { day: 'Thursday', count: '8' },
    { day: 'Friday', count: '5' },
    { day: 'Saturday', count: '0' },
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
    setShowMenu(false);
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
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
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
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    const monthName = months[selectedDate.getMonth()];
    return `Week ${weekNum}, ${monthName}`;
  };

  const formatMonth = () => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
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
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{t.greeting}, {userName}</Text>
        </View>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setShowMenu(!showMenu)}
        >
          <Text style={styles.menuDots}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* Dropdown Menu */}
      {showMenu && (
        <View style={styles.dropdown}>
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => {
              setShowMenu(false);
              if (onOrdersPress) {
                onOrdersPress();
              }
            }}
          >
            <Text style={styles.dropdownText}>{t.orders}</Text>
          </TouchableOpacity>
          <View style={styles.dropdownDivider} />
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => {
              setShowMenu(false);
              if (onSchedulePress) {
                onSchedulePress();
              }
            }}
          >
            <Text style={styles.dropdownText}>{t.schedule}</Text>
          </TouchableOpacity>
          <View style={styles.dropdownDivider} />
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={handleSettingsPress}
          >
            <Text style={styles.dropdownText}>{t.setting}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Overlay to close menu */}
      {showMenu && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
        />
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* View Mode Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, viewMode === 'day' && styles.tabActive]}
            onPress={handleDayTabClick}
          >
            <Text style={[styles.tabText, viewMode === 'day' && styles.tabTextActive]}>
              {t.day}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, viewMode === 'week' && styles.tabActive]}
            onPress={() => setViewMode('week')}
          >
            <Text style={[styles.tabText, viewMode === 'week' && styles.tabTextActive]}>
              {t.week}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, viewMode === 'month' && styles.tabActive]}
            onPress={() => setViewMode('month')}
          >
            <Text style={[styles.tabText, viewMode === 'month' && styles.tabTextActive]}>
              {t.month}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Date Navigation */}
        <View style={styles.dateNavigation}>
          <TouchableOpacity style={styles.navButton} onPress={handlePrevious}>
            <Text style={styles.navButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.dateText}>
            {viewMode === 'day' && formatDate()}
            {viewMode === 'week' && formatWeek()}
            {viewMode === 'month' && formatMonth()}
          </Text>
          <TouchableOpacity style={styles.navButton} onPress={handleNext}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 16,
    zIndex: 10,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textDark,
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuDots: {
    fontSize: 24,
    color: Colors.textDark,
  },
  dropdown: {
    position: 'absolute',
    top: 100,
    right: 24,
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    zIndex: 100,
    minWidth: 120,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  dropdownText: {
    fontSize: 15,
    color: Colors.textDark,
    fontWeight: '500',
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
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
    fontSize: 15,
    color: Colors.textMedium,
    fontWeight: '500',
  },
  tabTextActive: {
    color: Colors.textDark,
    fontWeight: '600',
  },
  dateNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingVertical: 12,
  },
  navButton: {
    padding: 8,
  },
  navButtonText: {
    fontSize: 20,
    color: Colors.textDark,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textDark,
  },
  workList: {
    marginBottom: 20,
  },
  workCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  workInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: 4,
  },
  workTime: {
    fontSize: 14,
    color: Colors.textMedium,
  },
  workStatus: {
    fontSize: 14,
    color: Colors.textMedium,
    fontWeight: '500',
  },
  weekList: {
    marginBottom: 20,
  },
  weekCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
  },
  weekDay: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.textDark,
  },
  weekCount: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textDark,
  },
  monthContainer: {
    marginBottom: 20,
  },
  monthHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  monthHeaderText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textMedium,
  },
  monthWeek: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  monthDay: {
    flex: 1,
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
    position: 'relative',
  },
  monthDayNumber: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textDark,
  },
  workCountBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: Colors.accent,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  workCountText: {
    fontSize: 10,
    color: Colors.white,
    fontWeight: '700',
  },
});

export default HomeScreen;
