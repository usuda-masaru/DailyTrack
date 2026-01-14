import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { useFocusEffect } from '@react-navigation/native';
import { Habit, CheckRecord } from '../types';
import { StorageService, getTodayString } from '../utils/storage';

interface HabitCalendarScreenProps {
  habitId: string;
}

interface MarkedDates {
  [date: string]: {
    selected: boolean;
    selectedColor: string;
  };
}

export const HabitCalendarScreen: React.FC<HabitCalendarScreenProps> = ({ habitId }) => {
  const [habit, setHabit] = useState<Habit | null>(null);
  const [checkRecords, setCheckRecords] = useState<CheckRecord[]>([]);
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());

  const loadData = async () => {
    const loadedHabits = await StorageService.getHabits();
    const foundHabit = loadedHabits.find(h => h.id === habitId);
    setHabit(foundHabit || null);

    if (!foundHabit) return;

    const loadedChecks = await StorageService.getCheckRecords();
    const habitChecks = loadedChecks.filter(c => c.habitId === habitId);
    setCheckRecords(habitChecks);

    updateMarkedDates(foundHabit, habitChecks, selectedDate);
  };

  const updateMarkedDates = (
    currentHabit: Habit,
    checks: CheckRecord[],
    selected: string
  ) => {
    const marked: MarkedDates = {};

    checks.forEach(check => {
      marked[check.date] = {
        selected: true,
        selectedColor: currentHabit.color,
      };
    });

    // Highlight selected date differently if not checked
    if (!marked[selected]) {
      marked[selected] = {
        selected: true,
        selectedColor: '#e3f2fd',
      };
    }

    setMarkedDates(marked);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [habitId])
  );

  const handleDayPress = async (day: DateData) => {
    setSelectedDate(day.dateString);

    if (!habit) return;

    // Toggle check for this date
    await StorageService.toggleCheck(habitId, day.dateString);

    // Reload data
    loadData();
  };

  const getStats = () => {
    if (!habit) return { total: 0, currentStreak: 0, longestStreak: 0 };

    const total = checkRecords.length;

    // Calculate current streak
    let currentStreak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateString = checkDate.toISOString().split('T')[0];

      const isChecked = checkRecords.some(c => c.date === dateString);
      if (isChecked) {
        currentStreak++;
      } else if (i > 0) {
        break;
      }
    }

    // Calculate longest streak
    const sortedDates = checkRecords
      .map(c => new Date(c.date))
      .sort((a, b) => a.getTime() - b.getTime());

    let longestStreak = 0;
    let tempStreak = 0;
    let prevDate: Date | null = null;

    sortedDates.forEach(date => {
      if (prevDate) {
        const diffDays = Math.round((date.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      } else {
        tempStreak = 1;
      }
      prevDate = date;
    });
    longestStreak = Math.max(longestStreak, tempStreak);

    return { total, currentStreak, longestStreak };
  };

  if (!habit) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>習慣が見つかりません</Text>
        </View>
      </View>
    );
  }

  const stats = getStats();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.habitIcon, { backgroundColor: habit.color }]}>
          <Text style={styles.habitIconText}>{habit.name.charAt(0)}</Text>
        </View>
        <Text style={styles.headerTitle}>{habit.name}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>合計日数</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#4CAF50' }]}>{stats.currentStreak}</Text>
          <Text style={styles.statLabel}>現在の連続</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#FF9800' }]}>{stats.longestStreak}</Text>
          <Text style={styles.statLabel}>最長連続</Text>
        </View>
      </View>

      <View style={styles.calendarContainer}>
        <Text style={styles.calendarTitle}>カレンダー</Text>
        <Text style={styles.calendarSubtitle}>日付をタップしてチェック/解除</Text>
        <Calendar
          markedDates={markedDates}
          onDayPress={handleDayPress}
          theme={{
            todayTextColor: habit.color,
            selectedDayBackgroundColor: habit.color,
            arrowColor: habit.color,
          }}
        />
      </View>

      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: habit.color }]} />
          <Text style={styles.legendText}>実施済み</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: '#e3f2fd' }]} />
          <Text style={styles.legendText}>選択中</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  habitIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  habitIconText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginTop: 12,
    marginHorizontal: 12,
    borderRadius: 12,
    padding: 20,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  calendarContainer: {
    backgroundColor: '#fff',
    marginTop: 12,
    marginHorizontal: 12,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  calendarSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  legendContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 12,
    borderRadius: 12,
    padding: 16,
    justifyContent: 'center',
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  legendBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
