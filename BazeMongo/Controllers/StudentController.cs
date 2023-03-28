using DTOs;
using Microsoft.AspNetCore.Mvc;
using Models;
using MongoDB.Bson;
using MongoDB.Driver;

[ApiController]
[Route("[controller]")]
public class StudentController: ControllerBase{

    private readonly IStudentRepository _istudentRepository;
    private readonly IProfessorRepository _iprofessorRepository;
    private readonly IAdStudyBuddyRepository _iadStudyBuddyRepository;
    private readonly IAdTutorRepository _iadTutorRepository;
    private readonly ICommentRepository _icommentRepository;
    private readonly IRateRepositroy _irateRepository;
    private readonly IFacultyRepository _ifacultyRepository;
    private readonly ISubjectRepository _isubjectRepository;
    public StudentController(IStudentRepository studentRepository,IProfessorRepository professorRepository, IAdStudyBuddyRepository adStudyBuddyRepository, IAdTutorRepository adTutorRepository, ICommentRepository commentRepository,IRateRepositroy rateRepositroy, IFacultyRepository facultyRepository, ISubjectRepository subjectRepository){
       _istudentRepository= studentRepository;
       _iprofessorRepository= professorRepository;
       _iadStudyBuddyRepository= adStudyBuddyRepository;
       _iadTutorRepository= adTutorRepository;
       _icommentRepository= commentRepository;
       _irateRepository= rateRepositroy;
       _ifacultyRepository= facultyRepository;
       _isubjectRepository= subjectRepository;
    }

    [HttpPost]
    [Route("CreateStudent")]
    public async Task<IActionResult> CreateStudent([FromBody]StudentDto s)
    {
        await _istudentRepository.CreateNewStudentAsync(s);
        return Ok("Dodato");
    }

    [HttpGet]
    [Route("GetStudentById/{id}")]
    public async Task<ActionResult<Student>> GetStudentById(string id)
    {
        var resp= await _istudentRepository.GetById(id);
        if(resp==null)
        {
            return BadRequest("Bad id.");
        }
        else 
            return resp;

     
    }
    
    [HttpGet]
    [Route("GetAllStudents")]
    public async Task<IActionResult> GetAllStudents()
    {
        var k=await _istudentRepository.GetAllAsync();
       return Ok(k);
    }

    [HttpPut]
    [Route("UpdateStudent")]
    public async Task<IActionResult> UpdateStudent([FromBody]UpdateStudentDto student)
    {
        var resp= await _istudentRepository.GetById(student.Id);
        if(resp.Username!=student.Username)
            resp.Username=student.Username;

        if(resp.FacultyStudent.FID!= student.FacultyStudent){
            resp.FacultyStudent.FID= student.FacultyStudent;
            resp.FacultyStudent.NameOfFaculty= _ifacultyRepository.GetFacultyName(student.FacultyStudent).Result; 
        }

        if(resp.Name!= student.Name)
            resp.Name=student.Name;

        if(resp.Surname!=student.Surname)
            resp.Surname=student.Surname;

        if(resp.City!=student.City)
            resp.City=student.City;

        if(resp.YearOfStudies!=student.YearOfStudies)
            resp.YearOfStudies=student.YearOfStudies;

        if(resp.TypeOfStudies!=student.TypeOfStudies!)
            resp.TypeOfStudies=student.TypeOfStudies;
            
        await _istudentRepository.UpdateStudent(resp);
        return Ok("Done.");
    }

    [HttpDelete]
    [Route("DeleteStudent/{id}")]
    public async Task<IActionResult> DeleteStudent(string id){
   
        var resp= await _istudentRepository.GetById(id);
        if(resp==null)
        {
            return BadRequest("Bad id.");
        }
        IList<AdStudyBuddy> adsb= resp.AdsStudyBuddy;
        IList<AdTutor> at= resp.AdsTutor;
        var comments= await _icommentRepository.ReturnCommentsByStudent(resp.UID);
        var rates= await _irateRepository.ReturnRatesByStudent(resp.UID);
        if(rates!=null){
            foreach (var rate in rates)
            {
                await _irateRepository.DeleteRateAsync(rate.RID);
            }
        }
        if(comments!=null){
            foreach (var com in comments)
            {
                await _icommentRepository.DeleteCommentAsync(com.CID);
            }
        }
        if(adsb!=null){
            foreach (var ads in adsb)
            {
                await _iadStudyBuddyRepository.DeleteAdSBAsync(ads.AID);
            }
        }
        if(at!=null){
            foreach (var adt in at)
            {
                await _iadTutorRepository.DeleteAdTutorAsync(adt.AID);
            }
        }
    
        int rez= await _istudentRepository.DeleteStudentAsync(resp.UID);

        if(rez==0)
        {
            return BadRequest("Not deleted");
        }
        return Ok("Obrisano");
    }

    [HttpGet]
    [Route("ListAllAdRoomatesByStudent/{id}")]
    public async Task<IActionResult> ListAllAdRoomatesByStudent(string id)
    {
        Student s = await _istudentRepository.GetById(id);
        if(s==null)
        {
            return BadRequest("Student does not exist!");
        }
        IList<AdRoommate>lista=await _istudentRepository.ReturnAdRoomatesByStudent(s);
        var k =lista.ToList();
        return Ok
        (k.Select(pp=> new{
            Flat= pp.Flat,
            City= pp.City,
            NumberOfRoommates= pp.NumberOfRoommates,
            Aid= pp.AID,
            Date= pp.Date,
            Summary= pp.Summary,
            StudentAd= pp.StudentAd
        }));     
    }

   [HttpGet]
   [Route("ListAllAdSBByStudent/{id}")]
    public async Task<IActionResult> ListAllAdSBByStudent(string id)
    {
        Student s = await _istudentRepository.GetById(id);
        if(s==null)
        {
            return BadRequest("Student does not exist!");
        }
        IList<AdStudyBuddy>lista=await _istudentRepository.ReturnAdSBByStudent(s);
        var k =lista.ToList();
        return Ok
        (k.Select(pp=> new{
           AID=pp.AID,
           Date=pp.Date,
           Summary=pp.Summary,
           StudentAd=pp.StudentAd, 
           YearOfStudies=pp.YearOfStudies,
           TypeOfStudies=pp.TypeOfStudies,
           SubjectAdStudyBuddy= (_isubjectRepository.GetSubjectName(pp.SubjectAdStudyBuddy).Result)
        }));    
    }

   [HttpGet]
   [Route("ListAllAdTutorByStudent/{id}")]
    public async Task<IActionResult> ListAllAdTutorByStudent(string id)
    {
        Student s = await _istudentRepository.GetById(id);
        if(s==null)
        {
            return BadRequest("Student does not exist!");
        }
        IList<AdTutor>lista=await _istudentRepository.ReturnAdTutorByStudent(s);
        var k =lista.ToList();
        return Ok
        (k.Select(pp=> new{
           AID=pp.AID,
           Date=pp.Date,
           Summary=pp.Summary,
           StudentAd=pp.StudentAd, 
           YearOfStudies=pp.YearOfStudies,
           TypeOfStudies=pp.TypeOfStudies,
           SubjectAdTutor= (_isubjectRepository.GetSubjectName(pp.SubjectAdTutor).Result)
        }));      
    }
}
 
