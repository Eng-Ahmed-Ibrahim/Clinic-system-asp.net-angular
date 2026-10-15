import { Injectable, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response';
import { SpecialtyDto } from '../interfaces/specialty';

@Injectable({
    providedIn:"root"
})
export class SpecialtyService {
    constructor(private httpClient:HttpClient){}
    GetSpecialties():Observable<ApiResponse<SpecialtyDto[]>>{
        return this.httpClient.get<ApiResponse<SpecialtyDto[]>>("http://localhost:5097/api/v1/specialties")
    }

}
