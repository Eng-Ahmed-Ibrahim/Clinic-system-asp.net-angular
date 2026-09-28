using System.ComponentModel.DataAnnotations;

namespace backend.Applications.DTOs.Doctors;

public class CreateDoctorDto
{
    [Required]
    public string Name { get; set; } = string.Empty;

    [Required]
    public int SpecialtyId { get; set; }

    [Required]
    public string LicenseNumber { get; set; } = string.Empty;

    [Required]
    [RegularExpression(
        @"^01[0125][0-9]{8}$",
        ErrorMessage = "Invalid Egyptian phone number."
    )]
    public string PhoneNumber { get; set; } = string.Empty;

    [Required]
    public decimal ConsultationFee { get; set; }

    public decimal FollowupFee { get; set; }

    public string? Bio { get; set; }
    public DoctorScheduleDto[] Schedules {get;set;}
}