using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace backend.Domain.Entities
{
    public class Consultation
    {
        [Key]
        public long Id { get; set; }

        public long AppointmentId { get; set; }
        [ForeignKey(nameof(AppointmentId))]
        public virtual Appointment Appointment { get; set; } = null!;

        public long DoctorId { get; set; }
        [ForeignKey(nameof(DoctorId))]
        public virtual Doctor Doctor { get; set; } = null!;

        public long PatientId { get; set; }
        [ForeignKey(nameof(PatientId))]
        public virtual Patient Patient { get; set; } = null!;

        public string? ChiefComplaint { get; set; }
        public string? Diagnosis { get; set; }
        public string? ClinicalNotes { get; set; }

        public DateTime ConsultationDate { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public virtual PatientVital? Vitals { get; set; }
        public virtual ICollection<Prescription> Prescriptions { get; set; } = new List<Prescription>();
        public virtual ICollection<LabRequest> LabRequests { get; set; } = new List<LabRequest>();
        public virtual ICollection<MedicalAttachment> Attachments { get; set; } = new List<MedicalAttachment>();
    }

    public class PatientVital
    {
        [Key]
        public long Id { get; set; }

        public long ConsultationId { get; set; }
        [ForeignKey(nameof(ConsultationId))]
        public virtual Consultation Consultation { get; set; } = null!;

        [MaxLength(20)]
        public string? BloodPressure { get; set; }

        public int? HeartRate { get; set; }

        [Precision(4, 1)]
        public decimal? Temperature { get; set; }

        [Precision(5, 2)]
        public decimal? WeightKg { get; set; }

        [Precision(5, 2)]
        public decimal? HeightCm { get; set; }
    }

    public class Prescription
    {
        [Key]
        public long Id { get; set; }

        public long ConsultationId { get; set; }
        [ForeignKey(nameof(ConsultationId))]
        public virtual Consultation Consultation { get; set; } = null!;

        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Property
        public virtual ICollection<PrescriptionItem> Items { get; set; } = new List<PrescriptionItem>();
    }

    public class PrescriptionItem
    {
        [Key]
        public long Id { get; set; }

        public long PrescriptionId { get; set; }
        [ForeignKey(nameof(PrescriptionId))]
        public virtual Prescription Prescription { get; set; } = null!;

        [Required, MaxLength(150)]
        public string MedicineName { get; set; } = null!;

        [Required, MaxLength(50)]
        public string Dosage { get; set; } = null!;

        [Required, MaxLength(50)]
        public string Frequency { get; set; } = null!;

        [Required, MaxLength(50)]
        public string Duration { get; set; } = null!;

        public string? Instructions { get; set; }
    }

    public class LabRequest
    {
        [Key]
        public long Id { get; set; }

        public long ConsultationId { get; set; }
        [ForeignKey(nameof(ConsultationId))]
        public virtual Consultation Consultation { get; set; } = null!;

        [Required, MaxLength(150)]
        public string TestName { get; set; } = null!;

        public string? Instructions { get; set; }

        [Required, MaxLength(50)]
        public string Status { get; set; } = null!; // Requested, Completed
    }

    public class MedicalAttachment
    {
        [Key]
        public long Id { get; set; }

        public long PatientId { get; set; }
        [ForeignKey(nameof(PatientId))]
        public virtual Patient Patient { get; set; } = null!;

        public long? ConsultationId { get; set; }
        [ForeignKey(nameof(ConsultationId))]
        public virtual Consultation? Consultation { get; set; }

        [Required, MaxLength(500)]
        public string FilePath { get; set; } = null!;

        [Required, MaxLength(50)]
        public string FileType { get; set; } = null!;

        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    }
}