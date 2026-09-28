using backend.Common;
using backend.Applications.DTOs.Specialties;
using backend.Domain.Entities;

namespace backend.Applications.Interfaces;

public interface ISpecialtyService
{
    Task<Result<Specialty[]>> List();
    Task<Result<Specialty>> GetByIdAsync(int id);
    Task<Result<Specialty>> CreateAsync(SpecialtyDto dto);
    Task<Result<Specialty>> UpdateAsync(int id, SpecialtyDto dto);
    Task<Result<Specialty>> DeleteAsync(long  id);
}