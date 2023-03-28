using Microsoft.AspNetCore.Mvc;
using Models;
using MongoDB.Bson;
using MongoDB.Driver;

[ApiController]
[Route("[controller]")]
public class FiltersController: ControllerBase{

    private readonly IFacultyRepository _ifacultyRepository;
    private readonly IAdRoommateRepository _iadRoommateRepository;
    private readonly IStudentRepository _istudentRepository;
    private readonly IProfessorRepository _iprofessorRepository;
    private readonly ISubjectRepository _isubjectRepository;

    private readonly IAdStudyBuddyRepository _iadstudybuddyRepository;
      private readonly IAdTutorRepository _iadturorRepository;
    public FiltersController(IFacultyRepository facultyRepository, IAdRoommateRepository adRoommateRepository, IStudentRepository studentRepository,IAdStudyBuddyRepository adstudybuddyRepository,IAdTutorRepository adturorRepository
    ,IProfessorRepository professorRepository, ISubjectRepository subjectRepository){
       _ifacultyRepository= facultyRepository;
       _iadRoommateRepository= adRoommateRepository;
       _istudentRepository= studentRepository;
       _iadstudybuddyRepository = adstudybuddyRepository;
       _iadturorRepository = adturorRepository;
              _iprofessorRepository= professorRepository;
       _isubjectRepository= subjectRepository;
    }


    [Route("FilterAdRoommate/{city}/{numberOfRoommates}/{flat}")]
    [HttpGet]
    public async Task<ActionResult> FilterAdRoommate(string city, int numberOfRoommates,bool flat)
    {
        try
        {
            if(numberOfRoommates>0)
            {
                var ad = await _iadRoommateRepository.GetAdByFilters(city, numberOfRoommates, flat);
                if(ad.Count()==1)
                {
                    if(ad.Single().Summary.Equals("-1"))
                        return StatusCode(202,"Trenutno ne postoje oglasi koji odgovaraju odabranom broju cimera");
                    
                    if(ad.Single().Summary.Equals("-2"))
                        return StatusCode(202,"Trenutno ne postoje oglasi o cimeru u odabranom gradu za odabrani broj cimera");

                    if(ad.Single().Summary.Equals("-3"))
                        return StatusCode(202,"Trenutno ne postoje oglasi o cimeru sa datim podacima o stanu");                    
                }

                return Ok(
                ad.Select(p=>
                new{
                    id= p.AID,
                    city= p.City,
                    date= p.Date,
                    flat= p.Flat,
                    numberRoommate= p.NumberOfRoommates,
                    summary= p.Summary,
                    studentId= p.StudentAd,
                    studentUsername= ( _istudentRepository.GetStudentUsername(p.StudentAd)).Result
                }).ToList()
            );     
            }
            else{
                var ad= await _iadRoommateRepository.GetAdByFilters2(city,flat);
                if(ad.Count()==1)
                {
                if(ad.Single().Summary.Equals("-1"))
                        return StatusCode(202,"Trenutno ne postoje oglasi o cimeru u odabranom gradu za odabrani broj cimera");
                    
                if(ad.Single().Summary.Equals("-2"))
                        return StatusCode(202,"Trenutno ne postoje oglasi o cimeru sa datim podacima o stanu");                    
                }
                return Ok(
                ad.Select(p=>
                new{
                    id= p.AID,
                    city= p.City,
                    date= p.Date,
                    flat= p.Flat,
                    numberRoommate= p.NumberOfRoommates,
                    summary= p.Summary,
                    studentId= p.StudentAd,
                    studentUsername= ( _istudentRepository.GetStudentUsername(p.StudentAd)).Result
                }).ToList()
            );  
            }
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpGet]
    [Route("GetAdsRoommateByStudent/{idStud}")]
    public async Task<IActionResult> GetAdsRoommateByStudent(string idStud){
        var ads= await _iadRoommateRepository.GetByStudent(idStud);
        if (ads==null){
            return StatusCode(202,"There are no created ads for roommates.");
        }
        else 
            return Ok(ads.Select(p=> new{
            id= p.AID,
            city= p.City,
            date= p.Date,
            flat= p.Flat,
            numberRoommate= p.NumberOfRoommates,
            summary= p.Summary
            }).ToList());
    }


    [HttpGet]
    [Route("FiltersProfessor/{idSubject}")]
    public async Task<ActionResult> FiltersProfessor(string idSubject){
        try
            {
                var subject= await _isubjectRepository.GetByIdAsync(idSubject);
               if(subject==null){
                return BadRequest("Wrong id for subject!");
               }
               if(subject.SubjectProf.Any())
               return Ok(subject.SubjectProf.Select(p=> new{
                uid = _iprofessorRepository.GetProfessorIdByUsername(p.Username).Result,
                username= p.Username,
                education= p.Education,
                name= p.Name,
                surname= p.Surname
               }).ToList());
               return StatusCode(202,"Couldn't find professor.");
            }
            catch(Exception e){
                return BadRequest(e.Message);
            }
        }
        
    [HttpGet]
    [Route("GetAdsStudyBuddyByStudent/{idStud}")]
    public async Task<IActionResult> GetAdsStudyBuddyByStudent(string idStud){
        var ads= await _iadstudybuddyRepository.GetAdsByStudent(idStud);
        if (ads==null){
            return StatusCode(202,"There are no created ads for roommates.");
        }
        else 
        return Ok(ads.Select(p=> new{
            id= p.AID,
            date= p.Date,
            summary= p.Summary,
            yearOfStudies = p.YearOfStudies,
            typeOfStudies = p.TypeOfStudies,
            subject = p.SubjectAdStudyBuddy,
            }).ToList());
        }
        
    [Route("FilterAdStudyBuddy/{subjID}")]
    [HttpGet]
    public async Task<ActionResult> FilterAdStudyBuddy(string subjID)
    {
        try
        {
            var ad = await _iadstudybuddyRepository.FilterAds(subjID);
            if(ad.Count()==0)
            {    
                return StatusCode(202,"There are  no ads for that subject.");
            }   

            return Ok(ad.Select(p=>new{
                    id= p.AID,
                    date= p.Date,
                    summary= p.Summary,
                    studentId= p.StudentAd,
                    yearOfStudies = p.YearOfStudies,
                    typeOfStudies = p.TypeOfStudies,
                    subject = p.SubjectAdStudyBuddy,
                    subjectName=(_isubjectRepository.GetSubjectName(p.SubjectAdStudyBuddy)).Result,
                    studentUsername= ( _istudentRepository.GetStudentUsername(p.StudentAd)).Result
                }).ToList()
            );     
          
                
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpGet]
    [Route("GetAdsTutorByStudent/{idStud}")]
    public async Task<IActionResult> GetAdsTutorByStudent(string idStud){
        var ads= await _iadturorRepository.GetAdsByStudent(idStud);
        if (ads==null){
            return StatusCode(202,"There are no created ads for roommates.");
        }
        else 
        return Ok(ads.Select(p=> new{
            id= p.AID,
            date= p.Date,
            summary= p.Summary,
            yearOfStudies = p.YearOfStudies,
            typeOfStudies = p.TypeOfStudies,
            subject = p.SubjectAdTutor,
            }).ToList());
        }
        
    [Route("FilterAdTutor/{subjID}")]
    [HttpGet]
    public async Task<ActionResult> FilterAdTutor(string subjID)
    {
        try
        {
            var ad = await _iadturorRepository.FilterAds(subjID);
            if(ad.Count()==0)
            {    
                return StatusCode(202,"There are  no ads for that subject.");
            }

            return Ok(ad.Select(p=>new{
                    id= p.AID,
                    date= p.Date,
                    summary= p.Summary,
                    studentId= p.StudentAd,
                    yearOfStudies = p.YearOfStudies,
                    typeOfStudies = p.TypeOfStudies,
                    subject = p.SubjectAdTutor,
                    subjectName=(_isubjectRepository.GetSubjectName(p.SubjectAdTutor)).Result,
                    studentUsername= ( _istudentRepository.GetStudentUsername(p.StudentAd)).Result
                }).ToList()
            );         
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

}