using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace backend.Domain.Entities
{
    public class Invoice
    {
        [Key]
        public long Id { get; set; }

        public long? AppointmentId { get; set; }
        [ForeignKey(nameof(AppointmentId))]
        public virtual Appointment? Appointment { get; set; }

        public long PatientId { get; set; }
        [ForeignKey(nameof(PatientId))]
        public virtual Patient Patient { get; set; } = null!;

        [Precision(18, 2)]
        public decimal TotalAmount { get; set; }

        [Precision(18, 2)]
        public decimal Discount { get; set; } = 0;

        [Precision(18, 2)]
        public decimal NetAmount { get; set; }

        [Precision(18, 2)]
        public decimal PaidAmount { get; set; } = 0;

        [Required, MaxLength(50)]
        public string PaymentStatus { get; set; } = null!; // Paid, PartiallyPaid, Unpaid

        public DateTime InvoiceDate { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public virtual ICollection<InvoiceItem> Items { get; set; } = new List<InvoiceItem>();
        public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
    }

    public class InvoiceItem
    {
        [Key]
        public long Id { get; set; }

        public long InvoiceId { get; set; }
        [ForeignKey(nameof(InvoiceId))]
        public virtual Invoice Invoice { get; set; } = null!;

        [Required, MaxLength(150)]
        public string ServiceName { get; set; } = null!;

        [Precision(18, 2)]
        public decimal UnitPrice { get; set; }

        public int Quantity { get; set; } = 1;

        [Precision(18, 2)]
        public decimal Subtotal { get; set; }
    }

    public class Payment
    {
        [Key]
        public long Id { get; set; }

        public long InvoiceId { get; set; }
        [ForeignKey(nameof(InvoiceId))]
        public virtual Invoice Invoice { get; set; } = null!;

        [Precision(18, 2)]
        public decimal Amount { get; set; }

        [Required, MaxLength(50)]
        public string PaymentMethod { get; set; } = null!; // Cash, Card, Transfer

        [MaxLength(100)]
        public string? TransactionReference { get; set; }

        public DateTime PaidAt { get; set; } = DateTime.UtcNow;
    }
}