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

        internal DbSet<Course> Course { get; set; }

        internal DbSet<StudentCourseMap> StudentCourseMap { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Student>(entity =>
            {
                entity.Property(e => e.FirstName).HasColumnType("nvarchar(400)");
                entity.Property(e => e.LastName).HasColumnType("nvarchar(400)");
                entity.Property(e => e.Email).HasColumnType("nvarchar(400)");
                entity.Property(e => e.PhoneNumber).HasColumnType("nvarchar(20)");
                entity.Property(e => e.SSN).HasColumnType("nvarchar(20)");
                entity.Property(e => e.Image).HasColumnType("nvarchar(400)");
                entity.Property(e => e.StartDate).HasColumnType("date");
            });

            modelBuilder.Entity<Course>(entity =>
            {
                entity.Property(e => e.Name).HasColumnType("nvarchar(400)");
            });


            modelBuilder.Entity<StudentCourseMap>()
                .HasKey(sc => new { sc.StudentId, sc.CourseId });

            modelBuilder.Entity<StudentCourseMap>()
                .HasOne(sc => sc.Student)
                .WithMany(s => s.StudentCourses)
                .HasForeignKey(sc => sc.StudentId);

            modelBuilder.Entity<StudentCourseMap>()
                .HasOne(sc => sc.Course)
                .WithMany(c => c.StudentCourses)
                .HasForeignKey(sc => sc.CourseId);
        }
    }
}
