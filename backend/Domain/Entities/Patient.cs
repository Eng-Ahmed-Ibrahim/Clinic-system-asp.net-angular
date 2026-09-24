using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Domain.Entities
{
    public class Patient
    {
        [Key]
        public long Id { get; set; }

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

        // Navigation Properties
        public virtual PatientMedicalHistory? MedicalHistory { get; set; }
        public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
        public virtual ICollection<Consultation> Consultations { get; set; } = new List<Consultation>();
        public virtual ICollection<MedicalAttachment> Attachments { get; set; } = new List<MedicalAttachment>();
        public virtual ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();
    }

    public class PatientMedicalHistory
    {
        [Key]
        public long Id { get; set; }

        public long PatientId { get; set; }
        [ForeignKey(nameof(PatientId))]
        public virtual Patient Patient { get; set; } = null!;

        public string? ChronicDiseases { get; set; }
        public string? Allergies { get; set; }
        public string? PastSurgeries { get; set; }
        public string? FamilyMedicalHistory { get; set; }
    }
}