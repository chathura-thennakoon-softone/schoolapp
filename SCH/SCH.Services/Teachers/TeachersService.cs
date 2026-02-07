namespace SCH.Services.Teachers
{
    using SCH.Models.Teachers.ClientDtos;
    using SCH.Models.Teachers.Entities;
    using SCH.Repositories.Teachers;
    using SCH.Repositories.UnitOfWork;
    using SCH.Shared.Exceptions;

    internal class TeachersService: ITeachersService
    {
        private readonly ISCHUnitOfWork unitOfWork;
        private readonly ITeachersRepository teachersRepository;

        public TeachersService(
            ISCHUnitOfWork unitOfWork,
            ITeachersRepository teachersRepository)
        {
            this.unitOfWork = unitOfWork;
            this.teachersRepository = teachersRepository;
        }

        public async Task<List<TeacherDto>> GetTeachersAsync()
        {
            List<Teacher> teachers = await teachersRepository
                .GetTeachersAsync();

            List<TeacherDto> teacherDtos = teachers
                .Select(t => new TeacherDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    RowVersion = t.RowVersion
                }).ToList();

            return teacherDtos;
        }

        public async Task<TeacherDto?> GetTeacherAsync(int id)
        {
            TeacherDto? teacherDto = null;
            Teacher? teacher = await teachersRepository.GetTeacherAsync(id);

            if (teacher != null)
            {
                teacherDto = new TeacherDto
                {
                    Id = teacher.Id,
                    Name = teacher.Name,
                    RowVersion = teacher.RowVersion
                };
            }

            return teacherDto;
        }

        public async Task<int> InsertTeacherAsync(TeacherDto teacher)
        {
            Teacher teacherEntity = new Teacher
            {
                Id = 0,
                Name = teacher.Name
            };

            await teachersRepository.InsertTeacherAsync(teacherEntity);
            await unitOfWork.SaveChangesAsync();

            return teacherEntity.Id;
        }

        public async Task UpdateTeacherAsync(TeacherDto teacher)
        {
            Teacher? teacherEntity = await teachersRepository
                .GetTeacherAsync(teacher.Id);

            if (teacherEntity == null)
            {
                throw SCHDomainException.NotFound();
            }

            // Map DTO to entity
            teacherEntity.Name = teacher.Name;

            // Include RowVersion from frontend for concurrency check
            teacherEntity.RowVersion = teacher.RowVersion ?? teacherEntity.RowVersion;

            // Repository handles concurrency check
            teachersRepository.UpdateAsync(teacherEntity);
            await unitOfWork.SaveChangesAsync();
        }

        public async Task DeleteTeacherAsync(int id)
        {
            await teachersRepository
                .DeleteTeacherAsync(id);

            await unitOfWork.SaveChangesAsync();
        }
    }
}


