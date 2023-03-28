using System.Diagnostics;
using Models;
using MongoDB.Bson;
using MongoDB.Driver;

public class CommentRepository: ICommentRepository{
    private readonly IMongoCollection<Comment> _commentsCollection;
    private readonly IMongoCollection<Student> _studentCollection;
    private readonly IMongoCollection<Professor> _profCollection;

    public CommentRepository(IMongoDatabase mongoDatabase){
        _commentsCollection= mongoDatabase.GetCollection<Comment>("Comments");
        _studentCollection=mongoDatabase.GetCollection<Student>("Student");
        _profCollection=mongoDatabase.GetCollection<Professor>("Professors");

    }


    public async Task CreateNewCommentAsync(CommentDto newComment)
    {
        Student student = await _studentCollection.Find<Student>(x=>x.UID==newComment.CommentStudent).FirstOrDefaultAsync();
        Professor prof= await _profCollection.Find<Professor>(x=>x.UID==newComment.CommentProfessor).FirstOrDefaultAsync();
        if(student==null)throw new InvalidOperationException("Student with certain id does not exist!");
        if(prof ==null)throw new InvalidOperationException("Professor with certain id does not exist!");
        Comment k = new Comment{
            Text=newComment.Text,
            DateOfCreation=DateTime.Now,
            CommentStudent=newComment.CommentStudent,
            CommentProfessor=newComment.CommentProfessor
        };
        await _commentsCollection.InsertOneAsync(k);
         prof.Comments.Add(k);
         await _profCollection.ReplaceOneAsync(
            Builders<Professor>.Filter.Eq("_id", new ObjectId(newComment.CommentProfessor)),
            prof,
            new ReplaceOptions { IsUpsert = false });
        return ;
    }

    public async Task DeleteCommentAsync(string id)
    {
        Comment com=await _commentsCollection.Find<Comment>(x=>x.CID==id).FirstOrDefaultAsync();
        Professor prof=await _profCollection.Find<Professor>(x=>x.UID==com.CommentProfessor).FirstOrDefaultAsync();
         bool isDone = prof.Comments.Remove(com);
        if (isDone)
    {
        await _profCollection.ReplaceOneAsync(
            Builders<Professor>.Filter.Eq(p => p.UID, prof.UID),
            prof,
            new ReplaceOptions { IsUpsert = false });
        await _commentsCollection.DeleteOneAsync(x => x.CID == id);
    }
       
    }

    public async Task<List<Comment>> GetAllAsync()
    {
        return await _commentsCollection.Find(_ => true).ToListAsync();
    }

    public async Task<Comment> GetByIdAsync(string id)
    {
        return await _commentsCollection.Find(_ => _.CID == id).FirstOrDefaultAsync();
    }
    public async Task UpdateCommentAsync(Comment updatedComment)
    {
       await _commentsCollection.ReplaceOneAsync(x => x.CID == updatedComment.CID, updatedComment);
    }

    public async Task<List<Comment>> ReturnCommentsByProfessor(Professor p){
        return null;
    }

    public async Task<IList<Comment>> ReturnCommentsByStudent(string id)
    {
        return await _commentsCollection.Find(_=>_.CommentStudent== id).ToListAsync();
    }
}