using backend.Domain.Entities;

namespace backend.DTOs.Doctors;

public class DoctorDto
{
    public long Id {get;set;}
    public string Name {get;set;}
    public long SpecialtyId {get;set;}
    public string LicenseNumber {get;set;}
    public string PhoneNumber {get;set;}
    public decimal ConsultationFee {get;set;}
    public decimal FollowupFee {get;set;}
    public Specialty Specialty {get;set;}
    public string? Bio{get;set;}
}