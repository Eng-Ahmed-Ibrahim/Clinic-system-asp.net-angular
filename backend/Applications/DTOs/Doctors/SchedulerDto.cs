namespace backend.Applications.DTOs.Doctors
{
    public class DoctorScheduleDto
    {
        public string DayOfWeek { get; set; } = null!;

        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public int MaxAppointments { get; set; } = 0;
    }
}