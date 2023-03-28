using Microsoft.AspNetCore.Mvc;
using Models;
using MongoDB.Bson;

[ApiController]
[Route("[controller]")]

public class AdTutorController: ControllerBase{

    private readonly IAdTutorRepository _iadTutorRepository;
    private readonly IStudentRepository _istudentRepository;
    private readonly ISubjectRepository _isubjectRepository;
    public AdTutorController(IAdTutorRepository adTutorRepository, IStudentRepository istudentRepository, ISubjectRepository subjectRepository){
       _iadTutorRepository= adTutorRepository;
       _istudentRepository= istudentRepository;
       _isubjectRepository= subjectRepository;

    }

    [HttpGet]
    [Route("GetAdTutor")]
    public async Task<IActionResult> Get(){
        var tut = await _iadTutorRepository.GetAllAsync();
           if (!tut.Any() || tut==null){
            return StatusCode(202,"List is empty");
        }
        return Ok(tut.Select(p=> new{
            id= p.AID,
            date= p.Date,
            summary= p.Summary,
            studentAd= p.StudentAd,
            yearOfStudies = p.YearOfStudies,
            typeOfStudies = p.TypeOfStudies,
            subject = p.SubjectAdTutor,
            subjectName= (_isubjectRepository.GetSubjectName(p.SubjectAdTutor)).Result,
            facultyName= (_isubjectRepository.GetFacultyOfSubject(p.SubjectAdTutor)).Result,
            studentUsername= ( _istudentRepository.GetStudentUsername(p.StudentAd)).Result
        }).ToList());
    }

    [HttpGet]
    [Route("GetById/{id}")]
    public async Task<IActionResult> GetById(string id){
       
        var adt = await _iadTutorRepository.GetByIdAsync(id);
        if(adt == null){
            return NotFound();
        }

        return Ok(new{
            id  = adt.AID,
            date= adt.Date,
            summary = adt.Summary,
            yearofstudies = adt.YearOfStudies,
            typeofstudies = adt.TypeOfStudies,
            student = adt.StudentAd,
            subject = adt.SubjectAdTutor

        });
    }


    [HttpPost]
    [Route("CreateAdTutor")]
    public async Task<IActionResult> CreateAdTutor([FromBody]AdTutorCreateDTO adt){
      
        var student = await _istudentRepository.GetById(adt.StudentAd);
        AdTutor newAdsb = new AdTutor();
        newAdsb.AID= ObjectId.GenerateNewId().ToString();
        newAdsb.Date= DateTime.Now;
        newAdsb.Summary= adt.Summary;
        newAdsb.StudentAd= adt.StudentAd;
        newAdsb.YearOfStudies = adt.YearOfStudies;
        newAdsb.TypeOfStudies = adt.TypeOfStudies;
        newAdsb.SubjectAdTutor = adt.SubjectAdTutor;
  
        await _iadTutorRepository.CreateAdTutorAsync(newAdsb, student,newAdsb.SubjectAdTutor);
        return CreatedAtAction(nameof(Get), new {id = newAdsb.AID}, newAdsb); 
    }

    [HttpPut]
    [Route("UpdateAdTutor")]
    public async Task<IActionResult> UpdateAdTutor([FromBody]AdTutorDto updatead){
      
        var adt = await _iadTutorRepository.GetByIdAsync(updatead.AID);

        if(adt == null){
            return NotFound();
        }
        if(!string.IsNullOrWhiteSpace(updatead.Summary)){
            adt.Summary = updatead.Summary;
        }
        if(updatead.YearOfStudies != null){
            adt.YearOfStudies = updatead.YearOfStudies;
        }
        if(updatead.TypeOfStudies != null){
            adt.TypeOfStudies = updatead.TypeOfStudies;
        }
        adt.Date= DateTime.Now;
        var student= await _istudentRepository.GetById(adt.StudentAd);
        student.AdsTutor.Remove(student.AdsTutor.Where(p=>p.AID== adt.AID).FirstOrDefault());
        student.AdsTutor.Add(adt);
        await _istudentRepository.UpdateStudent(student);
        var subject= await _isubjectRepository.GetByIdAsync(adt.SubjectAdTutor);
        subject.SubjectAdTutor.Remove(subject.SubjectAdTutor.Where(p=>p.AID==adt.AID).FirstOrDefault());
        subject.SubjectAdTutor.Add(adt);
        await _iadTutorRepository.UpdateAdTutuorAsync(adt);
        return Ok("AdTutor updated!");
    }

    [HttpDelete]
    [Route("DeleteAdTutor/{id}")]
    public async Task<IActionResult> DeleteAdTutor(string id){
       
        var asb = await _iadTutorRepository.GetByIdAsync(id);
        if (asb == null){
            return NotFound();
        }
        await _iadTutorRepository.DeleteAdTutorAsync(id);
        return Ok("AdTutor deleted!");
    }

}