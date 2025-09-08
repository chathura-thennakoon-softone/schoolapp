namespace SCH.Repositories.Teachers
{
    using Microsoft.EntityFrameworkCore;
    using SCH.Models.Teachers.Entities;
    using SCH.Repositories.DbContexts;

    internal class TeachersRepository: ITeachersRepository
    {
        private readonly SCHContext context;

        public TeachersRepository(SCHContext context)
        {
            this.context = context;
        }

        public async Task<List<Teacher>> GetTeachersAsync()
        {
            List<Teacher> teachers = await context
                .Teacher
                .ToListAsync();

            return teachers;
        }

        public async Task<Teacher?> GetTeacherAsync(int id)
        {
            Teacher? teacher = await context
                .Teacher.SingleOrDefaultAsync(s => s.Id == id);

            return teacher;
        }

        public async Task InsertTeacherAsync(Teacher teacher)
        {
            await context.Teacher.AddAsync(teacher);
        }

        public async Task DeleteTeacherAsync(int id)
        {
            Teacher? teacherEntity = await context
                .Teacher.SingleOrDefaultAsync(s => s.Id == id);

            if (teacherEntity != null)
            {
                context.Teacher.Remove(teacherEntity);
            }
        }
    }
}


