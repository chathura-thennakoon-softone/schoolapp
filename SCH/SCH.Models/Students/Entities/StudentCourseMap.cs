namespace SCH.Models.Students.Entities
{
    public class StudentCourseMap
    {
        public int StudentId { get; set; }

        public required Student Student { get; set; }

        public int CourseId { get; set; }

        public required Course Course { get; set; }

        public DateTime EnrollmentDate { get; set; }
    }
}
