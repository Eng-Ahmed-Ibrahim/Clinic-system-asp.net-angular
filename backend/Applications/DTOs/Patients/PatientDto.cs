using backend.Applications.DTOs.Patients;
namespace backend.Applications.DTOs.Patients;

public class PatientDto
{
    public long Id { get; set; }
    public string NationalId { get; set; } = null!;
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string Gender { get; set; } = null!;
    public DateTime DateOfBirth { get; set; }
    public string PhoneNumber { get; set; } = null!;
    public string? EmergencyPhone { get; set; }
    public string? Address { get; set; }
    public string? BloodGroup { get; set; }

    public PatientHistoryRecordDto? MedicalHistory { get; set; }
}