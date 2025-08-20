namespace SCH.Services.Students
{
    using SCH.Models.Courses.Entities;
    using SCH.Models.StudentCourseMap.ClientDtos;
    using SCH.Models.StudentCourseMap.Entities;
    using SCH.Models.Students.ClientDtos;
    using SCH.Models.Students.Entities;
    using SCH.Repositories.Courses;
    using SCH.Repositories.StudentCourseMap;
    using SCH.Repositories.Students;
    using SCH.Repositories.UnitOfWork;
    using SCH.Shared.Exceptions;

    internal class StudentsService: IStudentsService
    {
        private readonly ISCHUnitOfWork unitOfWork;
        private readonly IStudentsRepository studentsRepository;
        private readonly ICoursesRepository coursesRepository;
        private readonly IStudentCourseMapRepository studentCourseMapRepository;


        public StudentsService(
            ISCHUnitOfWork unitOfWork,
            IStudentsRepository studentsRepository,
            ICoursesRepository coursesRepository,
            IStudentCourseMapRepository studentCourseMapRepository) 
        { 
            this.unitOfWork = unitOfWork;
            this.studentsRepository = studentsRepository;
            this.coursesRepository = coursesRepository;
            this.studentCourseMapRepository = studentCourseMapRepository;
        }

        public async Task<List<StudentDto>> GetStudentsAsync(bool? isActive)
        {
            List<Student> students = await studentsRepository
                .GetStudentsAsync(isActive);

            List<StudentDto> studentDtos = students
                .Select(s => new StudentDto 
                { 
                    Id = s.Id,
                    FirstName = s.FirstName,
                    LastName = s.LastName,
                    Email = s.Email,
                    Image = s.Image,
                    IsActive = s.IsActive,
                    PhoneNumber = s.PhoneNumber,
                    SSN = s.SSN,
                    StartDate = s.StartDate   
                }).ToList();

            return studentDtos;
        }

        public async Task<StudentDto?> GetStudentAsync(int id)
        {
            StudentDto? studentDto = null;
            Student? student = await studentsRepository.GetStudentAsync(id);

            if (student != null)
            {
                studentDto = new StudentDto
                {
                    Id= student.Id,
                    FirstName = student.FirstName,
                    LastName = student.LastName,
                    Email = student.Email,
                    Image = student.Image,
                    IsActive = student.IsActive,
                    PhoneNumber = student.PhoneNumber,
                    SSN = student.SSN,
                    StartDate = student.StartDate,
                    Courses = student.StudentCourseMaps
                        .Select(scm => new StudentCourseMapDto
                        {
                            StudentId = scm.StudentId,
                            CourseId = scm.CourseId,
                            EnrollmentDate = scm.EnrollmentDate,
                            CourseName = scm.Course!.Name,
                            StudentFirstName = student.FirstName,
                            StudentLastName = student.LastName
                        }).ToList()
                };
            }

            return studentDto;
        }

        public async Task<int> InsertStudentAsync(StudentDto student)
        {
            Student studentEntity = new Student
            {
                Id = 0,
                FirstName = student.FirstName,
                LastName = student.LastName,
                Email = student.Email,
                Image = student.Image,
                IsActive = student.IsActive,
                PhoneNumber = student.PhoneNumber,
                SSN = student.SSN,
                StartDate = student.StartDate,
                StudentCourseMaps = student.Courses
                    .Select(c => new StudentCourseMap
                    {
                        CourseId = c.CourseId,
                        EnrollmentDate = c.EnrollmentDate,
                    }).ToList()
            };

            await studentsRepository.InsertStudentAsync(studentEntity);
            await unitOfWork.SaveChangesAsync();

            return studentEntity.Id;
        }

        public async Task UpdateStudentAsync(StudentDto student)
        {
            Student? studentEntity = await studentsRepository
                .GetStudentAsync(student.Id);

            if (studentEntity == null)
            {
                throw SCHDomainException.Notfound();
            }

            studentEntity.FirstName = student.FirstName;
            studentEntity.LastName = student.LastName;
            studentEntity.Email = student.Email;
            studentEntity.Image = student.Image;
            studentEntity.IsActive = student.IsActive;
            studentEntity.PhoneNumber = student.PhoneNumber;
            studentEntity.SSN = student.SSN;
            studentEntity.StartDate = student.StartDate;

            List<StudentCourseMap> deletedMaps = studentEntity
                .StudentCourseMaps
                .Where(scm => !student
                    .Courses.Any(c => c.CourseId == scm.CourseId))
                .ToList();

            foreach (StudentCourseMap sc in deletedMaps)
            {
                studentEntity.StudentCourseMaps.Remove(sc);
            }

            List<StudentCourseMap> newMaps = student
                .Courses
                .Where(c => !studentEntity
                    .StudentCourseMaps.Any(scm => scm.CourseId == c.CourseId))
                .Select(c => new StudentCourseMap
                {
                    CourseId = c.CourseId,
                    EnrollmentDate = c.EnrollmentDate,
                    StudentId = studentEntity.Id
                }).ToList();

            foreach (StudentCourseMap sc in newMaps)
            {
                studentEntity.StudentCourseMaps.Add(sc);
            }

            await unitOfWork.SaveChangesAsync();
        }

        public async Task DeleteStudentAsync(int id)
        {
            await studentsRepository
                .DeleteStudentAsync(id);

            await unitOfWork.SaveChangesAsync();
        }

        public async Task<List<StudentCourseMapDto>> GetCoursesAsync(int id)
        {
            List<StudentCourseMap> courses = await studentCourseMapRepository
                .GetStudentCourseMapsByStudentAsync(id);

            List<StudentCourseMapDto> courseDtos = courses
                .Select(c => new StudentCourseMapDto
                {
                    StudentId = c.StudentId,
                    CourseId = c.CourseId,
                    EnrollmentDate = c.EnrollmentDate,
                    CourseName = c.Course!.Name,
                    StudentFirstName = c.Student!.FirstName,
                    StudentLastName = c.Student.LastName
                }).ToList();

            return courseDtos;
        }

        public async Task InsertCourseAsync(StudentCourseMapDto studentCourseMap)
        {
            Student? student = await studentsRepository
                .GetStudentAsync(studentCourseMap.StudentId);

            if (student == null)
            {
                throw SCHDomainException.Notfound("Student not found.");
            }

            Course? course = await coursesRepository
                .GetCourseAsync(studentCourseMap.CourseId);

            if (course == null)
            {
                throw SCHDomainException.Notfound("Course not found.");
            }

            StudentCourseMap? existingStudentCourseMap = await studentCourseMapRepository
                .GetStudentCourseMapAsync(
                    studentCourseMap.StudentId,
                    studentCourseMap.CourseId);

            if (existingStudentCourseMap != null)
            {
                throw SCHDomainException.Conflict(
                    "This course is already assigned to the student.");
            }

            StudentCourseMap newStudentCourseMap = new StudentCourseMap
            {
                StudentId = student.Id,
                CourseId = course.Id,
                EnrollmentDate = studentCourseMap.EnrollmentDate
            };

            await studentCourseMapRepository
                .InsertStudentCourseMapAsync(newStudentCourseMap);
            await unitOfWork.SaveChangesAsync();
        }

        public async Task DeleteCourseAsync(int id, int courseId)
        {
            await studentCourseMapRepository
                .DeleteStudentCourseMapAsync(id, courseId);

            await unitOfWork.SaveChangesAsync();
        }
    }
}
