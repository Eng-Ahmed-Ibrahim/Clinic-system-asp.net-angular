using AutoMapper;
using backend.Domain.Entities;
using backend.Applications.DTOs.Patients;

namespace backend.Applications.Mapping;

public class PatientProfile : Profile
{
    public PatientProfile()
    {
        CreateMap<CreatePatientDto, Patient>();
        CreateMap<PatientHistoryRecordDto, PatientMedicalHistory>();
        
        CreateMap<Patient, PatientDto>();
        CreateMap<PatientMedicalHistory, PatientHistoryRecordDto>();
    }
}