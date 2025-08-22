namespace SCH.Repositories.Courses
{
    using Microsoft.EntityFrameworkCore;
    using SCH.Models.Courses.Entities;
    using SCH.Repositories.DbContexts;
    using System.Collections.Generic;

    internal class CoursesRepository: ICoursesRepository
    {
        private readonly SCHContext context;

        public CoursesRepository(SCHContext context) 
        {
            this.context = context;
        }

        public async Task<List<Course>> GetCoursesAsync()
        {

            List<Course> courses = await context
                .Course
                .ToListAsync();

            return courses;
        }

        public async Task<List<Course>> GetCoursesAsync(
            List<int> coursesIds)
        {

            List<Course> courses = await context
                .Course
                .Where(c => coursesIds.Contains(c.Id))
                .ToListAsync();

            return courses;
        }

        public async Task<Course?> GetCourseAsync(int id)
        {
            Course? course = await context
                .Course.SingleOrDefaultAsync(s => s.Id == id);

            return course;
        }

        public async Task InsertCourseAsync(Course course)
        {                                     
            await context.Course.AddAsync(course);
        }

        public async Task DeleteCourseAsync(int id)
        {

            Course? courseEntity = await context
                .Course.SingleOrDefaultAsync(s => s.Id == id);

            if (courseEntity != null)
            {
                context.Course.Remove(courseEntity);
            }
        }
    }
}
