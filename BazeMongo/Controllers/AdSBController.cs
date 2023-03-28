using Microsoft.AspNetCore.Mvc;
using Models;
using MongoDB.Bson;

[ApiController]
[Route("[controller]")]

public class AdSBController: ControllerBase{

    private readonly IAdStudyBuddyRepository _iadSBRepository;
    private readonly IStudentRepository _istudentRepository;
    private readonly ISubjectRepository _isubjectRepository;
    public AdSBController(IAdStudyBuddyRepository adSBRepository, IStudentRepository istudentRepository, ISubjectRepository subjectRepository){
       _iadSBRepository= adSBRepository;
       _istudentRepository= istudentRepository;
       _isubjectRepository= subjectRepository;

    }

    [HttpGet]
    [Route("GetAdSB")]
    public async Task<IActionResult> Get(){
        var adSB = await _iadSBRepository.GetAllAsync();
           if (!adSB.Any() || adSB==null){
            return StatusCode(202,"List is empty");
        }
        return Ok(adSB.Select(p=> new{
            id= p.AID,
            date= p.Date,
            summary= p.Summary,
            studentAd= p.StudentAd,
            yearOfStudies = p.YearOfStudies,
            typeOfStudies = p.TypeOfStudies,
            subject = p.SubjectAdStudyBuddy,
            subjectName= (_isubjectRepository.GetSubjectName(p.SubjectAdStudyBuddy)).Result,
            facultyName= (_isubjectRepository.GetFacultyOfSubject(p.SubjectAdStudyBuddy)).Result,
            studentUsername= ( _istudentRepository.GetStudentUsername(p.StudentAd)).Result
        }).ToList());
    }

    [HttpGet]
    [Route("GetById/{id}")]
    public async Task<IActionResult> GetById(string id){
        
        var adsb = await _iadSBRepository.GetByIdAsync(id);
        if(adsb == null){
            return NotFound();
        }

        return Ok(new{
            id  = adsb.AID,
            date= adsb.Date,
            summary = adsb.Summary,
            yearofstudies = adsb.YearOfStudies,
            typeofstudies = adsb.TypeOfStudies,
            student = adsb.StudentAd,
            subject = adsb.SubjectAdStudyBuddy

        });
    }


    [HttpPost]
    [Route("CreateAdStudyBuddy")]
    public async Task<IActionResult> CreateAdStudyBuddy([FromBody]AdSBCreateDTO asb){
        var student = await _istudentRepository.GetById(asb.StudentAd);
        AdStudyBuddy newAdsb = new AdStudyBuddy();
        newAdsb.AID= ObjectId.GenerateNewId().ToString();
        newAdsb.Date= DateTime.Now;
        newAdsb.Summary= asb.Summary;
        newAdsb.StudentAd= asb.StudentAd;
        newAdsb.YearOfStudies = asb.YearOfStudies;
        newAdsb.TypeOfStudies = asb.TypeOfStudies;
        newAdsb.SubjectAdStudyBuddy = asb.SubjectAdStudyBuddy;
  
        await _iadSBRepository.CreateAdSBAsync(newAdsb,student,asb.SubjectAdStudyBuddy);
        return CreatedAtAction(nameof(Get), new {id = newAdsb.AID}, newAdsb); 
    }

    [HttpPut]
    [Route("UpdateAdStudyBuddy")]
    public async Task<IActionResult> UpdateAdStudyBuddy([FromBody]AdStudyBuddyDto uasb){
        
        var adsb = await _iadSBRepository.GetByIdAsync(uasb.AID);

        if(adsb == null){
            return NotFound();
        }
        if(!string.IsNullOrWhiteSpace(uasb.Summary)){
            adsb.Summary = uasb.Summary;
        }
        if(uasb.YearOfStudies != null){
            adsb.YearOfStudies = uasb.YearOfStudies;
        }
        if(uasb.TypeOfStudies != null){
            adsb.TypeOfStudies = uasb.TypeOfStudies;
        }
         var student= await _istudentRepository.GetById(adsb.StudentAd);
        adsb.Date= DateTime.Now;
        student.AdsStudyBuddy.Remove(student.AdsStudyBuddy.Where(p=>p.AID== adsb.AID).FirstOrDefault());
        student.AdsStudyBuddy.Add(adsb);
        var subject= await _isubjectRepository.GetByIdAsync(adsb.SubjectAdStudyBuddy);
        subject.SubjectAdStudyBuddy.Remove(subject.SubjectAdStudyBuddy.Where(p=>p.AID==adsb.AID).FirstOrDefault());
        subject.SubjectAdStudyBuddy.Add(adsb);
        await _istudentRepository.UpdateStudent(student);
        await _iadSBRepository.UpdateAdSBAsync(adsb);
        return Ok("AdStudyBuddy updated!");
    }

    [HttpDelete]
    [Route("DeleteAdStudyBuddy/{id}")]
    public async Task<IActionResult> DeleteAdStudyBuddy(string id){
       
        var asb = await _iadSBRepository.GetByIdAsync(id);
        if (asb == null){
            return NotFound();
        }
        await _iadSBRepository.DeleteAdSBAsync(id);
        return Ok("AdStudyBuddy deleted!");
    }

}