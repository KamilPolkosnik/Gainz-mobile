import { create } from 'zustand';
import { Measurement } from '@/types/measurement';

interface MeasurementStore {
  measurements: Measurement[];
  addMeasurement: (measurement: Omit<Measurement, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateMeasurement: (id: string, measurement: Partial<Measurement>) => void;
  deleteMeasurement: (id: string) => void;
  getMeasurement: (id: string) => Measurement | undefined;
}

export const useMeasurementStore = create<MeasurementStore>((set, get) => ({
  measurements: [],
  addMeasurement: (measurement) => {
    const now = new Date().toISOString();
    const newMeasurement: Measurement = {
      ...measurement,
      id: Math.random().toString(36).substring(7),
      createdAt: now,
      updatedAt: now,
    };

    set((state) => ({
      measurements: [newMeasurement, ...state.measurements],
    }));
  },
  updateMeasurement: (id, measurement) => {
    const now = new Date().toISOString();
    set((state) => ({
      measurements: state.measurements.map((m) =>
        m.id === id
          ? { ...m, ...measurement, updatedAt: now }
          : m
      ),
    }));
  },
  deleteMeasurement: (id) => {
    set((state) => ({
      measurements: state.measurements.filter((m) => m.id !== id),
    }));
  },
  getMeasurement: (id) => {
    return get().measurements.find((m) => m.id === id);
  },
}));