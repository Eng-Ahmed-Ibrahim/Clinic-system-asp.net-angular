using backend.Applications.Interfaces;
using backend.Common;
using backend.Domain.Entities;
using backend.Applications.DTOs.Doctors;
using backend.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using AutoMapper.QueryableExtensions;

namespace backend.Applications.Services;

public class DoctorService(AppDbContext appDbContext, IMapper mapper) : IDoctorService
{
    public async Task<Result<DoctorDto>> CreateDoctor(CreateDoctorDto createDoctorDto)
    {

        var doctor = mapper.Map<Doctor>(createDoctorDto);
        await appDbContext.Doctors.AddAsync(doctor);
        await appDbContext.SaveChangesAsync();
        var doctorWithSpecialty = await appDbContext.Doctors
            .Include(d => d.Specialty)
            .FirstOrDefaultAsync(d => d.Id == doctor.Id);

        var response = mapper.Map<DoctorDto>(doctorWithSpecialty);
        Console.WriteLine($"Response {response}");
        return Result<DoctorDto>.Success(response);
    }

    public async Task<Result<DoctorDto[]>> GetDoctors()
    {
        var doctors = await appDbContext.Doctors
            .AsNoTracking()
            .OrderByDescending(d => d.Id)
            .ProjectTo<DoctorDto>(mapper.ConfigurationProvider)
            .ToArrayAsync();

        return Result<DoctorDto[]>.Success(doctors);
    }

    public async Task<Result<string>> DeleteDoctor(long id)
    {
        var doctor = await appDbContext.Doctors
            .FirstOrDefaultAsync(d => d.Id == id);

        if (doctor is null)
        {
            return Result<string>.NotFound("هذا الدكتور غير موجود");
        }

        appDbContext.Doctors.Remove(doctor);
        await appDbContext.SaveChangesAsync();

        return Result<string>.Success("Doctor deleted successfully.");
    }


    public async Task<Result<string>> UpdateDoctor(
        UpdateDoctorDto updateDoctorDto,
        long id)
    {
        var doctor = await appDbContext.Doctors
            .FirstOrDefaultAsync(d => d.Id == id);

        if (doctor is null)
        {
            return Result<string>.NotFound("هذا الدكتور غير موجود");

        }
        mapper.Map(updateDoctorDto, doctor);
        await appDbContext.SaveChangesAsync();

        return Result<string>.Success("Doctor updated successfully.");
    }

    public async Task<Result<DoctorDto>> GetDoctorById(long id)
    {
        var doctor = await appDbContext.Doctors
            .AsNoTracking()
             .Where(d => d.Id == id)
            .ProjectTo<DoctorDto>(mapper.ConfigurationProvider)
            .FirstOrDefaultAsync();
        if (doctor is null)
            return Result<DoctorDto>.NotFound("هذا الدكتور غير موجود");

        return Result<DoctorDto>.Success(doctor);
    }
}