namespace SCH.Models.Teachers.Entities
{
    using SCH.Models.Common.AuditableEntities;

    public class Teacher : IAuditableEntity
    {
        public int Id { get; set; }

        public required string Name { get; set; }

        // Audit properties
        public int CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
    }
}


