import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  TextInput,
  Modal,
} from 'react-native';
import { Colors } from '../styles/colors';
import { useLanguage } from '../contexts/LanguageContext';
import { ScreenHeader } from '../components';

interface MonthlyScheduleScreenProps {
  onBack?: () => void;
}

interface LeaveData {
  [key: string]: string; // date as key, reason as value
}

const MonthlyScheduleScreen: React.FC<MonthlyScheduleScreenProps> = ({ onBack }) => {
  const { t } = useLanguage();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [leaves, setLeaves] = useState<LeaveData>({
    '2025-10-12': 'Personal work',
    '2025-10-16': 'Family function',
    '2025-10-22': 'Medical appointment',
  });
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [leaveReason, setLeaveReason] = useState('');

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

    return calendar;
  };

  const getDateKey = (day: number) => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  };

  const isLeaveDay = (day: number | null) => {
    if (day === null) return false;
    return leaves[getDateKey(day)] !== undefined;
  };

  const handleDayPress = (day: number | null) => {
    if (day === null) return;
    setSelectedDay(day);
    const dateKey = getDateKey(day);
    setLeaveReason(leaves[dateKey] || '');
    setShowLeaveModal(true);
  };

  const handleUpdateLeave = () => {
    if (selectedDay === null) return;
    const dateKey = getDateKey(selectedDay);
    if (leaveReason.trim()) {
      setLeaves({ ...leaves, [dateKey]: leaveReason.trim() });
    }
    setShowLeaveModal(false);
    setLeaveReason('');
    setSelectedDay(null);
  };

  const handleCancelLeave = () => {
    if (selectedDay === null) return;
    const dateKey = getDateKey(selectedDay);
    const newLeaves = { ...leaves };
    delete newLeaves[dateKey];
    setLeaves(newLeaves);
    setShowLeaveModal(false);
    setLeaveReason('');
    setSelectedDay(null);
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
            <Text style={styles.navButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.monthText}>{formatMonth()}</Text>
          <TouchableOpacity style={styles.navButton} onPress={handleNext}>
            <Text style={styles.navButtonText}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Calendar */}
        <View style={styles.calendarContainer}>
          {/* Day Headers */}
          <View style={styles.weekHeader}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <Text key={index} style={styles.weekHeaderText}>{day}</Text>
            ))}
          </View>

          {/* Calendar Grid */}
          {generateMonthCalendar().map((week, weekIndex) => (
            <View key={weekIndex} style={styles.week}>
              {week.map((day, dayIndex) => (
                <TouchableOpacity
                  key={dayIndex}
                  style={[
                    styles.day,
                    isLeaveDay(day) && styles.leaveDay,
                  ]}
                  onPress={() => handleDayPress(day)}
                  disabled={day === null}
                >
                  {day !== null && (
                    <Text style={[
                      styles.dayNumber,
                      isLeaveDay(day) && styles.leaveDayNumber,
                    ]}>
                      {day}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

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
              {leaves[getDateKey(selectedDay || 0)] ? t('monthlySchedule.editLeave') : t('monthlySchedule.addLeave')}
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

              {leaves[getDateKey(selectedDay || 0)] && (
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
  monthNavigation: {
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
  monthText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textDark,
  },
  calendarContainer: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 12,
  },
  weekHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  weekHeaderText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textMedium,
  },
  week: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  day: {
    flex: 1,
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
    backgroundColor: Colors.white,
  },
  leaveDay: {
    backgroundColor: '#ffcccc',
    borderColor: '#ff6666',
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textDark,
  },
  leaveDayNumber: {
    color: '#cc0000',
    fontWeight: '700',
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
