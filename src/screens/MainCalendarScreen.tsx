import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { useFocusEffect } from '@react-navigation/native';
import { Habit, CheckRecord } from '../types';
import { StorageService, formatDate, getTodayString } from '../utils/storage';
import { HabitItem } from '../components/HabitItem';

interface MarkedDates {
  [date: string]: {
    dots: Array<{ key: string; color: string }>;
    selected?: boolean;
    selectedColor?: string;
  };
}

export const MainCalendarScreen: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [checkRecords, setCheckRecords] = useState<CheckRecord[]>([]);
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
  const [selectedDateChecks, setSelectedDateChecks] = useState<Set<string>>(new Set());

  const loadData = async () => {
    const loadedHabits = await StorageService.getHabits();
    const loadedChecks = await StorageService.getCheckRecords();

    setHabits(loadedHabits);
    setCheckRecords(loadedChecks);

    updateMarkedDates(loadedHabits, loadedChecks, selectedDate);
    updateSelectedDateChecks(loadedChecks, selectedDate);
  };

  const updateMarkedDates = (
    habitList: Habit[],
    checks: CheckRecord[],
    selected: string
  ) => {
    const marked: MarkedDates = {};

    checks.forEach(check => {
      const habit = habitList.find(h => h.id === check.habitId);
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

    // Mark selected date
    if (marked[selected]) {
      marked[selected].selected = true;
      marked[selected].selectedColor = '#e3f2fd';
    } else {
      marked[selected] = {
        dots: [],
        selected: true,
        selectedColor: '#e3f2fd',
      };
    }

    setMarkedDates(marked);
  };

  const updateSelectedDateChecks = (checks: CheckRecord[], date: string) => {
    const checked = new Set<string>();
    checks.forEach(check => {
      if (check.date === date) {
        checked.add(check.habitId);
      }
    });
    setSelectedDateChecks(checked);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
    updateMarkedDates(habits, checkRecords, day.dateString);
    updateSelectedDateChecks(checkRecords, day.dateString);
  };

  const handleToggleCheck = async (habitId: string) => {
    const isChecked = await StorageService.toggleCheck(habitId, selectedDate);

    // Update local state
    setSelectedDateChecks(prev => {
      const newSet = new Set(prev);
      if (isChecked) {
        newSet.add(habitId);
      } else {
        newSet.delete(habitId);
      }
      return newSet;
    });

    // Reload data to update calendar
    const loadedChecks = await StorageService.getCheckRecords();
    setCheckRecords(loadedChecks);
    updateMarkedDates(habits, loadedChecks, selectedDate);
  };

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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>全習慣カレンダー</Text>
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
        onDayPress={handleDayPress}
        theme={{
          todayTextColor: '#007AFF',
          selectedDayBackgroundColor: '#007AFF',
          dotColor: '#007AFF',
          arrowColor: '#007AFF',
        }}
      />

      <View style={styles.habitsSection}>
        <Text style={styles.habitsSectionTitle}>
          {selectedDate === getTodayString()
            ? '今日の習慣'
            : `${selectedDate} の習慣`}
        </Text>
        {habits.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>習慣がまだ登録されていません</Text>
            <Text style={styles.emptySubText}>「管理」タブから習慣を追加してください</Text>
          </View>
        ) : (
          <FlatList
            data={habits}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <HabitItem
                habit={item}
                isChecked={selectedDateChecks.has(item.id)}
                onToggle={() => handleToggleCheck(item.id)}
                onLongPress={() => {}}
              />
            )}
            style={styles.habitsList}
          />
        )}
      </View>
    </View>
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
  habitsSection: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 12,
  },
  habitsSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    padding: 16,
    paddingBottom: 8,
    backgroundColor: '#f8f9fa',
  },
  habitsList: {
    flex: 1,
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
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#bbb',
  },
});
