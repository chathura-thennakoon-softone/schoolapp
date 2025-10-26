﻿namespace SCH.Repositories.DbContexts
{
    using Microsoft.EntityFrameworkCore;
    using SCH.Models.Courses.Entities;
    using SCH.Models.Teachers.Entities;
    using SCH.Models.StudentCourseMap.Entities;
    using SCH.Models.Students.Entities;
    using SCH.Models.Users.Entities;

    /// <summary>
    /// Database context for domain entities (dbo schema)
    /// </summary>
    public class SCHContext : DbContext
    {
        public SCHContext(DbContextOptions<SCHContext> options)
            : base(options)
        {
        }

        internal DbSet<User> Users { get; set; }

        internal DbSet<Student> Student { get; set; }

        internal DbSet<Course> Course { get; set; }

        internal DbSet<Teacher> Teacher { get; set; }

        internal DbSet<StudentCourseMap> StudentCourseMap { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Set default schema for all domain tables
            modelBuilder.HasDefaultSchema("dbo");

            // Configure User entity (domain user)
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("User", "dbo");
                entity.HasKey(e => e.Id);

                entity.Property(e => e.AspNetUserId)
                    .IsRequired();

                entity.Property(e => e.FirstName)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.LastName)
                    .IsRequired()
                    .HasMaxLength(100);

                // Create index on AspNetUserId for performance
                entity.HasIndex(e => e.AspNetUserId)
                    .IsUnique(); // One domain user per identity user

            });

            // Configure Student entity
            modelBuilder.Entity<Student>(entity =>
            {
                entity.ToTable("Student", "dbo");
                entity.Property(e => e.FirstName).HasColumnType("nvarchar(400)");
                entity.Property(e => e.LastName).HasColumnType("nvarchar(400)");
                entity.Property(e => e.Email).HasColumnType("nvarchar(400)");
                entity.Property(e => e.PhoneNumber).HasColumnType("nvarchar(20)");
                entity.Property(e => e.SSN).HasColumnType("nvarchar(20)");
                entity.Property(e => e.Image).HasColumnType("nvarchar(400)");
                entity.Property(e => e.StartDate).HasColumnType("date");
            });

            // Configure Course entity
            modelBuilder.Entity<Course>(entity =>
            {
                entity.ToTable("Course", "dbo");
                entity.Property(e => e.Name).HasColumnType("nvarchar(400)");
            });

            // Configure Teacher entity
            modelBuilder.Entity<Teacher>(entity =>
            {
                entity.ToTable("Teacher", "dbo");
                entity.Property(e => e.Name).HasColumnType("nvarchar(400)");
            });


            // Configure StudentCourseMap entity
            modelBuilder.Entity<StudentCourseMap>(entity =>
            {
                entity.ToTable("StudentCourseMap", "dbo");
                
                entity.HasKey(sc => new { sc.StudentId, sc.CourseId });

                entity.HasOne(sc => sc.Student)
                    .WithMany(s => s.StudentCourseMaps)
                    .HasForeignKey(sc => sc.StudentId);

                entity.HasOne(sc => sc.Course)
                    .WithMany(c => c.StudentCourseMaps)
                    .HasForeignKey(sc => sc.CourseId);
            });
        }
    }
}
