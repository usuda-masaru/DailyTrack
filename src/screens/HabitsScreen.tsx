import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Habit } from '../types';
import { StorageService, getTodayString } from '../utils/storage';
import { HabitItem } from '../components/HabitItem';

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];

export const HabitsScreen: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [checkedHabits, setCheckedHabits] = useState<Set<string>>(new Set());
  const [modalVisible, setModalVisible] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const today = getTodayString();

  const loadHabits = async () => {
    const loadedHabits = await StorageService.getHabits();
    setHabits(loadedHabits);

    const checked = new Set<string>();
    for (const habit of loadedHabits) {
      const isChecked = await StorageService.isChecked(habit.id, today);
      if (isChecked) {
        checked.add(habit.id);
      }
    }
    setCheckedHabits(checked);
  };

  useFocusEffect(
    useCallback(() => {
      loadHabits();
    }, [])
  );

  const handleAddHabit = async () => {
    if (newHabitName.trim() === '') {
      Alert.alert('エラー', '習慣名を入力してください');
      return;
    }

    const newHabit: Habit = {
      id: Date.now().toString(),
      name: newHabitName.trim(),
      color: COLORS[habits.length % COLORS.length],
      createdAt: new Date().toISOString(),
    };

    await StorageService.addHabit(newHabit);
    setNewHabitName('');
    setModalVisible(false);
    loadHabits();
  };

  const handleDeleteHabit = async (habit: Habit) => {
    Alert.alert(
      '削除確認',
      `「${habit.name}」を削除しますか？`,
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            await StorageService.deleteHabit(habit.id);
            loadHabits();
          },
        },
      ]
    );
  };

  const handleToggleCheck = async (habitId: string) => {
    const isChecked = await StorageService.toggleCheck(habitId, today);

    setCheckedHabits(prev => {
      const newSet = new Set(prev);
      if (isChecked) {
        newSet.add(habitId);
      } else {
        newSet.delete(habitId);
      }
      return newSet;
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>今日の習慣</Text>
        <Text style={styles.headerDate}>
          {new Date().toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })}
        </Text>
      </View>

      {habits.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>習慣を追加してください</Text>
          <Text style={styles.emptySubText}>右下の + ボタンから追加できます</Text>
        </View>
      ) : (
        <FlatList
          data={habits}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <HabitItem
              habit={item}
              isChecked={checkedHabits.has(item.id)}
              onToggle={() => handleToggleCheck(item.id)}
              onLongPress={() => handleDeleteHabit(item)}
            />
          )}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>新しい習慣を追加</Text>
            <TextInput
              style={styles.input}
              placeholder="習慣名（例：筋トレ、英会話）"
              value={newHabitName}
              onChangeText={setNewHabitName}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setNewHabitName('');
                }}
              >
                <Text style={styles.cancelButtonText}>キャンセル</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddHabit}
              >
                <Text style={styles.saveButtonText}>追加</Text>
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
  },
  headerDate: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#bbb',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addButtonText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    marginLeft: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});
