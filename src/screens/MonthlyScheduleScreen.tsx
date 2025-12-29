import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { Colors } from '../styles/colors';
import { useLanguage } from '../contexts/LanguageContext';
import { ScreenHeader } from '../components';
import { getMonthlySchedule, addHoliday, deleteHoliday, Holiday } from '../services/apiClient';
import { getAuthToken } from '../utils/storage';

interface MonthlyScheduleScreenProps {
  onBack?: () => void;
}

const MonthlyScheduleScreen: React.FC<MonthlyScheduleScreenProps> = ({ onBack }) => {
  const { t } = useLanguage();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [leaveReason, setLeaveReason] = useState('');

  // Fetch holidays when month changes
  useEffect(() => {
    fetchMonthlySchedule();
  }, [selectedDate]);

  const fetchMonthlySchedule = async () => {
    try {
      setLoading(true);
      const token = await getAuthToken();
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      const year = selectedDate.getFullYear();
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
      const monthString = `${year}-${month}`;

      const data = await getMonthlySchedule(token, monthString);
      setHolidays(data.holidays || []);
    } catch (error: any) {
      console.error('Failed to fetch monthly schedule:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to load schedule',
        position: 'top',
      });
    } finally {
      setLoading(false);
    }
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
    return `${monthName.slice(0, 3)}, ${year}`;
  };

  const handlePrevious = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setSelectedDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setSelectedDate(newDate);
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

    for (let i = 0; i < firstDayOfWeek; i++) {
      week.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      week.push(day);
      if (week.length === 7) {
        calendar.push(week);
        week = [];
      }
    }

    if (week.length > 0) {
      while (week.length < 7) {
        week.push(null);
      }
      calendar.push(week);
    }

    console.log('Generated calendar for', selectedDate.getMonth() + 1, selectedDate.getFullYear(), ':', calendar);
    return calendar;
  };

  const getDateKey = (day: number) => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  };

  const isHoliday = (day: number | null) => {
    if (day === null) return false;
    const dateKey = getDateKey(day);
    return holidays.some(holiday => {
      const holidayDate = new Date(holiday.date);
      const holidayKey = `${holidayDate.getFullYear()}-${(holidayDate.getMonth() + 1).toString().padStart(2, '0')}-${holidayDate.getDate().toString().padStart(2, '0')}`;
      return holidayKey === dateKey;
    });
  };

  const getHolidayNote = (day: number): string => {
    const dateKey = getDateKey(day);
    const holiday = holidays.find(h => {
      const holidayDate = new Date(h.date);
      const holidayKey = `${holidayDate.getFullYear()}-${(holidayDate.getMonth() + 1).toString().padStart(2, '0')}-${holidayDate.getDate().toString().padStart(2, '0')}`;
      return holidayKey === dateKey;
    });
    return holiday?.note || '';
  };

  const isPastDate = (day: number | null): boolean => {
    if (day === null) return false;
    
    // Create a fresh current date for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const dateToCheck = new Date(year, month, day);
    dateToCheck.setHours(0, 0, 0, 0);
    
    return dateToCheck < today;
  };

  const handleDayPress = (day: number | null) => {
    if (day === null) return;
    
    // Prevent clicking on past dates
    if (isPastDate(day)) {
      return;
    }

    setSelectedDay(day);
    setLeaveReason(getHolidayNote(day));
    setShowLeaveModal(true);
  };

  const handleUpdateLeave = async () => {
    if (selectedDay === null) return;

    if (!leaveReason.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a reason for the holiday',
        position: 'top',
      });
      return;
    }

    try {
      setLoading(true);
      const token = await getAuthToken();
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      const dateKey = getDateKey(selectedDay);
      
      const response = await addHoliday(token, {
        date: dateKey,
        note: leaveReason.trim(),
      });

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: response.message || 'Holiday added successfully',
        position: 'top',
      });

      // Refresh the schedule
      await fetchMonthlySchedule();
      
      setShowLeaveModal(false);
      setLeaveReason('');
      setSelectedDay(null);
    } catch (error: any) {
      console.error('Failed to add holiday:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to add holiday',
        position: 'top',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelLeave = async () => {
    if (selectedDay === null) return;

    try {
      setLoading(true);
      const token = await getAuthToken();
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      const dateKey = getDateKey(selectedDay);
      
      const response = await deleteHoliday(token, dateKey);

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: response.message || 'Holiday removed successfully',
        position: 'top',
      });

      // Refresh the schedule
      await fetchMonthlySchedule();
      
      setShowLeaveModal(false);
      setLeaveReason('');
      setSelectedDay(null);
    } catch (error: any) {
      console.error('Failed to delete holiday:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to remove holiday',
        position: 'top',
      });
    } finally {
      setLoading(false);
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
        <ScreenHeader title={t('monthlySchedule.title')} onBack={onBack} variant="blue" />

        {/* Month Navigation */}
        <View style={styles.monthNavigation}>
          <TouchableOpacity style={styles.navButton} onPress={handlePrevious}>
            <Text style={styles.navButtonText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.monthText}>{formatMonth()}</Text>
          <TouchableOpacity style={styles.navButton} onPress={handleNext}>
            <Text style={styles.navButtonText}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Calendar */}
        <View 
          key={`calendar-${selectedDate.getMonth()}-${selectedDate.getFullYear()}-${holidays.map(h => h.id).join('-')}`}
          style={styles.calendarContainer}
        >
          {/* Day Headers */}
          <View style={styles.weekHeader}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <Text key={`header-${index}`} style={styles.weekHeaderText}>{day}</Text>
            ))}
          </View>

          {/* Calendar Grid */}
          {generateMonthCalendar().map((week, weekIndex) => (
            <View key={`week-${weekIndex}`} style={styles.week}>
              {week.map((day, dayIndex) => {
                if (day === null) {
                  // Empty cell - just a transparent placeholder
                  return <View key={`empty-${weekIndex}-${dayIndex}`} style={styles.emptyDay} />;
                }
                
                const isHolidayDay = isHoliday(day);
                const isPast = isPastDate(day);
                
                return (
                  <TouchableOpacity
                    key={`day-${weekIndex}-${dayIndex}-${day}`}
                    style={[
                      styles.day,
                      isHolidayDay && styles.leaveDay,
                      isPast && styles.pastDay,
                    ]}
                    onPress={() => handleDayPress(day)}
                    disabled={isPast}
                  >
                    <Text style={[
                      styles.dayNumber,
                      isHolidayDay && styles.leaveDayNumber,
                      isPast && styles.pastDayNumber,
                    ]}>
                      {day}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.accent} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}

      {/* Leave Modal */}
      <Modal
        visible={showLeaveModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLeaveModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedDay && isHoliday(selectedDay) ? t('monthlySchedule.editLeave') : t('monthlySchedule.addLeave')}
            </Text>
            <Text style={styles.modalDate}>
              {t('monthlySchedule.date')}: {selectedDay} {formatMonth()}
            </Text>

            <TextInput
              style={styles.reasonInput}
              placeholder={t('monthlySchedule.enterReason')}
              placeholderTextColor={Colors.textLight}
              value={leaveReason}
              onChangeText={setLeaveReason}
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.updateButton}
                onPress={handleUpdateLeave}
              >
                <Text style={styles.updateButtonText}>{t('monthlySchedule.update')}</Text>
              </TouchableOpacity>

              {selectedDay && isHoliday(selectedDay) && (
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCancelLeave}
                >
                  <Text style={styles.cancelButtonText}>{t('monthlySchedule.cancelLeave')}</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setShowLeaveModal(false);
                  setLeaveReason('');
                  setSelectedDay(null);
                }}
              >
                <Text style={styles.closeButtonText}>{t('monthlySchedule.close')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Toast />
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
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.textMedium,
    fontWeight: '500',
  },
  monthNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: Colors.backgroundAccent, // Light blue background
    borderRadius: 12,
  },
  navButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  navButtonText: {
    fontSize: 40,
    color: Colors.accent,
    fontWeight: '700',
    textAlign: 'center',
  },
  monthText: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.2,
  },
  calendarContainer: {
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
  weekHeader: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  weekHeaderText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },
  week: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  day: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: Colors.white,
    borderRadius: 12, // More rounded for modern look
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 3, // Slightly more margin for shadow visibility
    marginVertical: 2,
    position: 'relative',
    overflow: 'hidden', // Ensures shadow respects rounded corners
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
  emptyDay: {
    flex: 1,
    aspectRatio: 1,
  },
  leaveDay: {
    backgroundColor: '#ffebee', // Softer red background
    borderWidth: 2,
    borderColor: '#ef5350', // Modern red border
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  leaveDayNumber: {
    color: '#d32f2f', // Darker red for better contrast
    fontWeight: '700',
  },
  pastDay: {
    backgroundColor: '#e0e0e0', // Solid grey background for past dates (more visible)
  },
  pastDayNumber: {
    color: '#9e9e9e', // Grey text for past dates
    fontWeight: '400',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: 8,
  },
  modalDate: {
    fontSize: 14,
    color: Colors.textMedium,
    marginBottom: 20,
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.textDark,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  modalButtons: {
    gap: 12,
  },
  updateButton: {
    backgroundColor: Colors.accent,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  updateButtonText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#ff6666',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: '600',
  },
  closeButton: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: Colors.textDark,
    fontWeight: '600',
  },
});

export default MonthlyScheduleScreen;
