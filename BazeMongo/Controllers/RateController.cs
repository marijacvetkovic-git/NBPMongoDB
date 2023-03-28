using Microsoft.AspNetCore.Mvc;
using Models;
using MongoDB.Bson;
using MongoDB.Driver;

[ApiController]
[Route("[controller]")]
public class RateController: ControllerBase{

    private readonly IRateRepositroy _irateRepository;
    
    public RateController(IRateRepositroy rateRepository){
       _irateRepository= rateRepository;
    }

    [HttpPost]
    [Route("CreateRate")]
    public async Task<IActionResult> CreateRate([FromBody]RateDto r)
    {
        var res = await _irateRepository.CreateNewRateAsync(r);
        if(res == "Already exists")
        {
            return StatusCode(202,"Already rated");
        }
        return Ok("Dodato");
    }

    [HttpGet]
    [Route("GetRateById/{id}")]
    public async Task<ActionResult<Rate>> GetRateById(string id)
    {   
        var resp= await _irateRepository.GetById(id);
        if(resp==null)
        {
            return BadRequest("Bad id.");
        }
        else 
            return resp;

     
    }
    
    [HttpGet]
    [Route("GetAllRates")]
    public async Task<IActionResult> GetAllRates()
    {
        var k=await _irateRepository.GetAllAsync();
       return Ok(k);
    }

    [HttpPut]
    [Route("UpdateRate/{id}/{rate}")]
    public async Task<IActionResult> UpdateRate(string id,int rate)
    {
      
        var resp= await _irateRepository.GetById(id);
        if(resp==null)
        {
            return BadRequest("User with certain Id ,does not exist");
        }
        Rate r = new Rate();
        r.RID=resp.RID;
        r.StudentRate=resp.StudentRate;
        r.ProfessorRate=resp.ProfessorRate;

        if(rate!=resp.RateValue)
        {
            r.RateValue=rate;
        }
        else
            r.RateValue=resp.RateValue;


        await _irateRepository.UpdateRate(r,resp);
       return Ok("Done.");
    }

    [HttpDelete]
    [Route("DeleteRate/{id}")]
    public async Task<IActionResult> DeleteRate(string id){
      
        var resp= await _irateRepository.GetById(id);
        if(resp==null)
        {
            return BadRequest("Bad id.");
        }
        int rez= await _irateRepository.DeleteRateAsync(resp.RID);

        if(rez==0)
        {
            return BadRequest("Not deleted");
        }
        return Ok("Obrisano");
    }

    [HttpGet]
    [Route("AlreadyRated/{ids}/{idp}")]
     public async Task<IActionResult> AlreadyRated(string ids,string idp){
        var r = await _irateRepository.AlreadyRated(idp,ids);
        if(r != null)
        {
            return Ok("Already rated");
        }
        else
        {
            return StatusCode(202,"Not rated");
        }
     }
}
 
