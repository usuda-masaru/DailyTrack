export interface Habit {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

export interface CheckRecord {
  habitId: string;
  date: string; // YYYY-MM-DD format
}

export interface DailyProgress {
  [date: string]: {
    [habitId: string]: boolean;
  };
}
