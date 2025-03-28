import { create } from 'zustand';
import { Workout, Exercise, SavedExercise } from '@/types/workout';

interface WorkoutStore {
  workouts: Workout[];
  savedExercises: SavedExercise[];
  addWorkout: (workout: Omit<Workout, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateWorkout: (id: string, workout: Partial<Workout>) => void;
  deleteWorkout: (id: string) => void;
  getWorkout: (id: string) => Workout | undefined;
  saveExercise: (exercise: Exercise) => void;
  getSavedExercises: (search?: string) => SavedExercise[];
}

export const useWorkoutStore = create<WorkoutStore>((set, get) => ({
  workouts: [],
  savedExercises: [],
  addWorkout: (workout) => {
    const now = new Date().toISOString();
    const newWorkout: Workout = {
      ...workout,
      id: Math.random().toString(36).substring(7),
      createdAt: now,
      updatedAt: now,
    };

    // Save exercises for future use
    workout.exercises.forEach((exercise) => {
      get().saveExercise(exercise);
    });

    set((state) => ({
      workouts: [newWorkout, ...state.workouts],
    }));
  },
  updateWorkout: (id, workout) => {
    set((state) => ({
      workouts: state.workouts.map((w) =>
        w.id === id
          ? { ...w, ...workout, updatedAt: new Date().toISOString() }
          : w
      ),
    }));
  },
  deleteWorkout: (id) => {
    set((state) => ({
      workouts: state.workouts.filter((w) => w.id !== id),
    }));
  },
  getWorkout: (id) => {
    return get().workouts.find((w) => w.id === id);
  },
  saveExercise: (exercise) => {
    set((state) => {
      const existingIndex = state.savedExercises.findIndex(
        (e) => e.name.toLowerCase() === exercise.name.toLowerCase()
      );

      const now = new Date().toISOString();
      const updatedExercise: SavedExercise = {
        id: exercise.id,
        name: exercise.name,
        lastUsed: now,
        lastSets: exercise.sets,
      };

      if (existingIndex >= 0) {
        const newSavedExercises = [...state.savedExercises];
        newSavedExercises[existingIndex] = updatedExercise;
        return { savedExercises: newSavedExercises };
      }

      return {
        savedExercises: [...state.savedExercises, updatedExercise],
      };
    });
  },
  getSavedExercises: (search) => {
    const exercises = get().savedExercises;
    if (!search) return exercises;

    const searchLower = search.toLowerCase();
    return exercises.filter((e) =>
      e.name.toLowerCase().includes(searchLower)
    );
  },
}));