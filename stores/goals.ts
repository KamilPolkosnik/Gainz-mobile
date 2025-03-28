import { create } from 'zustand';
import { Goal, GoalHistoryEntry } from '@/types/goal';

interface GoalStore {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt' | 'history' | 'completed' | 'completedAt' | 'failed'>) => void;
  updateGoal: (id: string, value: number) => void;
  editGoal: (id: string, data: Partial<Goal>) => void;
  completeGoal: (id: string) => void;
  deleteGoal: (id: string) => void;
  getGoal: (id: string) => Goal | undefined;
  checkDeadlines: () => void;
}

export const useGoalStore = create<GoalStore>((set, get) => ({
  goals: [],
  addGoal: (goal) => {
    const now = new Date().toISOString();
    const newGoal: Goal = {
      ...goal,
      id: Math.random().toString(36).substring(7),
      history: [{
        id: Math.random().toString(36).substring(7),
        value: goal.currentValue,
        date: now,
      }],
      completed: false,
      failed: false,
      createdAt: now,
      updatedAt: now,
    };

    set((state) => ({
      goals: [newGoal, ...state.goals],
    }));
  },
  editGoal: (id, data) => {
    const now = new Date().toISOString();
    set((state) => ({
      goals: state.goals.map((goal) =>
        goal.id === id
          ? {
              ...goal,
              ...data,
              updatedAt: now,
            }
          : goal
      ),
    }));
  },
  updateGoal: (id, value) => {
    const now = new Date().toISOString();
    const historyEntry: GoalHistoryEntry = {
      id: Math.random().toString(36).substring(7),
      value,
      date: now,
    };

    set((state) => {
      const goal = state.goals.find(g => g.id === id);
      if (!goal) return state;

      // Check if goal is already completed
      if (goal.completed) return state;

      // Check if deadline has passed
      const deadlinePassed = new Date(goal.deadline) < new Date();

      // Check if target is reached
      const isTargetReached = goal.targetValue >= goal.currentValue 
        ? value >= goal.targetValue 
        : value <= goal.targetValue;

      // Determine completion status
      const completed = isTargetReached || deadlinePassed;
      const failed = deadlinePassed && !isTargetReached;

      return {
        goals: state.goals.map((g) =>
          g.id === id
            ? {
                ...g,
                currentValue: value,
                updatedAt: now,
                history: [historyEntry, ...g.history],
                completed,
                failed,
                completedAt: completed ? now : undefined,
              }
            : g
        ),
      };
    });
  },
  completeGoal: (id) => {
    const now = new Date().toISOString();
    set((state) => ({
      goals: state.goals.map((g) =>
        g.id === id
          ? {
              ...g,
              completed: true,
              failed: false,
              completedAt: now,
              updatedAt: now,
            }
          : g
      ),
    }));
  },
  deleteGoal: (id) => {
    set((state) => ({
      goals: state.goals.filter((g) => g.id !== id),
    }));
  },
  getGoal: (id) => {
    return get().goals.find((g) => g.id === id);
  },
  checkDeadlines: () => {
    const now = new Date();
    set((state) => ({
      goals: state.goals.map((goal) => {
        if (!goal.completed && new Date(goal.deadline) < now) {
          const targetReached = goal.targetValue >= goal.currentValue 
            ? goal.currentValue >= goal.targetValue 
            : goal.currentValue <= goal.targetValue;

          return {
            ...goal,
            completed: true,
            failed: !targetReached,
            completedAt: now.toISOString(),
            updatedAt: now.toISOString(),
          };
        }
        return goal;
      }),
    }));
  },
}));