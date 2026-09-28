export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  specialty: string;
  department: string;
  hospital: string;
  location: string;
  bio: string;
  avatar: string;
  status: 'Online' | 'In Consultation' | 'Away' | 'Offline';
  joinDate: string;
  consultationsCount: number;
  patientsCount: number;
  rating: number;
  experienceYears: number;
}

export interface PasswordUpdateForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordStrength {
  score: number; // 0 to 4
  label: 'Weak' | 'Fair' | 'Good' | 'Strong';
  color: string;
  hasMinLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}
