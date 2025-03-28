import { Workout } from '@/types/workout';
import { Measurement } from '@/types/measurement';
import { Goal } from '@/types/goal';

// Mock workouts
export const mockWorkouts: Workout[] = [
  {
    id: 'workout1',
    date: new Date(2024, 2, 25).toISOString(),
    exercises: [
      {
        id: 'ex1',
        name: 'Wyciskanie sztangi na ławce płaskiej',
        sets: [
          { id: 'set1', reps: 12, weight: 60 },
          { id: 'set2', reps: 10, weight: 65 },
          { id: 'set3', reps: 8, weight: 70 },
        ],
      },
      {
        id: 'ex2',
        name: 'Przysiady ze sztangą',
        sets: [
          { id: 'set4', reps: 12, weight: 80 },
          { id: 'set5', reps: 10, weight: 85 },
          { id: 'set6', reps: 8, weight: 90 },
        ],
      },
    ],
    createdAt: new Date(2024, 2, 25).toISOString(),
    updatedAt: new Date(2024, 2, 25).toISOString(),
  },
  {
    id: 'workout2',
    date: new Date(2024, 2, 23).toISOString(),
    exercises: [
      {
        id: 'ex3',
        name: 'Wiosłowanie sztangą',
        sets: [
          { id: 'set7', reps: 12, weight: 50 },
          { id: 'set8', reps: 10, weight: 55 },
          { id: 'set9', reps: 8, weight: 60 },
        ],
      },
    ],
    createdAt: new Date(2024, 2, 23).toISOString(),
    updatedAt: new Date(2024, 2, 23).toISOString(),
  },
  {
    id: 'workout3',
    date: new Date(2024, 2, 21).toISOString(),
    exercises: [
      {
        id: 'ex4',
        name: 'Martwy ciąg',
        sets: [
          { id: 'set10', reps: 10, weight: 100 },
          { id: 'set11', reps: 8, weight: 110 },
          { id: 'set12', reps: 6, weight: 120 },
        ],
      },
    ],
    createdAt: new Date(2024, 2, 21).toISOString(),
    updatedAt: new Date(2024, 2, 21).toISOString(),
  },
  {
    id: 'workout4',
    date: new Date(2024, 2, 19).toISOString(),
    exercises: [
      {
        id: 'ex5',
        name: 'OHP',
        sets: [
          { id: 'set13', reps: 12, weight: 40 },
          { id: 'set14', reps: 10, weight: 45 },
          { id: 'set15', reps: 8, weight: 50 },
        ],
      },
    ],
    createdAt: new Date(2024, 2, 19).toISOString(),
    updatedAt: new Date(2024, 2, 19).toISOString(),
  },
  {
    id: 'workout5',
    date: new Date(2024, 2, 17).toISOString(),
    exercises: [
      {
        id: 'ex6',
        name: 'Podciąganie na drążku',
        sets: [
          { id: 'set16', reps: 10 },
          { id: 'set17', reps: 8 },
          { id: 'set18', reps: 6 },
        ],
      },
    ],
    createdAt: new Date(2024, 2, 17).toISOString(),
    updatedAt: new Date(2024, 2, 17).toISOString(),
  },
  {
    id: 'workout6',
    date: new Date(2024, 2, 15).toISOString(),
    exercises: [
      {
        id: 'ex7',
        name: 'Pompki na poręczach',
        sets: [
          { id: 'set19', reps: 12 },
          { id: 'set20', reps: 10 },
          { id: 'set21', reps: 8 },
        ],
      },
    ],
    createdAt: new Date(2024, 2, 15).toISOString(),
    updatedAt: new Date(2024, 2, 15).toISOString(),
  },
  {
    id: 'workout7',
    date: new Date(2024, 2, 13).toISOString(),
    exercises: [
      {
        id: 'ex8',
        name: 'Przysiad bułgarski',
        sets: [
          { id: 'set22', reps: 12, weight: 20 },
          { id: 'set23', reps: 10, weight: 25 },
          { id: 'set24', reps: 8, weight: 30 },
        ],
      },
    ],
    createdAt: new Date(2024, 2, 13).toISOString(),
    updatedAt: new Date(2024, 2, 13).toISOString(),
  },
  {
    id: 'workout8',
    date: new Date(2024, 2, 11).toISOString(),
    exercises: [
      {
        id: 'ex9',
        name: 'Wyciskanie hantli',
        sets: [
          { id: 'set25', reps: 12, weight: 24 },
          { id: 'set26', reps: 10, weight: 26 },
          { id: 'set27', reps: 8, weight: 28 },
        ],
      },
    ],
    createdAt: new Date(2024, 2, 11).toISOString(),
    updatedAt: new Date(2024, 2, 11).toISOString(),
  },
  {
    id: 'workout9',
    date: new Date(2024, 2, 9).toISOString(),
    exercises: [
      {
        id: 'ex10',
        name: 'Uginanie ramion ze sztangą',
        sets: [
          { id: 'set28', reps: 12, weight: 25 },
          { id: 'set29', reps: 10, weight: 27.5 },
          { id: 'set30', reps: 8, weight: 30 },
        ],
      },
    ],
    createdAt: new Date(2024, 2, 9).toISOString(),
    updatedAt: new Date(2024, 2, 9).toISOString(),
  },
  {
    id: 'workout10',
    date: new Date(2024, 2, 7).toISOString(),
    exercises: [
      {
        id: 'ex11',
        name: 'Wyciskanie francuskie',
        sets: [
          { id: 'set31', reps: 12, weight: 20 },
          { id: 'set32', reps: 10, weight: 22.5 },
          { id: 'set33', reps: 8, weight: 25 },
        ],
      },
    ],
    createdAt: new Date(2024, 2, 7).toISOString(),
    updatedAt: new Date(2024, 2, 7).toISOString(),
  },
  {
    id: 'workout11',
    date: new Date(2024, 2, 5).toISOString(),
    exercises: [
      {
        id: 'ex12',
        name: 'Wznosy bokiem',
        sets: [
          { id: 'set34', reps: 12, weight: 8 },
          { id: 'set35', reps: 10, weight: 10 },
          { id: 'set36', reps: 8, weight: 12 },
        ],
      },
    ],
    createdAt: new Date(2024, 2, 5).toISOString(),
    updatedAt: new Date(2024, 2, 5).toISOString(),
  },
  {
    id: 'workout12',
    date: new Date(2024, 2, 3).toISOString(),
    exercises: [
      {
        id: 'ex13',
        name: 'Plank',
        sets: [
          { id: 'set37', time: 60 },
          { id: 'set38', time: 45 },
          { id: 'set39', time: 30 },
        ],
      },
    ],
    createdAt: new Date(2024, 2, 3).toISOString(),
    updatedAt: new Date(2024, 2, 3).toISOString(),
  },
];

// Mock measurements
export const mockMeasurements: Measurement[] = Array.from({ length: 12 }, (_, i) => ({
  id: `measurement${i + 1}`,
  date: new Date(2024, 2, 25 - i * 2).toISOString(),
  weight: 80 - i * 0.5,
  shoulders: 120 + i * 0.2,
  chest: 100 + i * 0.2,
  biceps: 38 + i * 0.1,
  forearm: 30 + i * 0.1,
  waist: 85 - i * 0.3,
  abdomen: 88 - i * 0.3,
  thigh: 60 + i * 0.1,
  calf: 38 + i * 0.1,
  photos: {},
  createdAt: new Date(2024, 2, 25 - i * 2).toISOString(),
  updatedAt: new Date(2024, 2, 25 - i * 2).toISOString(),
}));

// Mock goals
export const mockGoals: Goal[] = [
  {
    id: 'goal1',
    title: 'Zwiększenie wagi w wyciskaniu sztangi',
    description: 'Cel: osiągnięcie 100kg w wyciskaniu sztangi na ławce płaskiej',
    currentValue: 70,
    targetValue: 100,
    unit: 'kg',
    deadline: new Date(2024, 5, 1).toISOString(),
    history: [
      { id: 'history1', value: 70, date: new Date(2024, 2, 25).toISOString() },
    ],
    completed: false,
    failed: false,
    createdAt: new Date(2024, 2, 25).toISOString(),
    updatedAt: new Date(2024, 2, 25).toISOString(),
  },
  {
    id: 'goal2',
    title: 'Redukcja wagi',
    description: 'Cel: osiągnięcie wagi 75kg przy zachowaniu masy mięśniowej',
    currentValue: 80,
    targetValue: 75,
    unit: 'kg',
    deadline: new Date(2024, 5, 1).toISOString(),
    history: [
      { id: 'history2', value: 80, date: new Date(2024, 2, 25).toISOString() },
    ],
    completed: false,
    failed: false,
    createdAt: new Date(2024, 2, 25).toISOString(),
    updatedAt: new Date(2024, 2, 25).toISOString(),
  },
  {
    id: 'goal3',
    title: 'Zwiększenie obwodu bicepsa',
    description: 'Cel: osiągnięcie 42cm obwodu bicepsa',
    currentValue: 38,
    targetValue: 42,
    unit: 'cm',
    deadline: new Date(2024, 6, 1).toISOString(),
    history: [
      { id: 'history3', value: 38, date: new Date(2024, 2, 25).toISOString() },
    ],
    completed: false,
    failed: false,
    createdAt: new Date(2024, 2, 25).toISOString(),
    updatedAt: new Date(2024, 2, 25).toISOString(),
  },
  {
    id: 'goal4',
    title: 'Zwiększenie ilości podciągnięć',
    description: 'Cel: wykonanie 20 podciągnięć na drążku',
    currentValue: 12,
    targetValue: 20,
    unit: 'powtórzeń',
    deadline: new Date(2024, 5, 15).toISOString(),
    history: [
      { id: 'history4', value: 12, date: new Date(2024, 2, 25).toISOString() },
    ],
    completed: false,
    failed: false,
    createdAt: new Date(2024, 2, 25).toISOString(),
    updatedAt: new Date(2024, 2, 25).toISOString(),
  },
  {
    id: 'goal5',
    title: 'Zwiększenie martwego ciągu',
    description: 'Cel: osiągnięcie 180kg w martwym ciągu',
    currentValue: 140,
    targetValue: 180,
    unit: 'kg',
    deadline: new Date(2024, 7, 1).toISOString(),
    history: [
      { id: 'history5', value: 140, date: new Date(2024, 2, 25).toISOString() },
    ],
    completed: false,
    failed: false,
    createdAt: new Date(2024, 2, 25).toISOString(),
    updatedAt: new Date(2024, 2, 25).toISOString(),
  },
  {
    id: 'goal6',
    title: 'Redukcja obwodu talii',
    description: 'Cel: zmniejszenie obwodu talii do 80cm',
    currentValue: 85,
    targetValue: 80,
    unit: 'cm',
    deadline: new Date(2024, 5, 1).toISOString(),
    history: [
      { id: 'history6', value: 85, date: new Date(2024, 2, 25).toISOString() },
    ],
    completed: false,
    failed: false,
    createdAt: new Date(2024, 2, 25).toISOString(),
    updatedAt: new Date(2024, 2, 25).toISOString(),
  },
  {
    id: 'goal7',
    title: 'Zwiększenie przysiadu',
    description: 'Cel: osiągnięcie 140kg w przysiadzie',
    currentValue: 100,
    targetValue: 140,
    unit: 'kg',
    deadline: new Date(2024, 6, 15).toISOString(),
    history: [
      { id: 'history7', value: 100, date: new Date(2024, 2, 25).toISOString() },
    ],
    completed: false,
    failed: false,
    createdAt: new Date(2024, 2, 25).toISOString(),
    updatedAt: new Date(2024, 2, 25).toISOString(),
  },
  {
    id: 'goal8',
    title: 'Zwiększenie OHP',
    description: 'Cel: osiągnięcie 70kg w wyciskaniu żołnierskim',
    currentValue: 50,
    targetValue: 70,
    unit: 'kg',
    deadline: new Date(2024, 7, 1).toISOString(),
    history: [
      { id: 'history8', value: 50, date: new Date(2024, 2, 25).toISOString() },
    ],
    completed: false,
    failed: false,
    createdAt: new Date(2024, 2, 25).toISOString(),
    updatedAt: new Date(2024, 2, 25).toISOString(),
  },
  {
    id: 'goal9',
    title: 'Zwiększenie pompek na poręczach',
    description: 'Cel: wykonanie 25 pompek na poręczach',
    currentValue: 15,
    targetValue: 25,
    unit: 'powtórzeń',
    deadline: new Date(2024, 5, 15).toISOString(),
    history: [
      { id: 'history9', value: 15, date: new Date(2024, 2, 25).toISOString() },
    ],
    completed: false,
    failed: false,
    createdAt: new Date(2024, 2, 25).toISOString(),
    updatedAt: new Date(2024, 2, 25).toISOString(),
  },
  {
    id: 'goal10',
    title: 'Zwiększenie obwodu klatki piersiowej',
    description: 'Cel: osiągnięcie 110cm obwodu klatki piersiowej',
    currentValue: 100,
    targetValue: 110,
    unit: 'cm',
    deadline: new Date(2024, 8, 1).toISOString(),
    history: [
      { id: 'history10', value: 100, date: new Date(2024, 2, 25).toISOString() },
    ],
    completed: false,
    failed: false,
    createdAt: new Date(2024, 2, 25).toISOString(),
    updatedAt: new Date(2024, 2, 25).toISOString(),
  },
  {
    id: 'goal11',
    title: 'Utrzymanie planku',
    description: 'Cel: utrzymanie planku przez 3 minuty',
    currentValue: 90,
    targetValue: 180,
    unit: 'sekund',
    deadline: new Date(2024, 4, 15).toISOString(),
    history: [
      { id: 'history11', value: 90, date: new Date(2024, 2, 25).toISOString() },
    ],
    completed: false,
    failed: false,
    createdAt: new Date(2024, 2, 25).toISOString(),
    updatedAt: new Date(2024, 2, 25).toISOString(),
  },
  {
    id: 'goal12',
    title: 'Zwiększenie obwodu ud',
    description: 'Cel: osiągnięcie 65cm obwodu uda',
    currentValue: 60,
    targetValue: 65,
    unit: 'cm',
    deadline: new Date(2024, 6, 1).toISOString(),
    history: [
      { id: 'history12', value: 60, date: new Date(2024, 2, 25).toISOString() },
    ],
    completed: false,
    failed: false,
    createdAt: new Date(2024, 2, 25).toISOString(),
    updatedAt: new Date(2024, 2, 25).toISOString(),
  },
];

// Function to initialize stores with mock data
export const initializeMockData = () => {
  // Import this function in your root layout and call it after the stores are ready
  const { addWorkout } = require('@/stores/workouts').useWorkoutStore.getState();
  const { addMeasurement } = require('@/stores/measurements').useMeasurementStore.getState();
  const { addGoal } = require('@/stores/goals').useGoalStore.getState();

  // Add workouts
  mockWorkouts.forEach(workout => {
    addWorkout({
      date: workout.date,
      exercises: workout.exercises,
    });
  });

  // Add measurements
  mockMeasurements.forEach(measurement => {
    addMeasurement({
      date: measurement.date,
      weight: measurement.weight,
      shoulders: measurement.shoulders,
      chest: measurement.chest,
      biceps: measurement.biceps,
      forearm: measurement.forearm,
      waist: measurement.waist,
      abdomen: measurement.abdomen,
      thigh: measurement.thigh,
      calf: measurement.calf,
      photos: measurement.photos,
    });
  });

  // Add goals
  mockGoals.forEach(goal => {
    addGoal({
      title: goal.title,
      description: goal.description,
      currentValue: goal.currentValue,
      targetValue: goal.targetValue,
      unit: goal.unit,
      deadline: goal.deadline,
    });
  });
};