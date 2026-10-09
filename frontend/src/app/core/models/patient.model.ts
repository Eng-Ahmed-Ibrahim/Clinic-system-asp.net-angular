export type PatientStatus = 'Active' | 'Scheduled' | 'Completed' | 'Cancelled';

export interface Patient {
  id: number
  nationalId: string
  firstName: string
  lastName: string
  gender: string
  dateOfBirth: string
  phoneNumber: string
  emergencyPhone: string
  address: string
  bloodGroup: string
  medicalHistory: any
}