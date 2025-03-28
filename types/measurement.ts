export interface Measurement {
  id: string;
  date: string;
  weight: number;
  shoulders: number;
  chest: number;
  biceps: number;
  forearm: number;
  waist: number;
  abdomen: number;
  thigh: number;
  calf: number;
  photos: {
    front?: string;
    side?: string;
    back?: string;
  };
  createdAt: string;
  updatedAt: string;
}