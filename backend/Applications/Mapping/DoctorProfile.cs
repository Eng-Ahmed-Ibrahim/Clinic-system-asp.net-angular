using AutoMapper;
using backend.Applications.DTOs.Doctors;
using backend.Applications.DTOs.Specialties;
using backend.Domain.Entities;

namespace backend.Applications.Mapping;

public class DoctorProfile : Profile
{
    public DoctorProfile()
    {
        // Create 
        CreateMap<CreateDoctorDto, Doctor>();
        CreateMap<DoctorScheduleDto, DoctorSchedule>();
        CreateMap<UpdateDoctorDto, Doctor>()
            .ForMember(d => d.SpecialtyId, opt => opt.Ignore())
            .ForAllMembers(d =>
                d.Condition((src, dest, srcMember) => srcMember is not null)
            );
        // Response
        CreateMap<Doctor, DoctorDto>();
        CreateMap<DoctorSchedule, DoctorScheduleDto>();
        CreateMap<Specialty, SpecialtyDto>();

    }
}