import {
  Component,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';

import { TranslationService } from '../../core/services/translation.service';
import { PatientService } from '../../core/services/patient.service';
import { ToastService } from '../../core/services/toast.service';
import { Patient, PatientStatus } from '../../core/models/patient.model';


@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard-template.component.html',
})
export class DashboardOverviewComponent {
  protected readonly t = inject(TranslationService);
  protected readonly patientService = inject(PatientService);
  private readonly toast = inject(ToastService);

  readonly tableSearch = signal('');
  readonly isAddModalOpen = signal(false);
  readonly isViewModalOpen = signal(false);
  readonly isDeleteModalOpen = signal(false);

  readonly selectedPatient = signal<Patient | null>(null);
  readonly patientToDelete = signal<Patient | null>(null);

  readonly newPatientForm = {
    name: '',
    email: '',
    phone: '',
    age: 30,
    gender: 'Male' as 'Male' | 'Female',
    diagnosis: '',
    status: 'Active' as PatientStatus,
    bloodType: 'A+',
  };

  readonly weeklyData = [
    { day: 'Mon', count: 32, percentage: 65 },
    { day: 'Tue', count: 45, percentage: 90 },
    { day: 'Wed', count: 38, percentage: 76 },
    { day: 'Thu', count: 50, percentage: 100 },
    { day: 'Fri', count: 42, percentage: 84 },
    { day: 'Sat', count: 24, percentage: 48 },
    { day: 'Sun', count: 18, percentage: 36 },
  ];

  readonly filteredPatients = computed(() => {

  });

  todayFormatted(): string {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  openAddModal(): void {
    this.newPatientForm.name = '';
    this.newPatientForm.email = '';
    this.newPatientForm.phone = '';
    this.newPatientForm.diagnosis = '';
    this.isAddModalOpen.set(true);
  }

  submitAddPatient(): void {
    if (!this.newPatientForm.name || !this.newPatientForm.email || !this.newPatientForm.diagnosis) {
      this.toast.error(this.t.t('fillRequiredFields'));
      return;
    }

    this.toast.success(
      this.t.isRtl()
        ? `تم تسجيل المريض ${this.newPatientForm.name} بنجاح`
        : `Patient ${this.newPatientForm.name} registered successfully`
    );
    this.isAddModalOpen.set(false);
  }

  viewPatient(p: Patient): void {
    this.selectedPatient.set(p);
    this.isViewModalOpen.set(true);
  }

  deletePatientPrompt(p: Patient): void {
    this.patientToDelete.set(p);
    this.isDeleteModalOpen.set(true);
  }

  confirmDeletePatient(): void {
    const p = this.patientToDelete();
    if (p) {
  
      this.patientToDelete.set(null);
    }
    this.isDeleteModalOpen.set(false);
  }

  exportReport(): void {
    this.toast.success(
      this.t.isRtl()
        ? 'تم تصدير التقرير الطبي بصيغة CSV بنجاح'
        : 'Clinical report exported successfully as CSV'
    );
  }
}
