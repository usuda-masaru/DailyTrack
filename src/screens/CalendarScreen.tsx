import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useFocusEffect } from '@react-navigation/native';
import { Habit, CheckRecord } from '../types';
import { StorageService } from '../utils/storage';

interface MarkedDates {
  [date: string]: {
    dots: Array<{ key: string; color: string }>;
  };
}

export const CalendarScreen: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [checkRecords, setCheckRecords] = useState<CheckRecord[]>([]);
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});

  const loadData = async () => {
    const loadedHabits = await StorageService.getHabits();
    const loadedChecks = await StorageService.getCheckRecords();

    setHabits(loadedHabits);
    setCheckRecords(loadedChecks);

    const marked: MarkedDates = {};

    loadedChecks.forEach(check => {
      const habit = loadedHabits.find(h => h.id === check.habitId);
      if (habit) {
        if (!marked[check.date]) {
          marked[check.date] = { dots: [] };
        }
        marked[check.date].dots.push({
          key: habit.id,
          color: habit.color,
        });
      }
    });

    setMarkedDates(marked);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const getStatsForMonth = (year: number, month: number) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const monthStr = String(month).padStart(2, '0');

    let totalPossible = 0;
    let totalCompleted = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${monthStr}-${String(day).padStart(2, '0')}`;
      const checksForDay = checkRecords.filter(c => c.date === dateStr);

      totalPossible += habits.length;
      totalCompleted += checksForDay.length;
    }

    const percentage = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;

    return {
      totalCompleted,
      totalPossible,
      percentage,
    };
  };

  const currentDate = new Date();
  const stats = getStatsForMonth(currentDate.getFullYear(), currentDate.getMonth() + 1);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>カレンダー</Text>
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>今月の達成率</Text>
          <Text style={styles.statsPercentage}>{stats.percentage}%</Text>
          <Text style={styles.statsDetail}>
            {stats.totalCompleted} / {stats.totalPossible} 回完了
          </Text>
        </View>
      </View>

      <Calendar
        markingType="multi-dot"
        markedDates={markedDates}
        theme={{
          todayTextColor: '#007AFF',
          selectedDayBackgroundColor: '#007AFF',
          dotColor: '#007AFF',
          arrowColor: '#007AFF',
        }}
      />

      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>習慣一覧</Text>
        {habits.length === 0 ? (
          <Text style={styles.emptyText}>習慣がまだ登録されていません</Text>
        ) : (
          habits.map(habit => (
            <View key={habit.id} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: habit.color }]} />
              <Text style={styles.legendText}>{habit.name}</Text>
            </View>
          ))
        )}
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
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statsContainer: {
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  statsText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  statsPercentage: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statsDetail: {
    fontSize: 12,
    color: '#999',
  },
  legendContainer: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 20,
    marginHorizontal: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  legendTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  legendText: {
    fontSize: 16,
    color: '#333',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
});
