import { Injectable, signal, computed } from '@angular/core';
import { Patient, PatientStatus } from '../models/patient.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiResponse } from '../interfaces/api-response';
import { CreatePatient } from '../interfaces/create-patient';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  constructor(private httpClient: HttpClient) { }

  getPatients(): Observable<ApiResponse<Patient[]>> {
    return this.httpClient.get<ApiResponse<Patient[]>>('http://localhost:5097/api/v1/Patients');
  }


  deletePatient(id: number): Observable<any> {
    return this.httpClient.delete(
      `http://localhost:5097/api/v1/Patients/${id}`
    );
  }

  createPatient(form: CreatePatient): Observable<ApiResponse<Patient>> {
    return this.httpClient.post<ApiResponse<Patient>>(
      'http://localhost:5097/api/v1/Patients',
      form
    );
  }
  updatePatient(form: CreatePatient, id: number): Observable<ApiResponse<Patient>> {
    return this.httpClient.put<ApiResponse<Patient>>(
      `http://localhost:5097/api/v1/Patients/${id}`,
      form
    );
  }

}
