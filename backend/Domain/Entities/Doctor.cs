using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace backend.Domain.Entities
{
    public class Specialty
    {
        [Key]
        public long Id { get; set; }

        [Required, MaxLength(100)]
        public string Name { get; set; } = null!;

        [MaxLength(500)]
        public string? Description { get; set; }
        public virtual ICollection<Doctor> Doctors { get; set; } = new List<Doctor>();
    }

    public class Doctor
    {
        [Key]
        public long Id { get; set; }

        public string Name {get;set;}
        public long SpecialtyId { get; set; }
        [ForeignKey(nameof(SpecialtyId))]
        public virtual Specialty Specialty { get; set; } = null!;

        [Required, MaxLength(50)]
        public string LicenseNumber { get; set; } = null!;

        [Precision(18, 2)]
        public decimal ConsultationFee { get; set; }

        [Precision(18, 2)]
        public decimal FollowupFee { get; set; }
        [RegularExpression(@"^01[0125][0-9]{8}$",ErrorMessage ="رقم التلفون غير صحيح")]
        public string PhoneNumber {get;set;}

        public string? Bio { get; set; }

        // Navigation Properties 
        public virtual ICollection<DoctorSchedule> Schedules { get; set; } = new List<DoctorSchedule>();
        public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
        public virtual ICollection<Consultation> Consultations { get; set; } = new List<Consultation>();
    }

    public class DoctorSchedule
    {
        [Key]
        public long Id { get; set; }

        public long DoctorId { get; set; }
        [ForeignKey(nameof(DoctorId))]
        public virtual Doctor Doctor { get; set; } = null!;

        [Required, MaxLength(20)]
        public string DayOfWeek { get; set; } = null!;

        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public int MaxAppointments { get; set; }
    }
}