namespace SCH.Models.Students.Entities
{
    public class Course
    {
        public int Id { get; set; }

        public required string Name { get; set; }

        public required ICollection<StudentCourseMap> StudentCourses { get; set; }
    }
}
