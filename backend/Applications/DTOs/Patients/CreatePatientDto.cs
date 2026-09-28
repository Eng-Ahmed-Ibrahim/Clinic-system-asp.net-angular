using System.ComponentModel.DataAnnotations;

namespace backend.Applications.DTOs.Patients;
public class CreatePatientDto
{


        [Required, MaxLength(20)]
        public string NationalId { get; set; } = null!;

        [Required, MaxLength(50)]
        public string FirstName { get; set; } = null!;

        [Required, MaxLength(50)]
        public string LastName { get; set; } = null!;

        [Required, MaxLength(10)]
        public string Gender { get; set; } = null!;

        public DateTime DateOfBirth { get; set; }

        [Required, Phone, MaxLength(20)]
        public string PhoneNumber { get; set; } = null!;

        [Phone, MaxLength(20)]
        public string? EmergencyPhone { get; set; }

        public string? Address { get; set; }

        [MaxLength(5)]
        public string? BloodGroup { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public PatientHistoryRecordDto MedicalHistory {get;set;}

}