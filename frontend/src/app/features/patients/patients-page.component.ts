import {
  Component,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../core/services/translation.service';
import { PatientService } from '../../core/services/patient.service';
import { ToastService } from '../../core/services/toast.service';
import { Patient, PatientStatus } from '../../core/models/patient.model';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-patients-page',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchInputComponent, ModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "patients-template.html",
})
export class PatientsPageComponent {
  protected readonly t = inject(TranslationService);
  protected readonly patientService = inject(PatientService);
  private readonly toast = inject(ToastService);

  readonly searchTerm = signal('');
  readonly selectedStatus = signal<string>('All');
  readonly sortColumn = signal<'name' | 'diagnosis' | 'lastVisit' | 'status'>('name');
  readonly sortDirection = signal<'asc' | 'desc'>('asc');
  readonly selectedIds = signal<Set<string>>(new Set());

  readonly currentPage = signal(1);
  pageSize = 5;

  readonly isFormModalOpen = signal(false);
  readonly isViewModalOpen = signal(false);
  readonly isDeleteModalOpen = signal(false);
  readonly isEditing = signal(false);
  readonly editingId = signal<string | null>(null);

  readonly selectedPatient = signal<Patient | null>(null);
  readonly itemToDelete = signal<string | null>(null);

  readonly statusTabs = [
    { value: 'All', labelKey: 'statusAll' },
    { value: 'Active', labelKey: 'statusActive' },
    { value: 'Scheduled', labelKey: 'statusScheduled' },
    { value: 'Completed', labelKey: 'statusCompleted' },
    { value: 'Cancelled', labelKey: 'statusCancelled' },
  ];

  readonly patientForm = {
    name: '',
    email: '',
    phone: '',
    age: 35,
    gender: 'Male' as 'Male' | 'Female',
    diagnosis: '',
    status: 'Active' as PatientStatus,
    bloodType: 'O+',
  };

  readonly filteredPatients = computed(() => {
    const query = this.searchTerm().toLowerCase().trim();
    const status = this.selectedStatus();
    let list = this.patientService.patients();

    if (status !== 'All') {
      list = list.filter((p) => p.status === status);
    }

    if (query) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.diagnosis.toLowerCase().includes(query) ||
          p.id.toLowerCase().includes(query) ||
          p.email.toLowerCase().includes(query)
      );
    }

    return list;
  });

  readonly sortedPatients = computed(() => {
    const list = [...this.filteredPatients()];
    const col = this.sortColumn();
    const dir = this.sortDirection();

    return list.sort((a, b) => {
      const valA = (a[col] ?? '').toString().toLowerCase();
      const valB = (b[col] ?? '').toString().toLowerCase();
      const cmp = valA.localeCompare(valB);
      return dir === 'asc' ? cmp : -cmp;
    });
  });

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.sortedPatients().length / this.pageSize))
  );

  readonly totalPagesArray = computed(() => {
    const total = this.totalPages();
    return Array.from({ length: total }, (_, i) => i + 1);
  });

  readonly paginatedPatients = computed(() => {
    const page = this.currentPage();
    const start = (page - 1) * this.pageSize;
    return this.sortedPatients().slice(start, start + this.pageSize);
  });

  readonly paginationRange = computed(() => {
    const total = this.sortedPatients().length;
    if (total === 0) return { start: 0, end: 0 };
    const start = (this.currentPage() - 1) * this.pageSize + 1;
    const end = Math.min(start + this.pageSize - 1, total);
    return { start, end };
  });

  readonly isAllSelected = computed(() => {
    const current = this.paginatedPatients();
    if (current.length === 0) return false;
    const sel = this.selectedIds();
    return current.every((p) => sel.has(p.id));
  });

  toggleSort(col: 'name' | 'diagnosis' | 'lastVisit' | 'status'): void {
    if (this.sortColumn() === col) {
      this.sortDirection.update((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortColumn.set(col);
      this.sortDirection.set('asc');
    }
  }

  getSortIcon(col: string): string {
    if (this.sortColumn() !== col) return '⇅';
    return this.sortDirection() === 'asc' ? '▲' : '▼';
  }

  toggleSelectAll(): void {
    const current = this.paginatedPatients();
    const sel = new Set(this.selectedIds());

    if (this.isAllSelected()) {
      current.forEach((p) => sel.delete(p.id));
    } else {
      current.forEach((p) => sel.add(p.id));
    }
    this.selectedIds.set(sel);
  }

  toggleSelectRow(id: string): void {
    const sel = new Set(this.selectedIds());
    if (sel.has(id)) {
      sel.delete(id);
    } else {
      sel.add(id);
    }
    this.selectedIds.set(sel);
  }

  prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((p) => p - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((p) => p + 1);
    }
  }

  openAddModal(): void {
    this.isEditing.set(false);
    this.editingId.set(null);
    this.patientForm.name = '';
    this.patientForm.email = '';
    this.patientForm.phone = '';
    this.patientForm.diagnosis = '';
    this.patientForm.status = 'Active';
    this.isFormModalOpen.set(true);
  }

  openEditModal(p: Patient): void {
    this.isEditing.set(true);
    this.editingId.set(p.id);
    this.patientForm.name = p.name;
    this.patientForm.email = p.email;
    this.patientForm.phone = p.phone;
    this.patientForm.age = p.age;
    this.patientForm.gender = p.gender;
    this.patientForm.diagnosis = p.diagnosis;
    this.patientForm.status = p.status;
    this.patientForm.bloodType = p.bloodType;
    this.isFormModalOpen.set(true);
  }

  savePatientForm(): void {
    if (!this.patientForm.name || !this.patientForm.email || !this.patientForm.diagnosis) {
      this.toast.error(this.t.t('fillRequiredFields'));
      return;
    }

    if (this.isEditing() && this.editingId()) {
      this.patientService.updatePatient(this.editingId()!, {
        name: this.patientForm.name,
        email: this.patientForm.email,
        phone: this.patientForm.phone,
        age: this.patientForm.age,
        gender: this.patientForm.gender,
        diagnosis: this.patientForm.diagnosis,
        status: this.patientForm.status,
        bloodType: this.patientForm.bloodType,
      });
      this.toast.success(
        this.t.isRtl() ? 'تم تحديث بيانات المريض بنجاح' : 'Patient record updated successfully'
      );
    } else {
      this.patientService.addPatient({
        name: this.patientForm.name,
        email: this.patientForm.email,
        phone: this.patientForm.phone || '+1 (555) 000-0000',
        age: this.patientForm.age || 30,
        gender: this.patientForm.gender,
        bloodType: this.patientForm.bloodType,
        diagnosis: this.patientForm.diagnosis,
        doctor: 'Dr. Ahmed Ebrahim',
        lastVisit: new Date().toISOString().split('T')[0],
        status: this.patientForm.status,
        avatar: `https://images.unsplash.com/photo-${this.patientForm.gender === 'Female' ? '1494790108377-be9c29b29330' : '1507003211169-0a1dd7228f2d'}?w=120&auto=format&fit=crop&q=80`,
        amount: 200,
      });
      this.toast.success(
        this.t.isRtl() ? 'تمت إضافة المريض بنجاح' : 'New patient registered successfully'
      );
    }

    this.isFormModalOpen.set(false);
  }

  viewPatient(p: Patient): void {
    this.selectedPatient.set(p);
    this.isViewModalOpen.set(true);
  }

  deletePatientPrompt(p: Patient): void {
    this.itemToDelete.set(p.id);
    this.isDeleteModalOpen.set(true);
  }

  deleteSelectedPrompt(): void {
    this.itemToDelete.set('BULK');
    this.isDeleteModalOpen.set(true);
  }

  confirmDelete(): void {
    const item = this.itemToDelete();
    if (item === 'BULK') {
      const ids = Array.from(this.selectedIds());
      ids.forEach((id) => this.patientService.deletePatient(id));
      this.selectedIds.set(new Set());
      this.toast.info(
        this.t.isRtl()
          ? `تم حذف ${ids.length} سجلات بنجاح`
          : `Successfully deleted ${ids.length} records`
      );
    } else if (item) {
      this.patientService.deletePatient(item);
      const sel = new Set(this.selectedIds());
      sel.delete(item);
      this.selectedIds.set(sel);
      this.toast.info(this.t.isRtl() ? 'تم حذف السجل' : 'Record deleted');
    }
    this.isDeleteModalOpen.set(false);
    this.itemToDelete.set(null);
  }
}
