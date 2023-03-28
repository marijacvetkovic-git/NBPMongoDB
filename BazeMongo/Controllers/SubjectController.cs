using Microsoft.AspNetCore.Mvc;
using Models;
using MongoDB.Bson;

[Controller]
[Route("[controller]")]

public class SubjectController: ControllerBase{

    private readonly ISubjectRepository _isubjectRepository;
    public SubjectController(ISubjectRepository subjectRepository){
       _isubjectRepository= subjectRepository;

    }
    [HttpGet]
    [Route("GetSubjects")]
    public async Task<IActionResult> Get(){
        var sub = await _isubjectRepository.GetAllAsync();
        return Ok(sub.Select(s=>new{
            id = s.SID,
            name = s.Name
        }));
    }

    [HttpGet]
    [Route("GetById/{id}")]
    public async Task<IActionResult> GetById(string id){
        var sub = await _isubjectRepository.GetByIdAsync(id);
        if(sub == null){
            return NotFound();
        }

        return Ok(new{
            id = sub.SID,
            name = sub.Name,
            faculty = sub.SubjectFaculty,
            professor = sub.SubjectProf,
            adstudybuddy = sub.SubjectAdStudyBuddy,
            adtutor = sub.SubjectAdTutor
        });
    }

    [HttpPost]
    [Route("CreateSubject")]
    public async Task<IActionResult> CreateSubject([FromBody]Subject sub){
        Subject s = new Subject();
        s.SID = ObjectId.GenerateNewId().ToString();
        s.Name = sub.Name;          
        await _isubjectRepository.CreateSubjectAsync(sub);
        return CreatedAtAction(nameof(Get), new {id = sub.SID}, sub); 
    }

    [HttpPut]
    [Route("UpdateSubject")]
    public async Task<IActionResult> Update([FromBody]Subject sub){
        var subj = await _isubjectRepository.GetByIdAsync(sub.SID);
        if(subj == null){
            return NotFound();
        }
        subj.Name = sub.Name;

        await _isubjectRepository.UpdateSubjectAsync(subj);
        return Ok("Subject updated!");
    }

    [HttpDelete]
    [Route("DeleteSubject/{id}")]
    public async Task<IActionResult> DeleteSubject(string id){
        var sub= await _isubjectRepository.GetByIdAsync(id);
        if (sub==null){
            return NotFound();
        }
        await _isubjectRepository.DeleteSubjectAsync(id);
        return Ok("Subject deleted!");
    }

}