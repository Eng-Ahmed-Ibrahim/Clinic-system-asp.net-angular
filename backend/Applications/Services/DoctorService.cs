using backend.Applications.Interfaces;
using backend.Common;
using backend.Domain.Entities;
using backend.DTOs.Doctors;
using backend.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.Applications.Services;

public class DoctorService(AppDbContext appDbContext) : IDoctorService
{
    public async Task<Result<Doctor>> CreateDoctor(CreateDoctorDto createDoctorDto)
    {
        var doctor = new Doctor
        {
            PhoneNumber = createDoctorDto.PhoneNumber,
            Name = createDoctorDto.Name,
            SpecialtyId = createDoctorDto.SpecialtyId,
            LicenseNumber = createDoctorDto.LicenseNumber,
            ConsultationFee = createDoctorDto.ConsultationFee,
            FollowupFee = createDoctorDto.FollowupFee,
        };

        await appDbContext.Doctors.AddAsync(doctor);
        await appDbContext.SaveChangesAsync();

        return Result<Doctor>.Success(doctor);
    }

    public async Task<Result<DoctorDto[]>> GetDoctors()
    {
        var doctors = await appDbContext.Doctors
            .AsNoTracking()
            .Select(d => new DoctorDto
            {
                Id = d.Id,
                Name = d.Name,
                SpecialtyId = d.SpecialtyId,
                LicenseNumber = d.LicenseNumber,
                PhoneNumber = d.PhoneNumber,
                ConsultationFee = d.ConsultationFee,
                FollowupFee = d.FollowupFee,
                Specialty = d.Specialty,
                Bio = d.Bio
            })
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

        if (updateDoctorDto.Name is not null)
            doctor.Name = updateDoctorDto.Name;

        if (updateDoctorDto.PhoneNumber is not null)
            doctor.PhoneNumber = updateDoctorDto.PhoneNumber;

        if (updateDoctorDto.SpecialtyId.HasValue)
            doctor.SpecialtyId = updateDoctorDto.SpecialtyId.Value;

        if (updateDoctorDto.LicenseNumber is not null)
            doctor.LicenseNumber = updateDoctorDto.LicenseNumber;

        if (updateDoctorDto.ConsultationFee.HasValue)
            doctor.ConsultationFee = updateDoctorDto.ConsultationFee.Value;

        if (updateDoctorDto.FollowupFee.HasValue)
            doctor.FollowupFee = updateDoctorDto.FollowupFee.Value;

        if (updateDoctorDto.Bio is not null)
            doctor.Bio = updateDoctorDto.Bio;

        await appDbContext.SaveChangesAsync();

        return Result<string>.Success("Doctor updated successfully.");
    }

    public async Task<Result<DoctorDto>> GetDoctorById(long id)
    {
        var doctor = await appDbContext.Doctors
            .AsNoTracking()
            .Select(d => new DoctorDto
            {
                Id = d.Id,
                Name = d.Name,
                SpecialtyId = d.SpecialtyId,
                LicenseNumber = d.LicenseNumber,
                PhoneNumber = d.PhoneNumber,
                ConsultationFee = d.ConsultationFee,
                FollowupFee = d.FollowupFee,
                Specialty = d.Specialty,
                Bio = d.Bio
            })
            .FirstOrDefaultAsync(d => d.Id == id);

        if (doctor is null)
            return Result<DoctorDto>.NotFound("هذا الدكتور غير موجود");

        return Result<DoctorDto>.Success(doctor);
    }
}