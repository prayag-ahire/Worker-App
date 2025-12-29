import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Colors } from '../styles/colors';

interface TimeSlotsScreenProps {
  onBack?: () => void;
  onReschedule?: (selectedTimes: string[]) => void;
  onShowError?: (fromScreen: 'timeSlots', message?: string) => void;
}

const TimeSlotsScreen: React.FC<TimeSlotsScreenProps> = ({ onBack, onReschedule, onShowError }) => {
  const [selectedSlots, setSelectedSlots] = useState<number[]>([]);

  const timeSlots = [
    '9:00 - 10:00', '10:00 - 11:00',
    '11:00 - 12:00', '12:00 - 01:00',
    '01:00 - 02:00', '02:00 - 03:00',
    '03:00 - 04:00', '04:00 - 05:00',
    '05:00 - 06:00', '06:00 - 07:00',
    '07:00 - 08:00', '08:00 - 09:00',
    '09:00 - 10:00', '10:00 - 11:00',
    '11:00 - 12:00',
  ];

  const handleSlotPress = (index: number) => {
    if (selectedSlots.length === 0) {
      // First selection
      setSelectedSlots([index]);
    } else if (selectedSlots.includes(index)) {
      // Deselect - remove from selection
      const newSelection = selectedSlots.filter(i => i !== index);
      setSelectedSlots(newSelection);
    } else {
      // Check if consecutive
      const minSelected = Math.min(...selectedSlots);
      const maxSelected = Math.max(...selectedSlots);
      
      if (index === minSelected - 1 || index === maxSelected + 1) {
        // Adjacent to current selection - add it
        const newSelection = [...selectedSlots, index].sort((a, b) => a - b);
        setSelectedSlots(newSelection);
      } else if (index > minSelected && index < maxSelected) {
        // Fill gap in the middle
        const newSelection = [...selectedSlots, index].sort((a, b) => a - b);
        setSelectedSlots(newSelection);
      } else {
        // Not consecutive - replace with new selection
        setSelectedSlots([index]);
      }
    }
  };

  const isSlotSelected = (index: number) => {
    return selectedSlots.includes(index);
  };

  const handleReschedule = () => {
    if (selectedSlots.length > 0 && onReschedule) {
      const selectedTimes = selectedSlots.map(i => timeSlots[i]);
      onReschedule(selectedTimes);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Schedule Time</Text>

        <View style={styles.timeSlotsGrid}>
          {timeSlots.map((slot, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.timeSlot,
                isSlotSelected(index) && styles.timeSlotSelected,
              ]}
              onPress={() => handleSlotPress(index)}
            >
              <Text style={[
                styles.timeSlotText,
                isSlotSelected(index) && styles.timeSlotTextSelected,
              ]}>
                {slot}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          style={[styles.rescheduleButton, selectedSlots.length === 0 && styles.rescheduleButtonDisabled]}
          onPress={handleReschedule}
          disabled={selectedSlots.length === 0}
        >
          <Text style={styles.rescheduleButtonText}>Reschedule</Text>
        </TouchableOpacity>
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
    paddingVertical: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: 24,
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  timeSlot: {
    width: '47%',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  timeSlotSelected: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  timeSlotText: {
    fontSize: 15,
    color: Colors.textDark,
    fontWeight: '500',
  },
  timeSlotTextSelected: {
    color: Colors.white,
    fontWeight: '600',
  },
  rescheduleButton: {
    backgroundColor: Colors.accent,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  rescheduleButtonDisabled: {
    opacity: 0.5,
  },
  rescheduleButtonText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: '600',
  },
});

export default TimeSlotsScreen;
