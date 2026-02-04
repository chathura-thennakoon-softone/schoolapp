namespace SCH.Models.Courses.Entities
{
    using SCH.Models.Common.AuditableEntities;
    using SCH.Models.StudentCourseMap.Entities;

    public class Course : IAuditableEntity
    {
        public int Id { get; set; }

        public required string Name { get; set; }

        public required ICollection<StudentCourseMap> StudentCourseMaps { get; set; }

        // Audit properties
        public int CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
    }
}
