using AutoMapper;
using backend.Applications.Interfaces;
using backend.Common;
using backend.Domain.Entities;
using backend.Applications.DTOs.Patients;
using backend.Infrastructure.Data;

namespace backend.Applications.Services;

public class PatientService(IMapper mapper, AppDbContext appDbContext) : IPatientService
{
    public async Task<Result<PatientDto>> CreatePatient(CreatePatientDto createPatientDto)
    {

        var patient = mapper.Map<Patient>(createPatientDto);
        await appDbContext.Patients.AddAsync(patient);
        await appDbContext.SaveChangesAsync();
        var response = mapper.Map<PatientDto>(patient);

        return Result<PatientDto>.Success(response);
    }


    public Task<Result<Patient[]>> GetPatients()
    {
        throw new NotImplementedException();
    }
}