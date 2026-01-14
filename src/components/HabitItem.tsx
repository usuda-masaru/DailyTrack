import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Habit } from '../types';

interface HabitItemProps {
  habit: Habit;
  isChecked: boolean;
  onToggle: () => void;
  onLongPress: () => void;
}

export const HabitItem: React.FC<HabitItemProps> = ({
  habit,
  isChecked,
  onToggle,
  onLongPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onToggle}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.checkbox,
          { borderColor: habit.color },
          isChecked && { backgroundColor: habit.color },
        ]}
      >
        {isChecked && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={styles.habitName}>{habit.name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  habitName: {
    fontSize: 16,
    flex: 1,
  },
});
