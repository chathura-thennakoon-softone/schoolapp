namespace SCH.Services.Students
{
    using SCH.Models.Students.ClientDtos;

    public interface IStudentsService: IService
    {
        Task<List<StudentDto>> GetStudentsAsync(bool? isActive);

        Task<StudentDto?> GetStudentAsync(int id);

        Task<int> InsertStudentAsync(StudentDto student);

        Task UpdateStudentAsync(StudentDto student);

        Task DeleteStudentAsync(int id);
    }
}
