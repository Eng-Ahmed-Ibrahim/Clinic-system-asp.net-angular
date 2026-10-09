using System.ComponentModel.DataAnnotations.Schema;
using backend.Domain.Entities;

namespace backend.Applications.DTOs.Patients;
public class PatientHistoryRecordDto
{


        public long? PatientId { get; set; }
 
        public string? ChronicDiseases { get; set; }
        public string? Allergies { get; set; }
        public string? PastSurgeries { get; set; }
        public string? FamilyMedicalHistory { get; set; }
}