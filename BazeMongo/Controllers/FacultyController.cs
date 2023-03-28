using Microsoft.AspNetCore.Mvc;
using Models;
using MongoDB.Bson;
using MongoDB.Driver;

[ApiController]
[Route("[controller]")]
public class FacultyController: ControllerBase{

    private readonly IFacultyRepository _ifacultyRepository;
    public FacultyController(IFacultyRepository facultyRepository){
       _ifacultyRepository= facultyRepository;
    }

    [HttpGet]
    [Route("GetFaculties")]
    public async Task<IActionResult> Get(){
        var faculty= await _ifacultyRepository.GetAllAsync();
        return Ok(faculty.Select(p=> new{
            fid= p.FID,
            name= p.NameOfFaculty
        }).ToList());
    }

    [HttpPut]
    [Route("GetById/{id}")]
    public async Task<IActionResult> GetById(string id){


        var faculty= await _ifacultyRepository.GetByIdAsync(id);
        if(faculty== null){
            return NotFound();
        }

        return Ok(new{
            id= faculty.FID,
            name= faculty.NameOfFaculty,
            listOfSubject= faculty.SubjectsFac
        });
    }

    [HttpPost]
    [Route("CreateNewFaculty")]
    public async Task<IActionResult> CreateNewFaculty([FromBody]Faculty faculty){
        
        faculty.FID = ObjectId.GenerateNewId().ToString();
        var f= await _ifacultyRepository.GetFacultyByName(faculty.NameOfFaculty);
        if(f!=null){
            return BadRequest("Vec postoji fakultet sa ovim nazivom!");
        }
        await _ifacultyRepository.CreateNewFacultyAsync(faculty);
        return CreatedAtAction(nameof(Get), new {id = faculty.FID}, faculty);
             
    }

    [HttpPut]
    [Route("UpdateFaculty2/{id}/{name}")]
    public async Task<IActionResult> Update2(string id, string name){

        var faculty= await _ifacultyRepository.GetByIdAsync(id);
        var f= await _ifacultyRepository.GetFacultyByName(name);
        if(f!=null){
            return BadRequest("Vec postoji fakultet sa ovim nazivom!");
        }
        faculty.NameOfFaculty= name;
        await _ifacultyRepository.UpdateFacultyAsync(faculty);
        return Ok("Faculty updated!");

    }

    [HttpDelete]
    [Route("DeleteFaculty/{id}")]
    public async Task<IActionResult> DeleteFaculty(string id){

        var faculty= await _ifacultyRepository.GetByIdAsync(id);
        if (faculty==null){
            return NotFound();
        }
        await _ifacultyRepository.DeleteFacultyAsync(id);
        return Ok("Faculty deleted!");
    }

}