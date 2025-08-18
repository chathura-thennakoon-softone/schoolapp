namespace SCH.Services.Courses
{
    using SCH.Models.StudentCourseMap.Entities;
    using SCH.Models.Courses.ClientDtos;
    using SCH.Models.Courses.Entities;
    using SCH.Repositories.Courses;
    using SCH.Repositories.UnitOfWork;
    using SCH.Shared.Exceptions;

    internal class CoursesService: ICoursesService
    {
        private readonly ISCHUnitOfWork unitOfWork;
        private readonly ICoursesRepository coursesRepository;


        public CoursesService(
            ISCHUnitOfWork unitOfWork,
            ICoursesRepository coursesRepository) 
        { 
            this.unitOfWork = unitOfWork;
            this.coursesRepository = coursesRepository;
        }

        public async Task<List<CourseDto>> GetCoursesAsync()
        {
            List<Course> courses = await coursesRepository
                .GetCoursesAsync();

            List<CourseDto> courseDtos = courses
                .Select(c => new CourseDto 
                { 
                    Id = c.Id,
                    Name = c.Name
                }).ToList();

            return courseDtos;
        }

        public async Task<CourseDto?> GetCourseAsync(int id)
        {
            CourseDto? courseDto = null;
            Course? course = await coursesRepository.GetCourseAsync(id);

            if (course != null)
            {
                courseDto = new CourseDto
                {
                    Id= course.Id,
                    Name = course.Name
                };
            }

            return courseDto;
        }


        public async Task<int> InsertCourseAsync(CourseDto course)
        {
            Course courseEntity = new Course
            {
                Id = 0,
                Name = course.Name,
                StudentCourses = new List<StudentCourseMap>()
            };

            await coursesRepository.InsertCourseAsync(courseEntity);
            await unitOfWork.SaveChangesAsync();

            return courseEntity.Id;
        }

        public async Task UpdateCourseAsync(CourseDto course)
        {
            Course? courseEntity = await coursesRepository
                .GetCourseAsync(course.Id);

            if (courseEntity == null)
            {
                throw SCHDomainException.Notfound();
            }

            courseEntity.Name = course.Name;

            await unitOfWork.SaveChangesAsync();
        }

        public async Task DeleteCourseAsync(int id)
        {
            await coursesRepository
                .DeleteCourseAsync(id);

            await unitOfWork.SaveChangesAsync();
        }
    }
}
