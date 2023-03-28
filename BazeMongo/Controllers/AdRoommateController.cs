using Microsoft.AspNetCore.Mvc;
using Models;
using MongoDB.Bson;
using MongoDB.Driver;

[ApiController]
[Route("[controller]")]
public class AdRoommateController: ControllerBase{

    private readonly IAdRoommateRepository _iadRoommateRepository;
    private readonly IStudentRepository _istudentRepository;
    public AdRoommateController(IAdRoommateRepository adRoommateRepository,IStudentRepository istudentRepository){
       _iadRoommateRepository= adRoommateRepository;
       _istudentRepository= istudentRepository;
    }

    [HttpGet]
    [Route("GetAdsRoommate")]
    public async Task<IActionResult> Get(){
        var adsRoommate= await _iadRoommateRepository.GetAllAsync();
        if (!adsRoommate.Any() || adsRoommate==null){
            return StatusCode(202,"List is empty");
        }
        return Ok(adsRoommate.Select(p=> new{
            id= p.AID,
            city= p.City,
            date= p.Date,
            flat= p.Flat,
            numberRoommate= p.NumberOfRoommates,
            summary= p.Summary,
            studentId= p.StudentAd,
            studentUsername= ( _istudentRepository.GetStudentUsername(p.StudentAd)).Result
        }).ToList());
    }

    [HttpGet]
    [Route("GetById/{id}")]
    public async Task<IActionResult> GetById(string id){

        var adsRoommate= await _iadRoommateRepository.GetByIdAsync(id);
        var student = await _istudentRepository.GetById(adsRoommate.StudentAd);
        if(adsRoommate== null){
            return NotFound();
        }

        return Ok(new{
            id= adsRoommate.AID,
            city= adsRoommate.City,
            date= adsRoommate.Date,
            flat= adsRoommate.Flat,
            numberRoommate= adsRoommate.NumberOfRoommates,
            summary= adsRoommate.Summary,
            studentId= adsRoommate.StudentAd,
            studentUsername= student.Username
        });
    }


    [HttpPost]
    [Route("CreateNewAdRoommate")]
    public async Task<IActionResult> CreateNewAdRoommate([FromBody]AdRoommateDto adRoommate){
            var student= await _istudentRepository.GetById(adRoommate.StudentId);
            if(student==null){
                return BadRequest("Pogresan id studenta");
            }
    
            AdRoommate ar= new AdRoommate();
            ar.AID= ObjectId.GenerateNewId().ToString();
            ar.Date= DateTime.Now;
            ar.City= adRoommate.City;
            ar.Flat= adRoommate.Flat;
            ar.NumberOfRoommates= adRoommate.NumberOfRoommates;
            ar.Summary= adRoommate.Summary;
            ar.StudentAd= adRoommate.StudentId;
            await _iadRoommateRepository.CreateNewAdRoommateAsync(ar, student);

             return CreatedAtAction(nameof(Get), new {id = ar.AID}, ar);
    }

    [HttpPut]
    [Route("UpdateAdRoommate")]
    public async Task<IActionResult> Update([FromBody]AdRoommateUpdateDto updateAd){

        var adRoommate= await _iadRoommateRepository.GetByIdAsync(updateAd.AID);
         if(adRoommate==null){
            return BadRequest("Nije pronadjen");
        }
        if(!string.IsNullOrWhiteSpace(updateAd.Summary)){
            adRoommate.Summary= updateAd.Summary;
        }
        if(adRoommate.Flat!= updateAd.Flat){
            adRoommate.Flat= updateAd.Flat;
        }
        if(!string.IsNullOrWhiteSpace(updateAd.City)){
            adRoommate.City= updateAd.City;
        }
        if(adRoommate.NumberOfRoommates!= updateAd.NumberOfRoommates){
            adRoommate.NumberOfRoommates= updateAd.NumberOfRoommates;
        }
        adRoommate.Date= DateTime.Now;
        var student= await _istudentRepository.GetById(adRoommate.StudentAd);

        student.AdsRoommate.Remove(student.AdsRoommate.Where(p=>p.AID== adRoommate.AID).FirstOrDefault());
        student.AdsRoommate.Add(adRoommate);
        await _istudentRepository.UpdateStudent(student);
        await _iadRoommateRepository.UpdateAdRoommateAsync(adRoommate);
        return Ok("Ad updated!");
    }

    [HttpDelete]
    [Route("DeleteAdRoommate/{pId}")]
    public async Task<IActionResult> DeleteFaculty(string pId){
        var ad= await _iadRoommateRepository.GetByIdAsync(pId);
        if(ad==null){
            return BadRequest("Wrong id!");
        }
        await _iadRoommateRepository.DeleteAdRoommateAsync(pId);
        return Ok("Ad deleted!");
    }

}