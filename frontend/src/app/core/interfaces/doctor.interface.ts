export interface DoctorInterface {
  id: number
  name: string
  specialtyId: number
  licenseNumber: string
  phoneNumber: string
  consultationFee: number
  followupFee: number
  specialty: Specialty
  bio: any
  schedules: Schedule[]
}

export interface UpdateDoctor {
  name?: string
  specialtyId?: number
  licenseNumber?: string
  phoneNumber?: string
  consultationFee?: number
  followupFee?: number
  specialty?: Specialty
  bio?: any
}
export interface Specialty {
  id: number
  name: string
  description: any
}

export interface Schedule {
  dayOfWeek: string
  startTime: string
  endTime: string
  maxAppointments: number
}
