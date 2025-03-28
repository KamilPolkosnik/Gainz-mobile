import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { X, Plus, Trash2, ChevronDown, Search, Calendar } from 'lucide-react-native';
import { Exercise, ExerciseSet, SavedExercise } from '@/types/workout';
import { useWorkoutStore } from '@/stores/workouts';
import { Modal } from './Modal';
import { colors } from '@/constants/colors';

interface WorkoutFormProps {
  onClose: () => void;
  onSubmit: (data: { date: string; exercises: Exercise[] }) => void;
  initialData?: {
    date: string;
    exercises: Exercise[];
  };
}

export function WorkoutForm({ onClose, onSubmit, initialData }: WorkoutFormProps) {
  const [date, setDate] = useState<Date>(
    initialData ? new Date(initialData.date) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>(
    initialData?.exercises || []
  );
  const [showExerciseSearch, setShowExerciseSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<number>(-1);
  
  const { getSavedExercises } = useWorkoutStore();
  const savedExercises = getSavedExercises(searchQuery);

  const formatDate = (date: Date) => {
    try {
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      return date.toLocaleDateString('pl-PL', options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const handleDateChange = (selectedDate: Date | null) => {
    if (selectedDate) {
      setDate(new Date(selectedDate));
      setShowDatePicker(false);
    }
  };

  const addExercise = () => {
    setExercises([
      ...exercises,
      {
        id: Math.random().toString(36).substring(7),
        name: '',
        sets: [
          {
            id: Math.random().toString(36).substring(7),
            reps: 0,
            weight: 0,
            distance: 0,
            time: 0
          },
        ],
      },
    ]);
  };

  const updateExercise = (index: number, exercise: Partial<Exercise>) => {
    const newExercises = [...exercises];
    newExercises[index] = { ...newExercises[index], ...exercise };
    setExercises(newExercises);
  };

  const addSet = (exerciseIndex: number) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets.push({
      id: Math.random().toString(36).substring(7),
      reps: 0,
      weight: 0,
      distance: 0,
      time: 0
    });
    setExercises(newExercises);
  };

  const updateSet = (
    exerciseIndex: number,
    setIndex: number,
    set: Partial<ExerciseSet>
  ) => {
    const newExercises = [...exercises];
    if (set.time !== undefined) {
      // Convert minutes to seconds when saving
      set.time = set.time * 60;
    }
    newExercises[exerciseIndex].sets[setIndex] = {
      ...newExercises[exerciseIndex].sets[setIndex],
      ...set,
    };
    setExercises(newExercises);
  };

  const getTimeInMinutes = (seconds: number) => {
    return (seconds / 60).toString();
  };

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets.splice(setIndex, 1);
    setExercises(newExercises);
  };

  const removeExercise = (index: number) => {
    const newExercises = [...exercises];
    newExercises.splice(index, 1);
    setExercises(newExercises);
  };

  const handleSubmit = () => {
    if (exercises.some(exercise => !exercise.name)) {
      alert('Wszystkie ćwiczenia muszą mieć nazwę');
      return;
    }
    onSubmit({
      date: date.toISOString(),
      exercises,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {initialData ? 'Edytuj trening' : 'Nowy trening'}
        </Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <View style={styles.dateButtonContent}>
            <Calendar size={20} color="#0d6efd" />
            <Text style={styles.dateButtonText}>
              {formatDate(date)}
            </Text>
            <ChevronDown size={20} color="#0d6efd" />
          </View>
        </TouchableOpacity>

        <View style={styles.exercises}>
          {exercises.map((exercise, exerciseIndex) => (
            <View key={exercise.id} style={styles.exercise}>
              <View style={styles.exerciseHeader}>
                <View style={styles.exerciseNameContainer}>
                  <TextInput
                    style={styles.exerciseNameInput}
                    placeholder="Nazwa ćwiczenia"
                    value={exercise.name}
                    onChangeText={(text) => updateExercise(exerciseIndex, { name: text })}
                  />
                  <View style={styles.exerciseActions}>
                    <TouchableOpacity
                      style={styles.exerciseSearchButton}
                      onPress={() => {
                        setSelectedExerciseIndex(exerciseIndex);
                        setShowExerciseSearch(true);
                      }}
                    >
                      <Search size={20} color={colors.text.secondary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => removeExercise(exerciseIndex)}
                      style={styles.removeButton}
                    >
                      <Trash2 size={20} color={colors.common.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {exercise.sets.map((set, setIndex) => (
                <View key={set.id} style={styles.set}>
                  <Text style={styles.setNumber}>Seria {setIndex + 1}</Text>
                  <View style={styles.setInputsContainer}>
                    <View style={styles.setInputsRow}>
                      <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Powt.</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="0"
                          keyboardType="numeric"
                          value={set.reps?.toString() || ''}
                          onChangeText={(text) =>
                            updateSet(exerciseIndex, setIndex, {
                              reps: parseInt(text) || 0,
                            })
                          }
                        />
                      </View>
                      <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Kg</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="0"
                          keyboardType="numeric"
                          value={set.weight?.toString() || ''}
                          onChangeText={(text) =>
                            updateSet(exerciseIndex, setIndex, {
                              weight: parseFloat(text) || 0,
                            })
                          }
                        />
                      </View>
                    </View>
                    <View style={styles.setInputsRow}>
                      <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Dystans (m)</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="0"
                          keyboardType="numeric"
                          value={set.distance?.toString() || ''}
                          onChangeText={(text) =>
                            updateSet(exerciseIndex, setIndex, {
                              distance: parseFloat(text) || 0,
                            })
                          }
                        />
                      </View>
                      <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Czas (min)</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="0"
                          keyboardType="numeric"
                          value={set.time ? getTimeInMinutes(set.time) : ''}
                          onChangeText={(text) =>
                            updateSet(exerciseIndex, setIndex, {
                              time: parseFloat(text) || 0,
                            })
                          }
                        />
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => removeSet(exerciseIndex, setIndex)}
                      style={styles.removeSetButton}
                    >
                      <X size={20} color="#666" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

              <TouchableOpacity
                style={styles.addSetButton}
                onPress={() => addSet(exerciseIndex)}
              >
                <Plus size={20} color="#0d6efd" />
                <Text style={styles.addSetText}>Dodaj serię</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.addExerciseButton} onPress={addExercise}>
          <Plus size={24} color="#fff" />
          <Text style={styles.addExerciseText}>Dodaj ćwiczenie</Text>
        </TouchableOpacity>
      </ScrollView>

      {showExerciseSearch && (
        <View style={styles.searchOverlay}>
          <View style={styles.searchHeader}>
            <View style={styles.searchInputContainer}>
              <Search size={20} color="#666" />
              <TextInput
                style={styles.searchInput}
                placeholder="Szukaj ćwiczenia..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                setShowExerciseSearch(false);
                setSearchQuery('');
              }}
            >
              <X size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.searchResults}>
            {savedExercises.map((exercise) => (
              <TouchableOpacity
                key={exercise.id}
                style={styles.searchResult}
                onPress={() => {
                  if (selectedExerciseIndex >= 0) {
                    updateExercise(selectedExerciseIndex, {
                      name: exercise.name,
                      sets: exercise.lastSets,
                    });
                    setShowExerciseSearch(false);
                    setSearchQuery('');
                  }
                }}
              >
                <Text style={styles.searchResultText}>{exercise.name}</Text>
                <Text style={styles.searchResultDate}>
                  {new Date(exercise.lastUsed).toLocaleDateString('pl-PL')}
                </Text>
              </TouchableOpacity>
            ))}
            {searchQuery && (
              <TouchableOpacity
                style={[styles.searchResult, styles.searchResultNew]}
                onPress={() => {
                  if (selectedExerciseIndex >= 0) {
                    updateExercise(selectedExerciseIndex, {
                      name: searchQuery,
                    });
                    setShowExerciseSearch(false);
                    setSearchQuery('');
                  }
                }}
              >
                <Text style={styles.searchResultText}>
                  Dodaj "{searchQuery}" jako nowe ćwiczenie
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      )}

      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>
            {initialData ? 'Zapisz zmiany' : 'Dodaj trening'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  dateButton: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  dateButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateButtonText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#0d6efd',
    marginHorizontal: 12,
  },
  exercises: {
    gap: 24,
  },
  exercise: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  exerciseHeader: {
    marginBottom: 16,
  },
  exerciseNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.common.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.common.border,
    overflow: 'hidden',
  },
  exerciseNameInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: colors.text.primary,
    minHeight: 44,
  },
  exerciseActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseSearchButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: colors.common.border,
    backgroundColor: colors.common.background,
  },
  removeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: colors.common.border,
    backgroundColor: colors.common.background,
  },
  set: {
    marginBottom: 12,
  },
  setNumber: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: '#666',
    marginBottom: 8,
  },
  setInputsContainer: {
    gap: 12,
  },
  setInputsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
    color: '#666',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },
  removeSetButton: {
    alignSelf: 'center',
    padding: 8,
  },
  addSetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    gap: 8,
  },
  addSetText: {
    color: '#0d6efd',
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
  },
  addExerciseButton: {
    backgroundColor: '#0d6efd',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    gap: 8,
  },
  addExerciseText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  submitButton: {
    backgroundColor: '#0d6efd',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
  },
  searchOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },
  searchResults: {
    flex: 1,
  },
  searchResult: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchResultNew: {
    backgroundColor: '#f8f9fa',
  },
  searchResultText: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },
  searchResultDate: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#666',
    marginTop: 4,
  },
  calendarContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
  },
  calendarTitle: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  calendarCloseButton: {
    backgroundColor: '#0d6efd',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  calendarCloseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    textAlign: 'center',
  },
});