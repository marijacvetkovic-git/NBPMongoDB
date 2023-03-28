using Microsoft.AspNetCore.Mvc;
using Models;
using MongoDB.Bson;
using MongoDB.Driver;

[ApiController]
[Route("[controller]")]
public class CommentController: ControllerBase{

    private readonly ICommentRepository _icommentsRepository;
    public CommentController(ICommentRepository commentsRepository){
       _icommentsRepository= commentsRepository;
    }

    [HttpGet]
    [Route("GeComments")]
    public async Task<IActionResult> Get(){
        var comms= await _icommentsRepository.GetAllAsync();
        return Ok(comms);
    }

    [HttpGet]
    [Route("GetById")]
    public async Task<IActionResult> GetById(string id){
        var comm= await _icommentsRepository.GetByIdAsync(id);
        if(comm== null){
            return NotFound();
        }
        return Ok(new{
            id= comm.CID,
            text=comm.Text,
            dateOfCreation=comm.DateOfCreation,
            commentStudent=comm.CommentStudent,
            commentProfessor=comm.CommentProfessor

        });
    }

    [HttpPost]
    [Route("CreateNewComment")]
    public async Task<IActionResult> CreateNewComment([FromBody]CommentDto comment){
        if( _icommentsRepository!= null){
             await _icommentsRepository.CreateNewCommentAsync(comment);
             return Ok("Dodato");
        }
        else{
            return BadRequest("_icommentsRepository is null");
        }    
    }

    [HttpPut]
    [Route("UpdateComment")]
    public async Task<IActionResult> Update([FromBody]Comment updatedComment){
        var comm= await _icommentsRepository.GetByIdAsync(updatedComment.CID);
        if(comm==null){
            return NotFound();
        }

        await _icommentsRepository.UpdateCommentAsync(updatedComment);
        return Ok("updated comment");
    }

    [HttpDelete]
    [Route("DeleteComment/{id}")]
    public async Task<IActionResult> DeleteComment(string id){
        var comm= await _icommentsRepository.GetByIdAsync(id);
        if (comm==null){
            return NotFound();
        }

        await _icommentsRepository.DeleteCommentAsync(id);
        return Ok("deleted comment");
    }

}