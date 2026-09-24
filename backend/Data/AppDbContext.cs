using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
namespace backend.Data;

public class AppDbContext : IdentityDbContext<AppUser, Role, int>

{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);



        modelBuilder.Entity<Consultation>()
                .HasOne(c => c.Doctor)
                .WithMany(d => d.Consultations)
                .HasForeignKey(c => c.DoctorId)
                .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Consultation>()
            .HasOne(c => c.Patient)
            .WithMany(p => p.Consultations)
            .HasForeignKey(c => c.PatientId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Invoice>()
            .HasOne(i => i.Patient)
            .WithMany(p => p.Invoices)
            .HasForeignKey(i => i.PatientId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<MedicalAttachment>()
            .HasOne(ma => ma.Consultation)
            .WithMany(c => c.Attachments)
            .HasForeignKey(ma => ma.ConsultationId)
            .OnDelete(DeleteBehavior.Restrict);



        modelBuilder.Entity<Patient>()
            .HasIndex(p => p.NationalId)
            .IsUnique();


        modelBuilder.Entity<Consultation>()
            .HasIndex(c => c.AppointmentId)
            .IsUnique();

        modelBuilder.Entity<PatientVital>()
            .HasIndex(v => v.ConsultationId)
            .IsUnique();

        modelBuilder.Entity<PatientMedicalHistory>()
            .HasIndex(pmh => pmh.PatientId)
            .IsUnique();
    }
    public DbSet<Specialty> Specialties { get; set; }
    public DbSet<Doctor> Doctors { get; set; }
    public DbSet<DoctorSchedule> DoctorSchedules { get; set; }
    public DbSet<Patient> Patients { get; set; }
    public DbSet<PatientMedicalHistory> PatientMedicalHistories { get; set; }
    public DbSet<Appointment> Appointments { get; set; }
    public DbSet<Consultation> Consultations { get; set; }
    public DbSet<PatientVital> PatientVitals { get; set; }
    public DbSet<Prescription> Prescriptions { get; set; }
    public DbSet<PrescriptionItem> PrescriptionItems { get; set; }
    public DbSet<LabRequest> LabRequests { get; set; }
    public DbSet<MedicalAttachment> MedicalAttachments { get; set; }
    public DbSet<Invoice> Invoices { get; set; }
    public DbSet<InvoiceItem> InvoiceItems { get; set; }
    public DbSet<Payment> Payments { get; set; }
}