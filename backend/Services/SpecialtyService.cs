using backend.Common;
using backend.Data;
using backend.DTOs.Specialties;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class SpecialtyService(AppDbContext appDbContext) : ISpecialtyService
{
    public async Task<Result<Specialty>> GetByIdAsync(int id)
    {
        var specialty = await appDbContext.Specialties.FindAsync(id);
        if (specialty == null)
            return Result<Specialty>.NotFound("التخصص غير موجود");

        return Result<Specialty>.Success(specialty);
    }

    public async Task<Result<Specialty>> CreateAsync(SpecialtyDto dto)
    {
        var exists = await appDbContext.Specialties
            .AnyAsync(s => s.Name.ToLower() == dto.Name.Trim().ToLower());

        if (exists)
            return Result<Specialty>.Conflict("هذا التخصص موجود بالفعل");

        var specialty = new Specialty
        {
            Name = dto.Name.Trim(),
            Description = dto.Description?.Trim()
        };

        appDbContext.Specialties.Add(specialty);
        await appDbContext.SaveChangesAsync();

        return Result<Specialty>.Success(specialty);
    }

    public Task<Result<Specialty>> UpdateAsync(int id, SpecialtyDto dto)
    {
        throw new NotImplementedException();
    }
}