import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { ArrowLeft, CreditCard as Edit2, Trash2 } from 'lucide-react-native';
import { useWorkoutStore } from '@/stores/workouts';
import { ConfirmationDialog } from './ConfirmationDialog';
import { useState } from 'react';

interface WorkoutDetailsProps {
  workoutId: string | null;
  onClose: () => void;
  onEdit: () => void;
}

export function WorkoutDetails({ workoutId, onClose, onEdit }: WorkoutDetailsProps) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const { getWorkout, deleteWorkout } = useWorkoutStore();

  const workout = workoutId ? getWorkout(workoutId) : null;

  if (!workout) {
    return null;
  }

  const handleDelete = () => {
    deleteWorkout(workout.id);
    setShowDeleteConfirmation(false);
    onClose();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('pl-PL', options);
  };

  const renderSetValue = (value: number | undefined, unit: string) => {
    if (!value || value === 0) return null;
    if (unit === 'min') {
      value = value / 60; // Convert seconds to minutes
    }
    return <Text style={styles.setValue}>{value} {unit}</Text>;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>
          Trening {formatDate(workout.date)}
        </Text>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={onEdit}
          >
            <Edit2 size={20} color="#0d6efd" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.deleteButton} 
            onPress={() => setShowDeleteConfirmation(true)}
          >
            <Trash2 size={20} color="#dc3545" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={workout.exercises}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        renderItem={({ item: exercise }) => (
          <View style={styles.exercise}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <View style={styles.sets}>
              {exercise.sets.map((set: any, index: number) => {
                const hasValues = (set.reps && set.reps > 0) || 
                                (set.weight && set.weight > 0) || 
                                (set.distance && set.distance > 0) || 
                                (set.time && set.time > 0);
                
                if (!hasValues) return null;

                return (
                  <View key={set.id} style={styles.set}>
                    <Text style={styles.setNumber}>Seria {index + 1}</Text>
                    <View style={styles.setDetails}>
                      {renderSetValue(set.reps, "powt.")}
                      {renderSetValue(set.weight, "kg")}
                      {renderSetValue(set.distance, "m")}
                      {renderSetValue(set.time, "min")}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      />

      <ConfirmationDialog
        visible={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={handleDelete}
        title="Usuń trening"
        message="Czy na pewno chcesz usunąć ten trening? Tej operacji nie można cofnąć."
      />
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
    flex: 1,
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    textAlign: 'center',
    marginHorizontal: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
  },
  editButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
  },
  content: {
    padding: 20,
  },
  exercise: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  exerciseName: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    marginBottom: 12,
  },
  sets: {
    gap: 8,
  },
  set: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  setNumber: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: '#666',
  },
  setDetails: {
    flexDirection: 'row',
    gap: 12,
  },
  setValue: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
  },
});