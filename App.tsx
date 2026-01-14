import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainCalendarScreen } from './src/screens/MainCalendarScreen';
import { HabitCalendarScreen } from './src/screens/HabitCalendarScreen';
import { ManageHabitsScreen } from './src/screens/ManageHabitsScreen';
import { StorageService } from './src/utils/storage';
import { Habit } from './src/types';

const Tab = createBottomTabNavigator();

export default function App() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHabits = async () => {
    const loadedHabits = await StorageService.getHabits();
    setHabits(loadedHabits);
    setLoading(false);
  };

  useEffect(() => {
    loadHabits();

    // Poll for habit changes every 2 seconds
    const interval = setInterval(() => {
      loadHabits();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#999',
          tabBarStyle: {
            borderTopWidth: 1,
            borderTopColor: '#e0e0e0',
            paddingTop: 8,
            paddingBottom: 8,
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
        }}
      >
        {/* Main Calendar Tab */}
        <Tab.Screen
          name="MainCalendar"
          component={MainCalendarScreen}
          options={{
            tabBarLabel: '全習慣',
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size, color }}>📅</Text>
            ),
          }}
        />

        {/* Dynamic Habit Tabs */}
        {habits.map((habit) => (
          <Tab.Screen
            key={habit.id}
            name={`Habit_${habit.id}`}
            options={{
              tabBarLabel: habit.name.length > 6 ? habit.name.substring(0, 6) + '...' : habit.name,
              tabBarIcon: ({ color, size }) => (
                <Text
                  style={{
                    fontSize: size - 4,
                    color: habit.color,
                    fontWeight: 'bold',
                  }}
                >
                  {habit.name.charAt(0)}
                </Text>
              ),
            }}
          >
            {() => <HabitCalendarScreen habitId={habit.id} />}
          </Tab.Screen>
        ))}

        {/* Manage Habits Tab */}
        <Tab.Screen
          name="Manage"
          component={ManageHabitsScreen}
          options={{
            tabBarLabel: '管理',
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size, color }}>⚙️</Text>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
