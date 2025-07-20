namespace SCH.Repositories.Students
{
    using SCH.Models.Students.Entities;

    public interface IStudentsRepository: IRepository
    {
        Task<List<Student>> GetStudentsAsync(bool? isActive);

        Task<Student?> GetStudentAsync(int id);

        Task InsertStudentAsync(Student student);

        Task DeleteStudentAsync(int id);
    }
}
