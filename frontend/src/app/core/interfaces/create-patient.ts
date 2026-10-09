export interface CreatePatient {
  nationalId: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  phoneNumber: string;
  emergencyPhone?: string;
  address?: string;
  bloodGroup?: string;

  medicalHistory: {
    chronicDiseases?: string;
    allergies?: string;
    pastSurgeries?: string;
    familyMedicalHistory?: string;
  };
}