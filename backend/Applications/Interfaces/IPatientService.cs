using backend.Common;
using backend.Domain.Entities;
using backend.Applications.DTOs.Patients;

namespace backend.Applications.Interfaces;
public interface IPatientService
{
    Task<Result<Patient[]>> GetPatients();
    Task<Result<PatientDto>> CreatePatient(CreatePatientDto createPatientDto);
}