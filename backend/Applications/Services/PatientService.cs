using AutoMapper;
using backend.Applications.Interfaces;
using backend.Common;
using backend.Domain.Entities;
using backend.Applications.DTOs.Patients;
using backend.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Mvc;

namespace backend.Applications.Services;

public class PatientService(IMapper mapper, AppDbContext appDbContext) : IPatientService
{
    public async Task<Result<PatientDto>> CreatePatient(CreatePatientDto createPatientDto)
    {
        var nationalIdExists = await appDbContext.Patients
            .AnyAsync(p => p.NationalId == createPatientDto.NationalId);

        if (nationalIdExists)
        {
            return Result<PatientDto>.Failure(
                "National ID already exists.",
                ErrorType.Conflict
            );
        }

        var phoneExists = await appDbContext.Patients
            .AnyAsync(p => p.PhoneNumber == createPatientDto.PhoneNumber);

        if (phoneExists)
        {
            return Result<PatientDto>.Failure(
                "Phone number already exists.",
                ErrorType.Conflict
            );
        }
        var patient = mapper.Map<Patient>(createPatientDto);
        await appDbContext.Patients.AddAsync(patient);
        await appDbContext.SaveChangesAsync();
        var response = mapper.Map<PatientDto>(patient);

        return Result<PatientDto>.Success(response);
    }


    public async Task<Result<PatientDto[]>> GetPatients()
    {
        var patients = await appDbContext.Patients.AsNoTracking()
        .ProjectTo<PatientDto>(mapper.ConfigurationProvider)
        .ToArrayAsync();
        return Result<PatientDto[]>.Success(patients);
    }
    public async Task<Result<string>> DeletePatient([FromRoute] long id)
    {
        var patient = await appDbContext.Patients.FindAsync(id);
        if (patient is null)
            return Result<string>.NotFound("لا يوجد هذا المريض");
        appDbContext.Patients.Remove(patient);
        await appDbContext.SaveChangesAsync();
        return Result<string>.Success("تم حذف المريض بنجاح");
    }
    public async Task<Result<PatientDto>> UpdatePatient()


}