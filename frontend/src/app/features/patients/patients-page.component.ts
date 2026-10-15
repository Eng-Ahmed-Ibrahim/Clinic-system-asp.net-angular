import {
  Component,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { TranslationService } from '../../core/services/translation.service';
import { PatientService } from '../../core/services/patient.service';
import { ToastService } from '../../core/services/toast.service';
import { Patient, PatientStatus } from '../../core/models/patient.model';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash, faPen } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-patients-page',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule, ModalComponent, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "patients-template.html",
})
export class PatientsPageComponent implements OnInit {
  patients$ = signal<any[]>([])
  openModel = signal<boolean>(false)
  editingId = signal<number | null>(null);
  isEditMode = signal<boolean>(false);

  faTrash = faTrash;
  faPen = faPen;
  patientForm: FormGroup;


  constructor(private patientService: PatientService, private fb: FormBuilder, private toastService: ToastService) {
    this.patientForm = this.fb.group({
      nationalId: ['', [Validators.required, Validators.pattern(/^[0-9]{14}$/)]],
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      gender: ['', [Validators.required, Validators.maxLength(10)]],
      dateOfBirth: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{11}$/)]],
      emergencyPhone: ['', Validators.maxLength(20)],
      address: [''],
      bloodGroup: ['', Validators.maxLength(5)],

      medicalHistory: this.fb.group({
        chronicDiseases: [''],
        allergies: [''],
        pastSurgeries: [''],
        familyMedicalHistory: ['']
      })
    });
  }
  ngOnInit(): void {
    this.getPatients()
  }
  
  getPatients() {
    this.patientService.getPatients().subscribe({
      next: (response) => {
        this.patients$.set(response?.data)
        console.log(response);

      },
      error: (error) => console.log(error),
      complete: () => console.log("Compeleted")


    })
  }
  deletePatient(id: number) {
    console.log(id);

    var response = this.patientService.deletePatient(id).subscribe({
      next: (response) => {
        this.toastService.success(response.message)
        this.patients$.update(patients =>
          patients.filter(patient => patient.id !== id)
        );
      },
      error: (response) => this.toastService.error(response.message),
      complete: () => console.log("Completed")

    });
    console.log(response);

  }

  openEdit(patient: Patient) {
    this.editingId.set(patient.id);
    this.patientForm.patchValue({
      nationalId: patient.nationalId,
      firstName: patient.firstName,
      lastName: patient.lastName,
      gender: patient.gender,
      // input type="date" محتاج yyyy-MM-dd
      dateOfBirth: patient.dateOfBirth?.split('T')[0],
      phoneNumber: patient.phoneNumber,
      emergencyPhone: patient.emergencyPhone,
      bloodGroup: patient.bloodGroup,
      address: patient.address,
      medicalHistory: {
        chronicDiseases: patient.medicalHistory?.chronicDiseases,
        allergies: patient.medicalHistory?.allergies,
        pastSurgeries: patient.medicalHistory?.pastSurgeries,
        familyMedicalHistory: patient.medicalHistory?.familyMedicalHistory,
      },
    });
    this.isEditMode.set(true);
    this.openModel.set(true);
  }
  closeModel(){
    this.openModel.set(false);
  }
  submitPatient() {
    if (this.patientForm.invalid) {
      this.patientForm.markAllAsTouched();
      console.log("invalid ", this.patientForm.value);

      return;
    }

    const patient = this.patientForm.value;
    const id = this.editingId();
    const request$ = id ? this.patientService.updatePatient(patient, id) : this.patientService.createPatient(patient)
    request$.subscribe({
      next: (response) => {
        if (id) {
          this.patients$.update(patients =>
            patients.map(p => p.id === id ? { ...p, ...patient, id } : p)
          );
          this.toastService.success("تم التعديل بنجاح")
        } else {

          this.patients$.update(patients => [
            ...patients,
            response.data
          ]);
          this.toastService.success("تم الاضافه بنجاح")
        }
        this.closeModel();
      },
      error: (error) => {
        console.log(error);

        this.toastService.error(error.error.message)
      }


    })
  }
}
