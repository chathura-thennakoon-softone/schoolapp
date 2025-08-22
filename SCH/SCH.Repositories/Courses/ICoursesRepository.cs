﻿namespace SCH.Repositories.Courses
{
    using SCH.Models.Courses.Entities;

    public interface ICoursesRepository: IRepository
    {
        Task<List<Course>> GetCoursesAsync();

        Task<List<Course>> GetCoursesAsync(List<int> coursesIds);

        Task<Course?> GetCourseAsync(int id);

        Task InsertCourseAsync(Course course);

        Task DeleteCourseAsync(int id);
    }
}
