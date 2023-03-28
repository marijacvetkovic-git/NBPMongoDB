using System.Diagnostics;
using Models;
using MongoDB.Bson;
using MongoDB.Driver;

public class ProfessorRepository: IProfessorRepository{
    private readonly IMongoCollection<Professor> _professorsCollection;
    private readonly IMongoCollection<Rate> _rateCollection;
    private readonly IMongoCollection<Comment> _commentCollection;
    private readonly IMongoCollection<Subject> _subjectCollection;
    private readonly IMongoCollection<Student> _studentCollection;
    public ProfessorRepository(IMongoDatabase mongoDatabase){
        _professorsCollection= mongoDatabase.GetCollection<Professor>("Professors");
        _rateCollection=mongoDatabase.GetCollection<Rate>("Rate");
        _subjectCollection=mongoDatabase.GetCollection<Subject>("Subject");
        _studentCollection=mongoDatabase.GetCollection<Student>("Student");
        _commentCollection=mongoDatabase.GetCollection<Comment>("Comments");
    }


    public async Task CreateNewProfessorAsync(ProfessorDto newProfessor)
    {
        var s = await _studentCollection.Find<Student>(x=>x.Username==newProfessor.Username).ToListAsync();
        var p = await _professorsCollection.Find<Professor>(x=>x.Username==newProfessor.Username).ToListAsync();
        if(s.Count!=0 || p.Count!=0)throw new InvalidOperationException("A student or professor with the same username already exists.");
       await _professorsCollection.InsertOneAsync(new Professor{
            Name=newProfessor.Name,
            Surname=newProfessor.Surname,
            Email=newProfessor.Email,
            Username=newProfessor.Username,
            Password=newProfessor.Password,
            Education=newProfessor.Education,
            AvgRate=0.00
         });
       return ;  
    }
    public async Task<Professor> GetProfessorUsername(string id)
    {
        var p= await _professorsCollection.Find(_ => _.Username== id).FirstOrDefaultAsync();
        return p;
    }
    public async Task DeleteProfessorAsync(string id)
    {
        var prof= await _professorsCollection.Find(_=>_.UID==id).FirstOrDefaultAsync();
        foreach(Comment c in prof.Comments)
            await _commentCollection.DeleteOneAsync(_=>_.CID==c.CID);
        foreach(Rate r in prof.ProfessorRate)
            await _rateCollection.DeleteOneAsync(_=>_.RID==r.RID);
        foreach(SubjectView sv in prof.ProfessorSubject)
        {
            var subject= await _subjectCollection.Find(_=>_.SID== sv.SID).FirstOrDefaultAsync();
            var listProf= subject.SubjectProf.Where(p=> p.Username!= prof.Username).ToList();
            subject.SubjectProf= listProf;
            await _subjectCollection.ReplaceOneAsync(Builders<Subject>.Filter.Eq("_id", new ObjectId(subject.SID)),
            subject, new ReplaceOptions{ IsUpsert= false});
        }
        await _professorsCollection.DeleteOneAsync(x => x.UID== id);
    }

    public async Task<List<Professor>> GetAllAsync()
    {
        return await _professorsCollection.Find(_ => true).ToListAsync();
    }

    public async Task<Professor> GetByIdAsync(string id)
    {
        return await _professorsCollection.Find(_ => _.UID == id).FirstOrDefaultAsync();
    }
    public async Task UpdateProfessorAsync(Professor updatedProfessor)
    {
       await _professorsCollection.ReplaceOneAsync(x => x.UID == updatedProfessor.UID, updatedProfessor);
    }
    public async Task<Professor> CheckUsernameAndPassword(LogInDto l)
    {
        Professor p = await _professorsCollection.Find<Professor>(x=>x.Username==l.Username && x.Password==l.Password).FirstOrDefaultAsync();
        if(p==null) 
            return null;    
        return p;

    }

    public async Task AddSubjectProfesor(Subject s, Professor p)
    {
        ProfessorView pv= new ProfessorView{
                Username= p.Username,
                Education= p.Education,
                Name= p.Name,
                Surname= p.Surname
                };
        SubjectView sv=new SubjectView();
                sv.SID=s.SID;
                sv.NameOfSubject=s.Name;
        bool exist= false;
        foreach (SubjectView subject in p.ProfessorSubject)
        {
            if(subject.SID==sv.SID)
                exist=true;
        }
            if(exist==false){
                p.ProfessorSubject.Add(sv);
                 await _professorsCollection.ReplaceOneAsync(Builders<Professor>.Filter.Eq("_id", new ObjectId(p.UID)),
            p, new ReplaceOptions{ IsUpsert= false});
                s.SubjectProf.Add(pv);
                await _subjectCollection.ReplaceOneAsync(Builders<Subject>.Filter.Eq("_id", new ObjectId(s.SID)),
            s, new ReplaceOptions{ IsUpsert= false});
            }
        return;
    }

    public async Task<string> GetProfessorIdByUsername(string username)
    {
       Professor p = await _professorsCollection.Find(_ => _.Username == username).FirstOrDefaultAsync();
       var prof = p.UID;
        return prof;
    }
}