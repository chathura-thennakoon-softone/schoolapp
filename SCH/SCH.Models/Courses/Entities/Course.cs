namespace SCH.Models.Courses.Entities
{
    using SCH.Models.StudentCourseMap.Entities;

    public class Course
    {
        public int Id { get; set; }

        public required string Name { get; set; }

        public required ICollection<StudentCourseMap> StudentCourseMaps { get; set; }
    }
}
