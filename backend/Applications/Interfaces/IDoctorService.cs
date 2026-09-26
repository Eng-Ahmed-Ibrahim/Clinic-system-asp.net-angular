using backend.Common;
using backend.Domain.Entities;
using backend.DTOs.Doctors;

namespace backend.Applications.Interfaces;
public interface IDoctorService
{
    public Task<Result<DoctorDto[]>> GetDoctors();
    public Task<Result<Doctor>> CreateDoctor(CreateDoctorDto createDoctorDto);
    public Task<Result<string>> UpdateDoctor(UpdateDoctorDto updateDoctorDto,long Id);
    public Task<Result<string>> DeleteDoctor(long Id);
    public Task<Result<DoctorDto>> GetDoctorById(long Id);
 
}