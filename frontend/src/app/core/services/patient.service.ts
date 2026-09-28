import { Injectable, signal, computed } from '@angular/core';
import { Patient, PatientStatus } from '../models/patient.model';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private readonly initialPatients: Patient[] = [
    {
      id: 'PT-8941',
      name: 'Sarah Jenkins',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      email: 'sarah.jenkins@example.com',
      phone: '+1 (555) 234-8901',
      age: 34,
      gender: 'Female',
      bloodType: 'A+',
      diagnosis: 'Hypertension Stage 1',
      doctor: 'Dr. Ahmed Ebrahim',
      lastVisit: '2026-09-26',
      status: 'Active',
      amount: 150,
    },
    {
      id: 'PT-8942',
      name: 'Michael Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      email: 'm.chen@example.com',
      phone: '+1 (555) 345-6712',
      age: 48,
      gender: 'Male',
      bloodType: 'O+',
      diagnosis: 'Type 2 Diabetes Routine Check',
      doctor: 'Dr. Emily Carter',
      lastVisit: '2026-09-25',
      status: 'Scheduled',
      amount: 220,
    },
    {
      id: 'PT-8943',
      name: 'Layla Al-Mansoor',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
      email: 'layla.mansoor@example.com',
      phone: '+971 50 123 4567',
      age: 29,
      gender: 'Female',
      bloodType: 'B+',
      diagnosis: 'Migraine & Tension Headache',
      doctor: 'Dr. Ahmed Ebrahim',
      lastVisit: '2026-09-24',
      status: 'Completed',
      amount: 180,
    },
    {
      id: 'PT-8944',
      name: 'David Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      email: 'david.r@example.com',
      phone: '+1 (555) 876-5432',
      age: 56,
      gender: 'Male',
      bloodType: 'AB-',
      diagnosis: 'Coronary Artery Follow-up',
      doctor: 'Dr. Ahmed Ebrahim',
      lastVisit: '2026-09-22',
      status: 'Active',
      amount: 350,
    },
    {
      id: 'PT-8945',
      name: 'Fatima Zahra',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
      email: 'fatima.zahra@example.com',
      phone: '+20 102 345 6789',
      age: 41,
      gender: 'Female',
      bloodType: 'O-',
      diagnosis: 'Thyroid Ultrasound Review',
      doctor: 'Dr. Marcus Vance',
      lastVisit: '2026-09-20',
      status: 'Completed',
      amount: 195,
    },
    {
      id: 'PT-8946',
      name: 'Alexander Novak',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
      email: 'alex.novak@example.com',
      phone: '+1 (555) 432-1098',
      age: 62,
      gender: 'Male',
      bloodType: 'A-',
      diagnosis: 'Cardiac Arrhythmia Holter Monitoring',
      doctor: 'Dr. Ahmed Ebrahim',
      lastVisit: '2026-09-18',
      status: 'Scheduled',
      amount: 400,
    },
    {
      id: 'PT-8947',
      name: 'Nour El-Din',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      email: 'nour.din@example.com',
      phone: '+20 111 987 6543',
      age: 26,
      gender: 'Female',
      bloodType: 'B-',
      diagnosis: 'Seasonal Bronchitis Treatment',
      doctor: 'Dr. Emily Carter',
      lastVisit: '2026-09-15',
      status: 'Cancelled',
      amount: 110,
    },
  ];

  readonly patients = signal<Patient[]>(this.initialPatients);

  readonly totalCount = computed(() => this.patients().length);
  readonly activeCount = computed(() => this.patients().filter((p) => p.status === 'Active').length);
  readonly scheduledCount = computed(() => this.patients().filter((p) => p.status === 'Scheduled').length);
  readonly completedCount = computed(() => this.patients().filter((p) => p.status === 'Completed').length);

  addPatient(newPatient: Omit<Patient, 'id'>): void {
    const id = `PT-${Math.floor(1000 + Math.random() * 9000)}`;
    const patient: Patient = { ...newPatient, id };
    this.patients.update((list) => [patient, ...list]);
  }

  updatePatient(id: string, updated: Partial<Patient>): void {
    this.patients.update((list) =>
      list.map((p) => (p.id === id ? { ...p, ...updated } : p))
    );
  }

  deletePatient(id: string): void {
    this.patients.update((list) => list.filter((p) => p.id !== id));
  }
}
