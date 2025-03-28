import { useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ImageBackground, ActivityIndicator } from 'react-native';
import { Plus, Dumbbell, Calendar } from 'lucide-react-native';
import { useWorkoutStore } from '@/stores/workouts';
import { Modal } from '@/components/Modal';
import { WorkoutForm } from '@/components/WorkoutForm';
import { WorkoutDetails } from '@/components/WorkoutDetails';
import { colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useFocusEffect } from 'expo-router';

const ITEMS_PER_PAGE = 3;

export default function TrainingScreen() {
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);
  const { workouts, addWorkout, getWorkout, updateWorkout } = useWorkoutStore();
  const [visibleWorkouts, setVisibleWorkouts] = useState<typeof workouts>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const listRef = useRef<FlatList>(null);

  // Reset visible workouts and scroll position when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      setVisibleWorkouts(workouts.slice(0, ITEMS_PER_PAGE));
      // Scroll to top with animation
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, [workouts])
  );

  const handleAddWorkout = (data: { date: string; exercises: any[] }) => {
    addWorkout(data);
    setShowForm(false);
    // Reset visible workouts to show the new one
    setVisibleWorkouts(workouts.slice(0, ITEMS_PER_PAGE));
  };

  const handleEditWorkout = (data: { date: string; exercises: any[] }) => {
    if (selectedWorkoutId) {
      updateWorkout(selectedWorkoutId, data);
      setShowForm(false);
    }
  };

  const handleStartEdit = () => {
    setShowDetails(false);
    setTimeout(() => setShowForm(true), 300);
  };

  const loadMore = useCallback(async () => {
    if (isLoadingMore || visibleWorkouts.length >= workouts.length) return;

    setIsLoadingMore(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const nextWorkouts = workouts.slice(0, visibleWorkouts.length + ITEMS_PER_PAGE);
    setVisibleWorkouts(nextWorkouts);
    setIsLoadingMore(false);
  }, [isLoadingMore, visibleWorkouts.length, workouts]);

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

  const renderWorkout = ({ item: workout }: { item: any }) => (
    <Animated.View entering={FadeIn.delay(200)}>
      <TouchableOpacity
        style={styles.workoutCard}
        onPress={() => {
          setSelectedWorkoutId(workout.id);
          setShowDetails(true);
        }}
      >
        <View style={styles.workoutHeader}>
          <View style={styles.workoutIcon}>
            <Dumbbell size={24} color={colors.training.primary} strokeWidth={2} />
          </View>
          <View style={styles.workoutInfo}>
            <Text style={styles.workoutDate}>
              {formatDate(workout.date)}
            </Text>
            <Text style={styles.workoutExercises}>
              {workout.exercises.length} {workout.exercises.length === 1 ? 'ćwiczenie' : 'ćwiczeń'}
            </Text>
          </View>
        </View>

        <View style={styles.exercisesList}>
          {workout.exercises.map((exercise: any) => (
            <View key={exercise.id} style={styles.exerciseItem}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <View style={styles.setsList}>
                {exercise.sets.map((set: any, index: number) => (
                  <View key={set.id} style={styles.setItem}>
                    <Text style={styles.setText}>
                      {set.reps && `${set.reps} powt.`}
                      {set.weight && ` ${set.weight} kg`}
                      {set.distance && ` ${set.distance} m`}
                      {set.time && ` ${set.time / 60} min`}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderFooter = () => {
    if (!isLoadingMore) return null;

    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator color={colors.training.primary} />
        <Text style={styles.loadingText}>Ładowanie...</Text>
      </View>
    );
  };

  const selectedWorkout = selectedWorkoutId ? getWorkout(selectedWorkoutId) : null;

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop' }}
      style={styles.background}
    >
      <LinearGradient
        colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)', 'rgba(255,255,255,0.95)']}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Treningi</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              setSelectedWorkoutId(null);
              setShowForm(true);
            }}
          >
            <Plus size={24} color="#fff" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <FlatList
          ref={listRef}
          data={visibleWorkouts}
          renderItem={renderWorkout}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Calendar size={48} color={colors.training.primary} strokeWidth={1.5} />
              <Text style={styles.emptyStateTitle}>
                Brak treningów
              </Text>
              <Text style={styles.emptyStateText}>
                Dodaj swój pierwszy trening, aby rozpocząć śledzenie postępów
              </Text>
              <TouchableOpacity
                style={styles.emptyStateButton}
                onPress={() => {
                  setSelectedWorkoutId(null);
                  setShowForm(true);
                }}
              >
                <Text style={styles.emptyStateButtonText}>Dodaj trening</Text>
              </TouchableOpacity>
            </View>
          }
        />

        <Modal visible={showForm} onClose={() => setShowForm(false)}>
          <WorkoutForm 
            onClose={() => setShowForm(false)} 
            onSubmit={selectedWorkoutId ? handleEditWorkout : handleAddWorkout}
            initialData={selectedWorkout ? {
              date: selectedWorkout.date,
              exercises: selectedWorkout.exercises,
            } : undefined}
          />
        </Modal>

        <Modal visible={showDetails} onClose={() => setShowDetails(false)}>
          <WorkoutDetails
            workoutId={selectedWorkoutId}
            onClose={() => setShowDetails(false)}
            onEdit={handleStartEdit}
          />
        </Modal>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Roboto-Bold',
    color: colors.training.primary,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.training.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  list: {
    padding: 20,
  },
  workoutCard: {
    backgroundColor: colors.common.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.common.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  workoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  workoutIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.training.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutDate: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  workoutExercises: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: colors.text.secondary,
  },
  exercisesList: {
    gap: 12,
  },
  exerciseItem: {
    backgroundColor: colors.training.light,
    borderRadius: 12,
    padding: 16,
  },
  exerciseName: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: colors.text.primary,
    marginBottom: 8,
  },
  setsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  setItem: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  setText: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: colors.text.secondary,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateTitle: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: colors.training.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  emptyStateButtonText: {
    color: colors.common.white,
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
  },
  loadingFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: colors.training.primary,
  },
});