// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace SCH.API.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using SCH.Models.Students.ClientDtos;
    using SCH.Services.Students;
    using SCH.Shared.Exceptions;

    [Route("api/[controller]")]
    [ApiController]
    public class StudentsController : ControllerBase
    {
        private readonly IStudentsService studentsService;

        public StudentsController(IStudentsService studentsService) 
        {
            this.studentsService = studentsService;     
        }

        // GET: api/<StudentsController>
        [HttpGet]
        public async Task<IActionResult> GetStudentAsync(
            bool? isActive = null)
        {
            List<StudentDto> students = await studentsService
                .GetStudentsAsync(isActive);

            return Ok(students);
        }

        // GET api/<StudentsController>/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetStudentAsync(int id)
        {
            IActionResult actionResult;
            if (id < 1)
            {
                throw SCHDomainException.BadRequest("Id should grater than 0");
            }

            StudentDto? student = await studentsService
                .GetStudentAsync(id);

            if (student is not null)
            {
                actionResult = Ok(student);
            }
            else
            {
                actionResult = NotFound();
            }

            return actionResult;
        }

        // POST api/<StudentsController>
        [HttpPost]
        public async Task<IActionResult> PostStudentAsync([FromBody] StudentDto student)
        {
            int id = await studentsService
                .InsertStudentAsync(student);

            return Ok(id);
        }

        // PUT api/<StudentsController>/5
        [HttpPatch("{id}")]
        public async Task<IActionResult> PatchStudentAsync(int id, [FromBody] StudentDto student)
        {
            if (id < 1)
            {
                throw SCHDomainException.BadRequest("Id should grater than 0");
            }

            student.Id = id;
            await studentsService
                .UpdateStudentAsync(student);

            return Ok();
        }

        // DELETE api/<StudentsController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            if (id < 1)
            {
                throw SCHDomainException.BadRequest("Id should grater than 0");
            }

            await studentsService
                .DeleteStudentAsync(id);

            return Ok();
        }
    }
}
