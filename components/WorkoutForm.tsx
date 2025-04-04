import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import {
  X,
  Plus,
  Trash2,
  ChevronDown,
  Search,
  Calendar,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';

// Rozszerzony typ: teraz każda seria (set) ma
// osobny stan tekstowy (np. repsInput) do wpisywania danych.
export interface ExerciseSet {
  id: string;
  reps: number;
  weight: number;
  distance: number;
  time: number;
  repsInput: string;     // Tekst wpisywany przez usera
  weightInput: string;   // Tekst wpisywany przez usera
  distanceInput: string; // Tekst wpisywany przez usera
  timeInput: string;     // Tekst wpisywany przez usera
}

export interface Exercise {
  id: string;
  name: string;
  sets: ExerciseSet[];
}

interface WorkoutFormProps {
  onClose: () => void;
  onSubmit: (data: { date: string; exercises: Exercise[] }) => void;
  initialData?: {
    date: string;
    exercises: Exercise[];
  };
}

/**
 * Komponent formularza dodawania / edycji treningu.
 */
export function WorkoutForm({ onClose, onSubmit, initialData }: WorkoutFormProps) {
  const [date, setDate] = useState<Date>(
    initialData ? new Date(initialData.date) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showExerciseSearch, setShowExerciseSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<number>(-1);

  // Inicjalizujemy ćwiczenia, dbając o to, żeby każda seria
  // miała zarówno pola liczbowe, jak i tekstowe.
  const [exercises, setExercises] = useState<Exercise[]>(
    (initialData?.exercises || []).map((ex) => ({
      ...ex,
      sets: ex.sets.map((s) => ({
        ...s,
        repsInput: s.reps ? String(s.reps).replace('.', ',') : '',
        weightInput: s.weight ? String(s.weight).replace('.', ',') : '',
        distanceInput: s.distance ? String(s.distance).replace('.', ',') : '',
        timeInput: s.time ? String(s.time / 60).replace('.', ',') : '',
      })),
    }))
  );

  // ========================================
  // Poniższa funkcja symuluje pobieranie zapisanych ćwiczeń
  // z jakiegoś store'a. Zamień ją na własne gettery.
  // ========================================
  const getSavedExercises = (query: string) => {
    // Tutaj zastępczo zwracamy "sample".
    // W Twojej aplikacji pewnie pobierasz to ze store.
    const sampleExercises = [
      {
        id: '1',
        name: 'Przysiad ze sztangą',
        lastUsed: new Date().toISOString(),
        lastSets: [
          {
            id: 'set1',
            reps: 10,
            weight: 40,
            distance: 0,
            time: 0,
            repsInput: '10',
            weightInput: '40',
            distanceInput: '',
            timeInput: '',
          },
        ],
      },
    ];
    return sampleExercises.filter((ex) =>
      ex.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  const savedExercises = getSavedExercises(searchQuery);

  // Formatowanie daty do wyświetlania
  const formatDate = (currentDate: Date) => {
    try {
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      return currentDate.toLocaleDateString('pl-PL', options);
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

  /**
   * Dodanie nowego ćwiczenia z pustą serią.
   */
  const addExercise = () => {
    setExercises((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(7),
        name: '',
        sets: [
          {
            id: Math.random().toString(36).substring(7),
            reps: 0,
            weight: 0,
            distance: 0,
            time: 0,
            repsInput: '',
            weightInput: '',
            distanceInput: '',
            timeInput: '',
          },
        ],
      },
    ]);
  };

  const removeExercise = (index: number) => {
    setExercises((prev) => {
      const copy = [...prev];
      copy.splice(index, 1);
      return copy;
    });
  };

  /**
   * Aktualizacja nazwy ćwiczenia.
   */
  const updateExerciseName = (exerciseIndex: number, newName: string) => {
    setExercises((prev) => {
      const copy = [...prev];
      copy[exerciseIndex].name = newName;
      return copy;
    });
  };

  const addSet = (exerciseIndex: number) => {
    setExercises((prev) => {
      const copy = [...prev];
      copy[exerciseIndex].sets.push({
        id: Math.random().toString(36).substring(7),
        reps: 0,
        weight: 0,
        distance: 0,
        time: 0,
        repsInput: '',
        weightInput: '',
        distanceInput: '',
        timeInput: '',
      });
      return copy;
    });
  };

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    setExercises((prev) => {
      const copy = [...prev];
      copy[exerciseIndex].sets.splice(setIndex, 1);
      return copy;
    });
  };

  /**
   * Podczas wpisywania w TextInput przechowujemy dane w polu ...Input
   * żeby user mógł zobaczyć wszystko, łącznie z przecinkiem czy kropką.
   */
  const handleSetInputChange = (
    exerciseIndex: number,
    setIndex: number,
    field: keyof ExerciseSet, // np. 'repsInput', 'weightInput'
    value: string
  ) => {
    setExercises((prev) => {
      const copy = [...prev];
      // Zmieniamy tylko ...Input, nie naruszamy repów jako liczby.
      (copy[exerciseIndex].sets[setIndex] as any)[field] = value;
      return copy;
    });
  };

  /**
   * Na blur parsujemy tekst do liczby i zapisujemy w polu `reps`/`weight`/`distance`/`time`.
   */
  const handleSetInputBlur = (
    exerciseIndex: number,
    setIndex: number,
    field: keyof ExerciseSet // np. 'reps' | 'weight' | 'distance' | 'time'
  ) => {
    setExercises((prev) => {
      const copy = [...prev];

      // Ustalamy, który klucz Input jest powiązany z docelowym field
      // np. jeśli field to 'reps', to klucz input to 'repsInput'.
      let inputField: keyof ExerciseSet;
      switch (field) {
        case 'reps':
          inputField = 'repsInput';
          break;
        case 'weight':
          inputField = 'weightInput';
          break;
        case 'distance':
          inputField = 'distanceInput';
          break;
        case 'time':
          inputField = 'timeInput';
          break;
        default:
          inputField = 'repsInput';
      }

      const textValue = copy[exerciseIndex].sets[setIndex][inputField] as string;
      // Zamieniamy przecinek na kropkę, parseFloat (jeśli się nie uda, = 0)
      let numValue = parseFloat(textValue.replace(',', '.'));
      if (isNaN(numValue)) {
        numValue = 0;
      }

      // Jeśli to time, zamieniamy minuty na sekundy
      if (field === 'time') {
        copy[exerciseIndex].sets[setIndex][field] = numValue * 60;
      } else {
        copy[exerciseIndex].sets[setIndex][field] = numValue;
      }

      return copy;
    });
  };

  /**
   * Na potrzeby wyświetlania czasu (w minutach) w polu input
   */
  const getTimeInMinutes = (seconds: number) => {
    if (!seconds) return '';
    const minutes = seconds / 60;
    // zamieniamy kropkę na przecinek, by user widział np. "2,5"
    return String(minutes).replace('.', ',');
  };

  /**
   * Finalne przetworzenie i walidacja przed zapisem.
   * Gdy user kliknie "Zapisz", ponownie parsujemy (na wszelki wypadek).
   */
  const handleSubmit = () => {
    // Sprawdzamy, czy wszystkie ćwiczenia mają nazwę
    if (exercises.some((exercise) => !exercise.name.trim())) {
      alert('Wszystkie ćwiczenia muszą mieć nazwę');
      return;
    }

    // Jeszcze raz parse wszystkiego w razie, gdyby user nie wywołał blur
    const finalExercises = exercises.map((exercise) => {
      const parsedSets = exercise.sets.map((set) => {
        // reps
        let reps = parseFloat(set.repsInput.replace(',', '.'));
        if (isNaN(reps)) reps = 0;

        // weight
        let weight = parseFloat(set.weightInput.replace(',', '.'));
        if (isNaN(weight)) weight = 0;

        // distance
        let distance = parseFloat(set.distanceInput.replace(',', '.'));
        if (isNaN(distance)) distance = 0;

        // time
        let time = parseFloat(set.timeInput.replace(',', '.'));
        if (isNaN(time)) time = 0;
        // Zamiana minut -> sekundy
        time = time * 60;

        return {
          ...set,
          reps,
          weight,
          distance,
          time,
        };
      });

      return {
        ...exercise,
        sets: parsedSets,
      };
    });

    onSubmit({
      date: date.toISOString(),
      exercises: finalExercises,
    });
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>
          {initialData ? 'Edytuj trening' : 'Nowy trening'}
        </Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {/* TREŚĆ */}
      <ScrollView style={styles.content}>
        {/* DATA */}
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <View style={styles.dateButtonContent}>
            <Calendar size={20} color="#0d6efd" />
            <Text style={styles.dateButtonText}>{formatDate(date)}</Text>
            <ChevronDown size={20} color="#0d6efd" />
          </View>
        </TouchableOpacity>

        {/* LISTA ĆWICZEŃ */}
        <View style={styles.exercises}>
          {exercises.map((exercise, exerciseIndex) => (
            <View key={exercise.id} style={styles.exercise}>
              <View style={styles.exerciseHeader}>
                <View style={styles.exerciseNameContainer}>
                  <TextInput
                    style={styles.exerciseNameInput}
                    placeholder="Nazwa ćwiczenia"
                    value={exercise.name}
                    onChangeText={(text) => updateExerciseName(exerciseIndex, text)}
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

              {/* SERIE */}
              {exercise.sets.map((set, setIndex) => (
                <View key={set.id} style={styles.set}>
                  <Text style={styles.setNumber}>Seria {setIndex + 1}</Text>
                  <View style={styles.setInputsContainer}>
                    <View style={styles.setInputsRow}>
                      {/* POWTÓRZENIA */}
                      <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Powt.</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="0"
                          // 'decimal-pad' pozwala na wprowadzenie przecinka/kropki na iOS;
                          // w Androidzie może się pojawić kropka, zależy od ustawień językowych.
                          keyboardType="decimal-pad"
                          value={set.repsInput}
                          // Tylko aktualizujemy tekst w stanie, bez parsowania
                          onChangeText={(text) =>
                            handleSetInputChange(exerciseIndex, setIndex, 'repsInput', text)
                          }
                          // Dopiero w onBlur parsujemy i zapisujemy w `reps`
                          onBlur={() => handleSetInputBlur(exerciseIndex, setIndex, 'reps')}
                        />
                      </View>
                      {/* KG */}
                      <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Kg</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="0"
                          keyboardType="decimal-pad"
                          value={set.weightInput}
                          onChangeText={(text) =>
                            handleSetInputChange(
                              exerciseIndex,
                              setIndex,
                              'weightInput',
                              text
                            )
                          }
                          onBlur={() => handleSetInputBlur(exerciseIndex, setIndex, 'weight')}
                        />
                      </View>
                    </View>

                    <View style={styles.setInputsRow}>
                      {/* DYSTANS */}
                      <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Dystans (m)</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="0"
                          keyboardType="decimal-pad"
                          value={set.distanceInput}
                          onChangeText={(text) =>
                            handleSetInputChange(
                              exerciseIndex,
                              setIndex,
                              'distanceInput',
                              text
                            )
                          }
                          onBlur={() =>
                            handleSetInputBlur(exerciseIndex, setIndex, 'distance')
                          }
                        />
                      </View>
                      {/* CZAS (MIN) */}
                      <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Czas (min)</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="0"
                          keyboardType="decimal-pad"
                          value={set.timeInput}
                          onChangeText={(text) =>
                            handleSetInputChange(exerciseIndex, setIndex, 'timeInput', text)
                          }
                          onBlur={() => handleSetInputBlur(exerciseIndex, setIndex, 'time')}
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

              {/* DODAJ SERIĘ */}
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

        {/* DODAJ ĆWICZENIE */}
        <TouchableOpacity style={styles.addExerciseButton} onPress={addExercise}>
          <Plus size={24} color="#fff" />
          <Text style={styles.addExerciseText}>Dodaj ćwiczenie</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* OVERLAY WYSZUKIWANIA ZAPISANYCH ĆWICZEŃ */}
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
                    // Jeżeli użytkownik wybiera ćwiczenie z historii,
                    // możesz też chcieć wypełnić sety podobnie jak w initState.
                    // Tu tylko pokazuję prosty przykład:
                    setExercises((prev) => {
                      const copy = [...prev];
                      copy[selectedExerciseIndex].name = exercise.name;
                      // Jeżeli chcesz od razu wstawić sety:
                      // copy[selectedExerciseIndex].sets = exercise.lastSets;
                      return copy;
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
                    setExercises((prev) => {
                      const copy = [...prev];
                      copy[selectedExerciseIndex].name = searchQuery;
                      return copy;
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

      {/* STOPKA Z PRZYCISKIEM 'ZAPISZ' */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>
            {initialData ? 'Zapisz zmiany' : 'Dodaj trening'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* MODAL WYBORU DATY */}
      {showDatePicker && (
        <View style={StyleSheet.absoluteFill}>
          <View style={styles.datePickerContainer}>
            <CalendarPicker
              onDateChange={(newDate) => handleDateChange(newDate?.toDate())}
            />
            <TouchableOpacity
              style={styles.closeDatePicker}
              onPress={() => setShowDatePicker(false)}
            >
              <Text style={styles.closeDatePickerText}>Zamknij</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
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
  inputWrapper: { flex: 1 },
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
  datePickerContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  closeDatePicker: {
    backgroundColor: '#0d6efd',
    padding: 16,
    borderRadius: 12,
    margin: 20,
  },
  closeDatePickerText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    textAlign: 'center',
  },
});
