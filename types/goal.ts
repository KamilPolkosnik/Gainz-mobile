export interface GoalHistoryEntry {
  id: string;
  value: number;
  date: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  deadline: string;
  history: GoalHistoryEntry[];
  completed: boolean;
  failed: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}