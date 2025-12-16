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
import { ScreenHeader } from '../components';

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
  const [selectedHour, setSelectedHour] = useState(9);
  const [selectedMinute, setSelectedMinute] = useState(0);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = [0, 15, 30, 45];

  const handleTimeSlotPress = (dayIndex: number, timeType: 'start' | 'end') => {
    setSelectedDayIndex(dayIndex);
    setSelectedTimeType(timeType);
    
    // Set initial time based on current value
    const currentTime = timeType === 'start' 
      ? schedule[dayIndex].startTime 
      : schedule[dayIndex].endTime;
    
    if (currentTime.toUpperCase() !== 'NON') {
      const [hours, minutes] = currentTime.split(':').map(Number);
      setSelectedHour(hours);
      setSelectedMinute(minutes);
    } else {
      setSelectedHour(9);
      setSelectedMinute(0);
    }
    
    setShowTimePicker(true);
  };

  const handleTimeConfirm = () => {
    if (selectedDayIndex === null) return;

    const timeString = `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;
    const newSchedule = [...schedule];
    
    if (selectedTimeType === 'start') {
      newSchedule[selectedDayIndex].startTime = timeString;
      // If setting start time, ensure end time is valid
      const endTime = newSchedule[selectedDayIndex].endTime;
      if (endTime !== 'NON' && timeString > endTime) {
        newSchedule[selectedDayIndex].endTime = timeString;
      }
    } else {
      // Only allow end time change if start time is not NON
      if (newSchedule[selectedDayIndex].startTime.toUpperCase() !== 'NON') {
        const startTime = newSchedule[selectedDayIndex].startTime;
        if (timeString < startTime) {
          newSchedule[selectedDayIndex].endTime = startTime;
        } else {
          newSchedule[selectedDayIndex].endTime = timeString;
        }
      }
    }
    
    setSchedule(newSchedule);
    setShowTimePicker(false);
  };

  const handleNonWorkingDay = () => {
    if (selectedDayIndex !== null) {
      const newSchedule = [...schedule];
      newSchedule[selectedDayIndex].startTime = 'NON';
      newSchedule[selectedDayIndex].endTime = 'NON';
      setSchedule(newSchedule);
      setShowTimePicker(false);
    }
  };

  const handleUpdate = () => {
    // TODO: Save schedule to backend/storage
    // Show success message or navigate back
    if (onBack) {
      onBack();
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
        <ScreenHeader title={t('weeklySchedule.title')} onBack={onBack} variant="blue" />

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

      {/* Custom Time Picker Modal */}
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

            {/* Time Picker Wheels */}
            <View style={styles.pickerContainer}>
              {/* Hour Picker */}
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Hour</Text>
                <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                  {hours.map((hour) => (
                    <TouchableOpacity
                      key={hour}
                      style={[
                        styles.pickerItem,
                        selectedHour === hour && styles.pickerItemSelected
                      ]}
                      onPress={() => setSelectedHour(hour)}
                    >
                      <Text style={[
                        styles.pickerItemText,
                        selectedHour === hour && styles.pickerItemTextSelected
                      ]}>
                        {hour.toString().padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Minute Picker */}
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Minute</Text>
                <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                  {minutes.map((minute) => (
                    <TouchableOpacity
                      key={minute}
                      style={[
                        styles.pickerItem,
                        selectedMinute === minute && styles.pickerItemSelected
                      ]}
                      onPress={() => setSelectedMinute(minute)}
                    >
                      <Text style={[
                        styles.pickerItemText,
                        selectedMinute === minute && styles.pickerItemTextSelected
                      ]}>
                        {minute.toString().padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.pickerActions}>
              <TouchableOpacity style={styles.nonWorkingButton} onPress={handleNonWorkingDay}>
                <Text style={styles.nonWorkingButtonText}>Set as Non-Working</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handleTimeConfirm}>
                <Text style={styles.confirmButtonText}>Confirm</Text>
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
    paddingVertical: 18, // Increased from 12 for more spacing
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
    fontWeight: '700',
    color: Colors.textDark,
  },
  closeButton: {
    fontSize: 24,
    color: Colors.textDark,
    fontWeight: '600',
  },
  pickerContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 20,
  },
  pickerColumn: {
    flex: 1,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 12,
  },
  pickerScroll: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
  },
  pickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    alignItems: 'center',
  },
  pickerItemSelected: {
    backgroundColor: Colors.backgroundAccent,
  },
  pickerItemText: {
    fontSize: 18,
    color: Colors.textDark,
    fontWeight: '500',
  },
  pickerItemTextSelected: {
    color: Colors.accent,
    fontWeight: '700',
  },
  pickerActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  nonWorkingButton: {
    flex: 1,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    alignItems: 'center',
  },
  nonWorkingButtonText: {
    fontSize: 14,
    color: Colors.textDark,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: Colors.accent,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: '700',
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
