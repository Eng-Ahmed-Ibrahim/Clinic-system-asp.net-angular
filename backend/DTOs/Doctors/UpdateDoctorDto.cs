using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Doctors;

public class UpdateDoctorDto
{
    public string? Name;
    public long ? SpecialtyId;
    public string? LicenseNumber;
    public decimal? ConsultationFee;
    public decimal? FollowupFee;
    public string? Bio;
    [Required]
    [RegularExpression(@"^01[0125][0-9]{8}$")]
    public string? PhoneNumber;
}