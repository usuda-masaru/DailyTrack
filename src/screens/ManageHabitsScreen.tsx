import React, { useState, useCallback } from 'react';
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
import { StorageService } from '../utils/storage';

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
  '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
  '#F06292', '#AED581', '#FFD54F', '#4DB6AC'
];

export const ManageHabitsScreen: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');

  const loadHabits = async () => {
    const loadedHabits = await StorageService.getHabits();
    setHabits(loadedHabits);
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
      `「${habit.name}」を削除しますか？すべての記録も削除されます。`,
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

  const renderHabitItem = ({ item }: { item: Habit }) => (
    <View style={styles.habitItem}>
      <View style={[styles.habitColor, { backgroundColor: item.color }]} />
      <Text style={styles.habitName}>{item.name}</Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteHabit(item)}
      >
        <Text style={styles.deleteButtonText}>削除</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>習慣管理</Text>
        <Text style={styles.headerSubtitle}>
          習慣を追加すると、各習慣専用のカレンダータブが作成されます
        </Text>
      </View>

      {habits.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>習慣がまだ登録されていません</Text>
          <Text style={styles.emptySubText}>右下の + ボタンから追加してください</Text>
        </View>
      ) : (
        <FlatList
          data={habits}
          keyExtractor={item => item.id}
          renderItem={renderHabitItem}
          contentContainerStyle={styles.listContainer}
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
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  listContainer: {
    padding: 12,
  },
  habitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  habitColor: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16,
  },
  habitName: {
    flex: 1,
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
