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

interface RescheduleCalendarScreenProps {
  onBack?: () => void;
  onNext?: (selectedDate: Date) => void;
  onShowError?: (fromScreen: 'rescheduleCalendar', message?: string) => void;
}

const RescheduleCalendarScreen: React.FC<RescheduleCalendarScreenProps> = ({ onBack, onNext, onShowError }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const formatMonth = () => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    const monthName = months[currentMonth.getMonth()];
    const year = currentMonth.getFullYear();
    return `${monthName.slice(0, 3)}, ${year}`;
  };

  const handlePrevious = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentMonth(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentMonth(newDate);
  };

  const generateCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const calendar: (Date | null)[][] = [];
    let week: (Date | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      week.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      week.push(new Date(year, month, day));
      if (week.length === 7) {
        calendar.push(week);
        week = [];
      }
    }

    // Fill the last week with empty cells
    if (week.length > 0) {
      while (week.length < 7) {
        week.push(null);
      }
      calendar.push(week);
    }

    return calendar;
  };

  const isSameDate = (date1: Date | null, date2: Date | null) => {
    if (!date1 || !date2) return false;
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const isPastDate = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  const handleDateSelect = (date: Date | null) => {
    if (date && !isPastDate(date)) {
      setSelectedDate(date);
    }
  };

  const handleNextButton = () => {
    if (selectedDate && onNext) {
      onNext(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Reschedule Your Worker</Text>

        {/* Month Navigation */}
        <View style={styles.monthNavigation}>
          <TouchableOpacity style={styles.monthNavButton} onPress={handlePrevious}>
            <Text style={styles.monthNavButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.monthText}>{formatMonth()}</Text>
          <TouchableOpacity style={styles.monthNavButton} onPress={handleNext}>
            <Text style={styles.monthNavButtonText}>→</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.calendarContainer}>
          {/* Week Headers */}
          <View style={styles.weekHeader}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <Text key={index} style={styles.weekHeaderText}>{day}</Text>
            ))}
          </View>

          {/* Calendar Grid */}
          {generateCalendar().map((week, weekIndex) => (
            <View key={weekIndex} style={styles.week}>
              {week.map((date, dayIndex) => {
                const isPast = isPastDate(date);
                const isSelected = isSameDate(date, selectedDate);
                
                return (
                  <TouchableOpacity
                    key={dayIndex}
                    style={[
                      styles.calendarDay,
                      isSelected && styles.calendarDaySelected,
                      isPast && styles.calendarDayPast,
                    ]}
                    onPress={() => handleDateSelect(date)}
                    disabled={date === null || isPast}
                  >
                    {date !== null && (
                      <Text style={[
                        styles.calendarDayText,
                        isSelected && styles.calendarDayTextSelected,
                        isPast && styles.calendarDayTextPast,
                      ]}>
                        {date.getDate()}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.navButton} onPress={onBack}>
            <Text style={styles.navButtonText}>← previous</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.navButton, !selectedDate && styles.navButtonDisabled]} 
            onPress={handleNextButton}
            disabled={!selectedDate}
          >
            <Text style={styles.navButtonText}>Next →</Text>
          </TouchableOpacity>
        </View>
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
  monthNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingVertical: 12,
  },
  monthNavButton: {
    padding: 8,
  },
  monthNavButtonText: {
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
    marginBottom: 24,
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
  calendarDay: {
    flex: 1,
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: 2,
  },
  calendarDaySelected: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  calendarDayPast: {
    backgroundColor: '#f5f5f5',
    opacity: 0.5,
  },
  calendarDayText: {
    fontSize: 14,
    color: Colors.textDark,
    fontWeight: '500',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
    padding: 0,
  },
  calendarDayTextSelected: {
    color: Colors.white,
    fontWeight: '700',
  },
  calendarDayTextPast: {
    color: Colors.textLight,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navButton: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 15,
    color: Colors.textDark,
    fontWeight: '500',
  },
});

export default RescheduleCalendarScreen;
