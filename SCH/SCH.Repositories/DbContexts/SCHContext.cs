namespace SCH.Repositories.DbContexts
{
    using Microsoft.EntityFrameworkCore;
    using SCH.Models.Students.Entities;

    public class SCHContext : DbContext
    {
        public SCHContext(DbContextOptions<SCHContext> options)
            : base(options)
        {
        }

        internal DbSet<Student> Student { get; set; }
    }
}
