import {
  Component,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslationService } from '../../core/services/translation.service';
import { PatientService } from '../../core/services/patient.service';
import { ToastService } from '../../core/services/toast.service';
import { Patient, PatientStatus } from '../../core/models/patient.model';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SearchInputComponent, ModalComponent],
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
    const query = this.tableSearch().toLowerCase().trim();
    const list = this.patientService.patients();
    if (!query) return list.slice(0, 5); // top 5 for dashboard

    return list.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.diagnosis.toLowerCase().includes(query) ||
        p.id.toLowerCase().includes(query) ||
        p.doctor.toLowerCase().includes(query)
    );
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

    this.patientService.addPatient({
      name: this.newPatientForm.name,
      email: this.newPatientForm.email,
      phone: this.newPatientForm.phone || '+1 (555) 000-0000',
      age: this.newPatientForm.age || 30,
      gender: this.newPatientForm.gender,
      bloodType: this.newPatientForm.bloodType,
      diagnosis: this.newPatientForm.diagnosis,
      doctor: 'Dr. Ahmed Ebrahim',
      lastVisit: new Date().toISOString().split('T')[0],
      status: this.newPatientForm.status,
      avatar: `https://images.unsplash.com/photo-${this.newPatientForm.gender === 'Female' ? '1494790108377-be9c29b29330' : '1507003211169-0a1dd7228f2d'}?w=120&auto=format&fit=crop&q=80`,
      amount: 200,
    });

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
      this.patientService.deletePatient(p.id);
      this.toast.info(
        this.t.isRtl()
          ? `تم حذف ملف المريض ${p.name}`
          : `Patient record for ${p.name} deleted`
      );
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
