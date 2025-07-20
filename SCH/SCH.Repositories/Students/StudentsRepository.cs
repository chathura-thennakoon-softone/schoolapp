namespace SCH.Repositories.Students
{
    using Microsoft.EntityFrameworkCore;
    using SCH.Models.Students.Entities;
    using SCH.Repositories.DbContexts;
    using SCH.Shared.Exceptions;
    using System.Collections.Generic;

    internal class StudentsRepository: IStudentsRepository
    {
        private readonly SCHContext context;

        public StudentsRepository(SCHContext context) 
        {
            this.context = context;
        }

        public async Task<List<Student>> GetStudentsAsync(bool? isActive)
        {

            List<Student> students = await context
                .Student.Where(s => !isActive.HasValue || s.IsActive == isActive)
                .ToListAsync();

            return students;
        }

        public async Task<Student?> GetStudentAsync(int id)
        {
            Student? student = await context
                .Student.SingleOrDefaultAsync(s => s.Id == id);

            return student;
        }

        public async Task InsertStudentAsync(Student student)
        {                                     
            await context.Student.AddAsync(student);
        }

        public async Task DeleteStudentAsync(int id)
        {

            Student? studentEntity = await context
                .Student.SingleOrDefaultAsync(s => s.Id == id);

            if (studentEntity != null)
            {
                context.Student.Remove(studentEntity);
            }
        }
    }
}
