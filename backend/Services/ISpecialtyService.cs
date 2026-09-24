using backend.Common;
using backend.DTOs.Specialties;
using backend.Models;

namespace backend.Services;

public interface ISpecialtyService
{
    Task<Result<Specialty>> GetByIdAsync(int id);
    Task<Result<Specialty>> CreateAsync(SpecialtyDto dto);
    Task<Result<Specialty>> UpdateAsync(int id, SpecialtyDto dto);
}