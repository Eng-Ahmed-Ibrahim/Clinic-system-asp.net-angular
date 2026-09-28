using System.ComponentModel.DataAnnotations;

namespace backend.Applications.DTOs.Doctors;

public class UpdateDoctorDto
{
    public string? Name{get;set;}
    public long ? SpecialtyId{get;set;}
    public string? LicenseNumber{get;set;}
    public decimal? ConsultationFee{get;set;}
    public decimal? FollowupFee{get;set;}
    public string? Bio{get;set;}
    [RegularExpression(@"^01[0125][0-9]{8}$")]
    public string? PhoneNumber{get;set;}
}