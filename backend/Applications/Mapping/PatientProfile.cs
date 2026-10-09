using AutoMapper;
using backend.Domain.Entities;
using backend.Applications.DTOs.Patients;

namespace backend.Applications.Mapping;

public class PatientProfile : Profile
{
    public PatientProfile()
    {
        CreateMap<Patient, PatientDto>();
        CreateMap<CreatePatientDto, Patient>();
        CreateMap<UpdatePatientDto, Patient>();
        CreateMap<PatientHistoryRecordDto, PatientMedicalHistory>()
    .ForMember(d => d.Id, o => o.Ignore())
    .ForMember(d => d.PatientId, o => o.Ignore())
    .ForMember(d => d.Patient, o => o.Ignore());
        CreateMap<Patient, PatientDto>();
        CreateMap<PatientMedicalHistory, PatientHistoryRecordDto>();
    }
}