namespace SCH.Services.Students
{
    using SCH.Models.Students.ClientDtos;
    using SCH.Models.Students.Entities;
    using SCH.Repositories.Students;
    using SCH.Repositories.UnitOfWork;
    using SCH.Shared.Exceptions;

    internal class StudentsService: IStudentsService
    {
        private readonly ISCHUnitOfWork unitOfWork;
        private readonly IStudentsRepository studentsRepository;


        public StudentsService(
            ISCHUnitOfWork unitOfWork,
            IStudentsRepository studentsRepository) 
        { 
            this.unitOfWork = unitOfWork;
            this.studentsRepository = studentsRepository;
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
                    StartDate = student.StartDate
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
                StartDate = student.StartDate
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

            await unitOfWork.SaveChangesAsync();
        }

        public async Task DeleteStudentAsync(int id)
        {
            await studentsRepository
                .DeleteStudentAsync(id);

            await unitOfWork.SaveChangesAsync();
        }
    }
}
