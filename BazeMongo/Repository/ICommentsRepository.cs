
using Models;
using MongoDB.Bson;

public interface ICommentRepository{
    Task<List<Comment>> GetAllAsync();
    Task<Comment> GetByIdAsync(string id);
    Task CreateNewCommentAsync(CommentDto newComment);
    Task UpdateCommentAsync(Comment updatedComment);
    Task DeleteCommentAsync(string id);
    Task <List<Comment>> ReturnCommentsByProfessor(Professor p);
    Task <IList<Comment>> ReturnCommentsByStudent(string id);

}