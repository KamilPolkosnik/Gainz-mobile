export interface ExerciseSet {
  id: string;
  reps?: number;
  weight?: number;
  distance?: number;
  time?: number;
}

export interface Exercise {
  id: string;
  name: string;
  sets: ExerciseSet[];
}

export interface SavedExercise {
  id: string;
  name: string;
  lastUsed: string;
  lastSets: ExerciseSet[];
}

export interface Workout {
  id: string;
  date: string;
  exercises: Exercise[];
  createdAt: string;
  updatedAt: string;
}