import { Injectable, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response';
import { Patient } from '../models/patient.model';
import { DoctorInterface, UpdateDoctor } from '../interfaces/doctor.interface';

@Injectable({
    providedIn: "root"
})
export class DoctorService {
    constructor(private httpClient: HttpClient) { }
    getDoctors(): Observable<ApiResponse<DoctorInterface[]>> {
        return this.httpClient.get<ApiResponse<DoctorInterface[]>>("http://localhost:5097/api/v1/Doctors");
    }
    deleteDoctor(id: number): Observable<ApiResponse<DoctorInterface>> {
        return this.httpClient.delete<ApiResponse<DoctorInterface>>(`http://localhost:5097/api/v1/Doctors/${id}`)
    }
    updateDoctor(id: number, form: UpdateDoctor): Observable<ApiResponse<UpdateDoctor>> {
        return this.httpClient.put<ApiResponse<UpdateDoctor>>(`http://localhost:5097/api/v1/Doctors/${id}`,form)
    }
    
    createDoctor(form: DoctorInterface): Observable<ApiResponse<DoctorInterface>> {
        return this.httpClient.post<ApiResponse<DoctorInterface>>(`http://localhost:5097/api/v1/Doctors`,form)
    }
}
