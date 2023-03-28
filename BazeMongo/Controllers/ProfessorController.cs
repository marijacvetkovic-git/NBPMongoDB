using DTOs;
using Microsoft.AspNetCore.Mvc;
using Models;
using MongoDB.Bson;
using MongoDB.Driver;

[ApiController]
[Route("[controller]")]
public class ProfessorController: ControllerBase{

    private readonly IStudentRepository _istudentRepository;
    private readonly IProfessorRepository _iprofessorRepository;
    private readonly ICommentRepository _icommentRepository;
    private readonly IRateRepositroy _irateRepository;
    private readonly ISubjectRepository _isubjectRepository;
    public ProfessorController(IProfessorRepository professorRepository,IStudentRepository studentRepository,ICommentRepository commentRepository,IRateRepositroy rateRepository,ISubjectRepository subjectRepository){
       _iprofessorRepository= professorRepository;
       _istudentRepository= studentRepository;
       _icommentRepository= commentRepository;
       _irateRepository=rateRepository;
       _isubjectRepository=subjectRepository;
    }

    [HttpGet]
    [Route("GetProfessors")]
    public async Task<IActionResult> Get(){
        var profs= await _iprofessorRepository.GetAllAsync();
        return Ok(profs);
    }

    [HttpGet]
    [Route("GetById/{id}")]
    public async Task<IActionResult> GetById(string id){
       var prof= await _iprofessorRepository.GetByIdAsync(id);
        if(prof==null)return BadRequest("Bad ID.");
        else 
        return Ok(new{
            id= prof.UID,
            name=prof.Name,
            surname=prof.Surname,
            email=prof.Email,
            username=prof.Username,
            password=prof.Password,
            education= prof.Education,
            avgRate= prof.AvgRate,
            listOfComments= prof.Comments,
            listOfRatings= prof.ProfessorRate,
            listOfSubjects= prof.ProfessorSubject
        });
    }

    [HttpPost]
    [Route("CreateNewProfessor")]
    public async Task<IActionResult> CreateNewProfessor([FromBody]ProfessorDto prof){

        await _iprofessorRepository.CreateNewProfessorAsync(prof);
        return Ok("Dodato");
    }

    [HttpPut]
    [Route("UpdateProfessor")]
    public async Task<IActionResult> Update([FromBody]UpdateProfessorDto updatedProfessor){
        var prof=await _iprofessorRepository.GetByIdAsync(updatedProfessor.Id);
        if(prof.Username!=updatedProfessor.Username)
            prof.Username=updatedProfessor.Username;

        if(prof.Name!=updatedProfessor.Name) 
            prof.Name=updatedProfessor.Name;

        if(prof.Surname!=updatedProfessor.Surname) 
            prof.Surname=updatedProfessor.Surname;

        if(prof.Education!=updatedProfessor.Education) 
            prof.Education=updatedProfessor.Education;
        int k=0;   
        var subject = await _isubjectRepository.GetByIdAsync(updatedProfessor.SubjectProf);
        if(subject!=null)
        { 
            foreach(var s in prof.ProfessorSubject)
            {
                if(s.SID==updatedProfessor.SubjectProf)
                {
                    k=1;
                }
            }
            if(k==0)
            {
                SubjectView sw= new SubjectView();
                sw.SID=subject.SID;
                sw.NameOfSubject=subject.Name;
                prof.ProfessorSubject.Add(sw);
            }
        }
        await _iprofessorRepository.UpdateProfessorAsync(prof);
        return Ok("professor updated");
    } 

    [HttpDelete]
    [Route("DeleteProfessor/{id}")]
    public async Task<IActionResult> DeleteProfessor(string id){
        var prof= await _iprofessorRepository.GetByIdAsync(id);
        if (prof==null){
            return BadRequest("Bad id");
        }

        await _iprofessorRepository.DeleteProfessorAsync(id);
        return Ok("deleted professor");
    }
    
    [HttpGet]
    [Route("ListCommentsOfCertainProfessor/{id}")]
    public async Task <IActionResult>ListCommentsOfCertainProfessor(string id){
        Professor p=await _iprofessorRepository.GetByIdAsync(id);
        if(p==null)return BadRequest("Professor does not exist");
        if(p.Comments.Any())
        return Ok(p.Comments.Select(c=>new{
            IdComm = c.CID,
            Text=c.Text,
            DateOfCreation=c.DateOfCreation,
            CommentStudent=( _istudentRepository.GetStudentUsername(c.CommentStudent)).Result
        }));
        return StatusCode(202,"There are no comments for this professor");
    }
   
    [HttpGet]
    [Route("ListRatingsOfCertainProfessor/{id}")]
    public async Task <IActionResult>ListRatingsOfCertainProfessor(string id){
        Professor p=await _iprofessorRepository.GetByIdAsync(id);
        if(p==null)return BadRequest("Professor does not exist");
        if(p.ProfessorRate.Any())
        return Ok(p.ProfessorRate.Select(c=>new{
            IdRate = c.RID,
            RateValue=c.RateValue,
            StudentRate=( _istudentRepository.GetStudentUsername(c.StudentRate)).Result
        }));
        return StatusCode(202,"There are no rates yet.");
    }
    
    [HttpPut]
    [Route("AddSubjectProf/{profId}/{subId}")]
    public async Task<IActionResult> AddSubjectProf(string profId,string subId){
        var prof=await _iprofessorRepository.GetByIdAsync(profId);
         var sub=await _isubjectRepository.GetByIdAsync(subId);
        if(prof!=null && sub!=null){
                await _iprofessorRepository.AddSubjectProfesor(sub, prof);
                return Ok("Subject added");
            }
            else return BadRequest("Subject doesn't exist");
    }

    [HttpGet]
    [Route("ListAllSubjectsProf/{id}")]
    public async Task<IActionResult> GetAllSubjectsProf(string id){
        Professor p=await _iprofessorRepository.GetByIdAsync(id);
        if(p==null)return BadRequest("Professor does not exist");
         IList<SubjectView> subs=await _isubjectRepository.ReturnSubjectsByProfessor(p);
        var l=subs.ToList();
        return Ok(l.Select(c=>new{
            Name=c.NameOfSubject,
        }));
    }
    
}