export type PatientStatus = 'Active' | 'Scheduled' | 'Completed' | 'Cancelled';

export interface Patient {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  age: number;
  gender: 'Male' | 'Female';
  bloodType: string;
  diagnosis: string;
  doctor: string;
  lastVisit: string;
  status: PatientStatus;
  amount: number;
}
