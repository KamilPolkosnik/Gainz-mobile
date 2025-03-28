import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, CreditCard as Edit2, Trash2 } from 'lucide-react-native';
import { useWorkoutStore } from '@/stores/workouts';
import { Modal } from '@/components/Modal';
import { WorkoutForm } from '@/components/WorkoutForm';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';

export default function WorkoutDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const { getWorkout, updateWorkout, deleteWorkout, saveExercise } = useWorkoutStore();
  const workout = getWorkout(id as string);

  if (!workout) {
    return null;
  }

  const handleEdit = (data: { date: string; exercises: any[] }) => {
    data.exercises.forEach((exercise) => {
      saveExercise(exercise);
    });
    
    updateWorkout(workout.id, data);
    setShowEditForm(false);
  };

  const handleDelete = () => {
    deleteWorkout(workout.id);
    router.back();
  };

  const renderSetValue = (value: number | undefined, unit: string) => {
    if (!value || value === 0) return null;
    return <Text style={styles.setValue}>{value} {unit}</Text>;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>
          Trening {new Date(workout.date).toLocaleDateString('pl-PL')}
        </Text>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setShowEditForm(true)}
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

      <ScrollView style={styles.content}>
        {workout.exercises.map((exercise) => (
          <View key={exercise.id} style={styles.exercise}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <View style={styles.sets}>
              {exercise.sets.map((set, index) => {
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
                      {renderSetValue(set.time, "s")}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal visible={showEditForm} onClose={() => setShowEditForm(false)}>
        <WorkoutForm
          onClose={() => setShowEditForm(false)}
          onSubmit={handleEdit}
          initialData={{
            date: workout.date,
            exercises: workout.exercises,
          }}
        />
      </Modal>

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
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    flex: 1,
    textAlign: 'center',
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
    flex: 1,
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