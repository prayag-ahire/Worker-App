import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Modal,
} from 'react-native';
import { Colors } from '../styles/colors';
import { useLanguage } from '../contexts/LanguageContext';

interface WeeklyScheduleScreenProps {
  onBack?: () => void;
}

interface DaySchedule {
  day: string;
  startTime: string;
  endTime: string;
}

const WeeklyScheduleScreen: React.FC<WeeklyScheduleScreenProps> = ({ onBack }) => {
  const { t } = useLanguage();
  
  const [schedule, setSchedule] = useState<DaySchedule[]>([
    { day: t('calendar.sunday'), startTime: 'NON', endTime: 'NON' },
    { day: t('calendar.monday'), startTime: '09:00', endTime: '18:00' },
    { day: t('calendar.tuesday'), startTime: '09:00', endTime: '18:00' },
    { day: t('calendar.wednesday'), startTime: '09:00', endTime: '18:00' },
    { day: t('calendar.thursday'), startTime: '09:00', endTime: '18:00' },
    { day: t('calendar.friday'), startTime: '09:00', endTime: '18:00' },
    { day: t('calendar.saturday'), startTime: '09:00', endTime: '18:00' },
  ]);

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const [selectedTimeType, setSelectedTimeType] = useState<'start' | 'end'>('start');

  // Generate time slots from 00:00 to 23:00 in 1-hour intervals
  const generateTimeSlots = () => {
    const slots = ['NON'];
    for (let hour = 0; hour < 24; hour++) {
      const hourStr = hour.toString().padStart(2, '0');
      slots.push(`${hourStr}:00`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleTimeSlotPress = (dayIndex: number, timeType: 'start' | 'end') => {
    setSelectedDayIndex(dayIndex);
    setSelectedTimeType(timeType);
    setShowTimePicker(true);
  };

  const handleTimeSelect = (time: string) => {
    if (selectedDayIndex === null) return;

    const newSchedule = [...schedule];
    
    if (selectedTimeType === 'start') {
      newSchedule[selectedDayIndex].startTime = time;
      // If start time is NON, set end time to NON automatically
      if (time.toUpperCase() === 'NON') {
        newSchedule[selectedDayIndex].endTime = 'NON';
      } else {
        // Validate: if start time is after end time, reset start to NON
        const endTime = newSchedule[selectedDayIndex].endTime;
        if (endTime !== 'NON' && time > endTime) {
          newSchedule[selectedDayIndex].startTime = 'NON';
          newSchedule[selectedDayIndex].endTime = 'NON';
        }
      }
    } else {
      // Only allow end time change if start time is not NON
      if (newSchedule[selectedDayIndex].startTime.toUpperCase() !== 'NON') {
        const startTime = newSchedule[selectedDayIndex].startTime;
        // Validate: if end time is before start time, reset start to NON
        if (time !== 'NON' && time < startTime) {
          newSchedule[selectedDayIndex].startTime = 'NON';
          newSchedule[selectedDayIndex].endTime = 'NON';
        } else {
          newSchedule[selectedDayIndex].endTime = time;
        }
      }
    }
    setSchedule(newSchedule);
    setShowTimePicker(false);
  };

  const handleUpdate = () => {
    console.log('Schedule updated:', schedule);
    // TODO: Save schedule to backend/storage
    // Show success message or navigate back
    if (onBack) {
      onBack();
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
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>← {t('weeklySchedule.title')}</Text>
          </TouchableOpacity>
        </View>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, styles.dayColumn]}>{t('weeklySchedule.days')}</Text>
          <Text style={[styles.headerCell, styles.timeColumn]}>{t('weeklySchedule.startTime')}</Text>
          <Text style={[styles.headerCell, styles.timeColumn]}>{t('weeklySchedule.endTime')}</Text>
        </View>

        {/* Schedule Rows */}
        {schedule.map((item, index) => (
          <View key={index} style={styles.scheduleRow}>
            <View style={[styles.cell, styles.dayColumn]}>
              <Text style={styles.dayText}>{item.day}</Text>
            </View>
            <TouchableOpacity 
              style={[styles.cell, styles.timeColumn]}
              onPress={() => handleTimeSlotPress(index, 'start')}
              activeOpacity={0.7}
            >
              <Text style={styles.timeText}>{item.startTime}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.cell, styles.timeColumn]}
              onPress={() => handleTimeSlotPress(index, 'end')}
              activeOpacity={0.7}
              disabled={item.startTime.toUpperCase() === 'NON'}
            >
              <Text style={[
                styles.timeText,
                item.startTime.toUpperCase() === 'NON' && styles.timeTextDisabled
              ]}>
                {item.endTime}
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Update Button */}
        <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
          <Text style={styles.updateButtonText}>{t('actions.update')}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Time Picker Modal */}
      <Modal
        visible={showTimePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTimePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.timePickerContainer}>
            <View style={styles.timePickerHeader}>
              <Text style={styles.timePickerTitle}>
                Select {selectedTimeType === 'start' ? 'Start' : 'End'} Time
              </Text>
              <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.timeSlotsList} showsVerticalScrollIndicator={true}>
              {timeSlots.map((time, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.timeSlotItem}
                  onPress={() => handleTimeSelect(time)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.timeSlotText}>{time}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
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
  header: {
    marginBottom: 24,
    marginTop: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 18,
    color: Colors.textDark,
    fontWeight: '600',
  },
  tableHeader: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: Colors.backgroundSoft,
    paddingVertical: 12,
    marginBottom: 2,
  },
  headerCell: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textDark,
    textAlign: 'center',
  },
  dayColumn: {
    flex: 2,
  },
  timeColumn: {
    flex: 1.5,
  },
  scheduleRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.border,
    borderTopWidth: 0,
    marginBottom: -1,
  },
  cell: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 15,
    color: Colors.textDark,
    fontWeight: '500',
  },
  timeText: {
    fontSize: 14,
    color: Colors.textDark,
    fontWeight: '500',
  },
  timeTextDisabled: {
    color: Colors.textLight,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  timePickerContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingBottom: 20,
  },
  timePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  timePickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textDark,
  },
  closeButton: {
    fontSize: 24,
    color: Colors.textDark,
    fontWeight: '600',
  },
  timeSlotsList: {
    maxHeight: 400,
  },
  timeSlotItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  timeSlotText: {
    fontSize: 16,
    color: Colors.textDark,
    textAlign: 'center',
    fontWeight: '500',
  },
  updateButton: {
    backgroundColor: Colors.accent,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 20,
  },
  updateButtonText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: '600',
  },
});

export default WeeklyScheduleScreen;
