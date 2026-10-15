import { Component, input, OnInit, signal } from '@angular/core';
import { DoctorService } from '../../../core/services/doctor.service';
import { DoctorInterface, UpdateDoctor } from '../../../core/interfaces/doctor.interface';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastService } from '../../../core/services/toast.service';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpecialtyService } from '../../../core/services/specialty.service';
import { SpecialtyDto } from '../../../core/interfaces/specialty';

@Component({
  imports: [CommonModule, FormsModule, FontAwesomeModule, ModalComponent, ReactiveFormsModule],
  selector: 'app-doctor.component',
  styleUrl: './doctor.component.css',
  templateUrl: './doctor.component.html',
})
export class DoctorComponent implements OnInit {
  constructor(private docterService: DoctorService,
    private specialtyService: SpecialtyService,
    private toastr: ToastService, private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      specialtyId: [0, [Validators.required, Validators.min(1)]],
      licenseNumber: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+?\d{8,15}$/)]],
      consultationFee: [0, [Validators.required, Validators.min(0)]],
      followupFee: [0, [Validators.required, Validators.min(0)]],
      bio: [''],
      schedules: this.fb.array([]),
    });
  }
  ngOnInit(): void {
    this.getDoctors()
    this.getSpecialties()
  }
  faPen = faPen;
  faTrash = faTrash;
  isEditMode = signal<boolean>(false)
  doctors$ = signal<DoctorInterface[]>([])
  openModel = signal<boolean>(false)
  specialties = signal<SpecialtyDto[]>([]);
  days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  form: FormGroup;
  doctor = input<DoctorInterface | null>(null);



  submit() {
    if(this.form.invalid){
      return;
    }
    this.docterService.createDoctor(this.form.value).subscribe({
      next:(response)=>{
        console.log(response)
        this.doctors$.update(doctors => [response.data,...doctors])
      
      }
        ,
      error:(response)=>console.log(response)
      
      
    })
    console.log(this.form.value);
    
  }
  get schedules(): FormArray {
    return this.form.get('schedules') as FormArray;
  }

  addSchedule(): void {
    const scheduleForm = this.fb.group({
      dayOfWeek: [null as string | null, Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required]
    });
    this.schedules.push(scheduleForm);
  }

  removeSchedule(index: number): void {
    this.schedules.removeAt(index);
  }
  getSpecialties() {
    this.specialtyService.GetSpecialties().subscribe({
      next: (response) => this.specialties.set(response.data),
      error: (error) => console.log(error)
    })
  }
  getDoctors() {
    this.docterService.getDoctors().subscribe({
      next: (response) => this.doctors$.set(response?.data),
      error: (error) => console.log(error),
      complete: () => console.log("Compeleted")
    })
  }

  deleteDoctor(id: number) {
    this.docterService.deleteDoctor(id).subscribe({
      next: (response) => {
        this.toastr.success(response.message)
        this.doctors$.update(doctors =>
          doctors.filter(docter => docter.id !== id)
        );

      },
      error: (error) => this.toastr.error(error),
      complete: () => console.log("Compeleted")
    })
  }
}
