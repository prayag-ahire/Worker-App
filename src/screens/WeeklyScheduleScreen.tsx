import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { Colors } from '../styles/colors';
import { useLanguage } from '../contexts/LanguageContext';
import { ScreenHeader } from '../components';
import { getWeeklySchedule, updateWeeklySchedule, WeeklyScheduleResponse, UpdateWeeklyScheduleRequest } from '../services/apiClient';
import { getAuthToken } from '../utils/storage';


interface WeeklyScheduleScreenProps {
  onBack?: () => void;
  onShowError?: (fromScreen: 'weeklySchedule', message?: string) => void;
}

interface DaySchedule {
  day: string;
  startTime: string;
  endTime: string;
}

const WeeklyScheduleScreen: React.FC<WeeklyScheduleScreenProps> = ({ onBack, onShowError }) => {
  const { t } = useLanguage();
  
  const [schedule, setSchedule] = useState<DaySchedule[]>([
    { day: t('calendar.sunday'), startTime: 'NON', endTime: 'NON' },
    { day: t('calendar.monday'), startTime: 'NON', endTime: 'NON' },
    { day: t('calendar.tuesday'), startTime: 'NON', endTime: 'NON' },
    { day: t('calendar.wednesday'), startTime: 'NON', endTime: 'NON' },
    { day: t('calendar.thursday'), startTime: 'NON', endTime: 'NON' },
    { day: t('calendar.friday'), startTime: 'NON', endTime: 'NON' },
    { day: t('calendar.saturday'), startTime: 'NON', endTime: 'NON' },
  ]);

  const [isLoading, setIsLoading] = useState(true);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const [selectedTimeType, setSelectedTimeType] = useState<'start' | 'end'>('start');
  const [selectedHour, setSelectedHour] = useState(9);
  const [selectedMinute, setSelectedMinute] = useState(0);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = [0, 15, 30, 45];

  // Helper function to convert ISO timestamp to time string (HH:MM)
  const convertToTimeString = (isoString: string | null | undefined): string => {
    if (!isoString) {
      console.log('Time is null or undefined, returning NON');
      return 'NON';
    }
    
    try {
      const date = new Date(isoString);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.log('Invalid date:', isoString);
        return 'NON';
      }
      
      // Extract hours and minutes from the UTC time
      const hours = date.getUTCHours();
      const minutes = date.getUTCMinutes();
      const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      console.log(`Converted ${isoString} to ${timeString} (UTC hours: ${hours}, UTC minutes: ${minutes})`);
      return timeString;
    } catch (error) {
      console.error('Error converting time:', error);
      return 'NON';
    }
  };

  // Fetch schedule data on mount
  useEffect(() => {
    const fetchSchedule = async () => {
      setIsLoading(true);
      try {
        const token = await getAuthToken();
        if (!token) {
          throw new Error('No authentication token found. Please login again.');
        }

        console.log('Fetching weekly schedule...');
        const data = await getWeeklySchedule(token);
        console.log('Fetched schedule data:', JSON.stringify(data, null, 2));
        
        // The API might return the schedule directly or nested in a schedule property
        const scheduleData = data.schedule || data;
        console.log('Schedule object:', scheduleData);

        // Check if scheduleData exists
        if (!scheduleData) {
          throw new Error('No schedule data received from server');
        }

        // Map API response to schedule state
        const newSchedule: DaySchedule[] = [
          { 
            day: t('calendar.sunday'), 
            startTime: convertToTimeString(scheduleData.Start_Sunday), 
            endTime: convertToTimeString(scheduleData.End_Sunday) 
          },
          { 
            day: t('calendar.monday'), 
            startTime: convertToTimeString(scheduleData.Start_Monday), 
            endTime: convertToTimeString(scheduleData.End_Monday) 
          },
          { 
            day: t('calendar.tuesday'), 
            startTime: convertToTimeString(scheduleData.Start_Tuesday), 
            endTime: convertToTimeString(scheduleData.End_Tuesday) 
          },
          { 
            day: t('calendar.wednesday'), 
            startTime: convertToTimeString(scheduleData.Start_Wednesday), 
            endTime: convertToTimeString(scheduleData.End_Wednesday) 
          },
          { 
            day: t('calendar.thursday'), 
            startTime: convertToTimeString(scheduleData.Start_Thursday), 
            endTime: convertToTimeString(scheduleData.End_Thursday) 
          },
          { 
            day: t('calendar.friday'), 
            startTime: convertToTimeString(scheduleData.Start_Friday), 
            endTime: convertToTimeString(scheduleData.End_Friday) 
          },
          { 
            day: t('calendar.saturday'), 
            startTime: convertToTimeString(scheduleData.Start_Saturday), 
            endTime: convertToTimeString(scheduleData.End_Saturday) 
          },
        ];

        console.log('Mapped schedule:', newSchedule);
        setSchedule(newSchedule);
      } catch (error: any) {
        console.error('Error fetching schedule:', error);
        
        if (onShowError) {
          onShowError('weeklySchedule', error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedule();
  }, [t]);

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

  const handleUpdate = async () => {
    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      // Build the update request object
      // Send all days - NON values will be sent as null to clear them
      const updateData: any = {};
      
      // Map schedule array to API format
      const dayMapping = [
        { start: 'Start_Sunday', end: 'End_Sunday', index: 0 },
        { start: 'Start_Monday', end: 'End_Monday', index: 1 },
        { start: 'Start_Tuesday', end: 'End_Tuesday', index: 2 },
        { start: 'Start_Wednesday', end: 'End_Wednesday', index: 3 },
        { start: 'Start_Thursday', end: 'End_Thursday', index: 4 },
        { start: 'Start_Friday', end: 'End_Friday', index: 5 },
        { start: 'Start_Saturday', end: 'End_Saturday', index: 6 },
      ];

      dayMapping.forEach(({ start, end, index }) => {
        const daySchedule = schedule[index];
        
        // If time is 'NON', send null to clear it, otherwise send the time string
        if (daySchedule.startTime.toUpperCase() === 'NON') {
          updateData[start] = null;
        } else {
          updateData[start] = daySchedule.startTime;
        }
        
        if (daySchedule.endTime.toUpperCase() === 'NON') {
          updateData[end] = null;
        } else {
          updateData[end] = daySchedule.endTime;
        }
      });

      console.log('Updating schedule with data:', updateData);

      const response = await updateWeeklySchedule(token, updateData);
      
      console.log('Schedule updated successfully:', response);
      
      Toast.show({
        type: 'success',
        text1: 'Schedule Updated',
        text2: response.message || 'Your weekly schedule has been saved',
        position: 'top',
        visibilityTime: 3000,
      });

      // Optionally navigate back after successful update
      // if (onBack) {
      //   setTimeout(() => onBack(), 1500);
      // }
    } catch (error: any) {
      console.error('Error updating schedule:', error);
      
      if (onShowError && (error.message?.includes('Session expired') || error.message?.includes('Unauthorized'))) {
        onShowError('weeklySchedule', error.message);
        return;
      }

      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: error.message || 'Could not save schedule',
        position: 'top',
        visibilityTime: 3000,
      });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.accent} translucent={true} />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.accent} />
          <Text style={styles.loadingText}>Loading schedule...</Text>
        </View>
      ) : (
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
      )}

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textMedium,
    fontWeight: '500',
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
