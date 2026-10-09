using backend.Common;
using backend.Domain.Entities;
using backend.Applications.DTOs.Patients;

namespace backend.Applications.Interfaces;
public interface IPatientService
{
    Task<Result<PatientDto[]>> GetPatients();
    Task<Result<string>> DeletePatient(long id);
    Task<Result<PatientDto>> CreatePatient(CreatePatientDto createPatientDto);
}