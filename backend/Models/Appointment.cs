using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Appointment
    {
        [Key]
        public long Id { get; set; }

        public long PatientId { get; set; }
        [ForeignKey(nameof(PatientId))]
        public virtual Patient Patient { get; set; } = null!;

        public long DoctorId { get; set; }
        [ForeignKey(nameof(DoctorId))]
        public virtual Doctor Doctor { get; set; } = null!;

        public DateTime AppointmentDate { get; set; }
        public TimeSpan AppointmentTime { get; set; }

        [Required, MaxLength(50)]
        public string Type { get; set; } = null!; // New, Followup, Consultation

        [Required, MaxLength(50)]
        public string Status { get; set; } = null!; // Pending, Confirmed, Completed, Cancelled

        public int QueueNumber { get; set; }
        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public virtual Consultation? Consultation { get; set; }
        public virtual ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();
    }
}