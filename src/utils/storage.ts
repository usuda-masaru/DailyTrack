import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit, CheckRecord } from '../types';

const HABITS_KEY = '@DailyTrack:habits';
const CHECKS_KEY = '@DailyTrack:checks';

export const StorageService = {
  // Habits
  async getHabits(): Promise<Habit[]> {
    try {
      const data = await AsyncStorage.getItem(HABITS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting habits:', error);
      return [];
    }
  },

  async saveHabits(habits: Habit[]): Promise<void> {
    try {
      await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(habits));
    } catch (error) {
      console.error('Error saving habits:', error);
    }
  },

  async addHabit(habit: Habit): Promise<void> {
    const habits = await this.getHabits();
    habits.push(habit);
    await this.saveHabits(habits);
  },

  async deleteHabit(habitId: string): Promise<void> {
    const habits = await this.getHabits();
    const filtered = habits.filter(h => h.id !== habitId);
    await this.saveHabits(filtered);

    // Also delete related check records
    const checks = await this.getCheckRecords();
    const filteredChecks = checks.filter(c => c.habitId !== habitId);
    await this.saveCheckRecords(filteredChecks);
  },

  // Check Records
  async getCheckRecords(): Promise<CheckRecord[]> {
    try {
      const data = await AsyncStorage.getItem(CHECKS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting check records:', error);
      return [];
    }
  },

  async saveCheckRecords(records: CheckRecord[]): Promise<void> {
    try {
      await AsyncStorage.setItem(CHECKS_KEY, JSON.stringify(records));
    } catch (error) {
      console.error('Error saving check records:', error);
    }
  },

  async toggleCheck(habitId: string, date: string): Promise<boolean> {
    const records = await this.getCheckRecords();
    const existingIndex = records.findIndex(
      r => r.habitId === habitId && r.date === date
    );

    if (existingIndex >= 0) {
      records.splice(existingIndex, 1);
      await this.saveCheckRecords(records);
      return false;
    } else {
      records.push({ habitId, date });
      await this.saveCheckRecords(records);
      return true;
    }
  },

  async isChecked(habitId: string, date: string): Promise<boolean> {
    const records = await this.getCheckRecords();
    return records.some(r => r.habitId === habitId && r.date === date);
  },
};

export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getTodayString = (): string => {
  return formatDate(new Date());
};
