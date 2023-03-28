using Models;
using MongoDB.Bson;
using MongoDB.Driver;

public class SubjectRepository: ISubjectRepository{

    private readonly IMongoCollection<Subject> _subjectCollection;
    private readonly IMongoCollection<Faculty> _facultyCollection;
    private readonly IMongoCollection<AdStudyBuddy> _adSBCollection;
    private readonly IMongoCollection<AdTutor> _adTutorCollection;
    private readonly IMongoCollection<Professor> _profCollection;
    private readonly IMongoCollection<Student> _studentCollection;
    private readonly IMongoDatabase _mongoDatabase;


    public SubjectRepository(IMongoDatabase mongoDatabase){
        _mongoDatabase= mongoDatabase;
        _subjectCollection= mongoDatabase.GetCollection<Subject>("Subject");
        _facultyCollection= mongoDatabase.GetCollection<Faculty>("Faculty");
        _adSBCollection=mongoDatabase.GetCollection<AdStudyBuddy>("AdStudyBuddy");
        _adTutorCollection=mongoDatabase.GetCollection<AdTutor>("AdTutor");
        _profCollection=mongoDatabase.GetCollection<Professor>("Professors");
        _studentCollection= mongoDatabase.GetCollection<Student>("Student");


    }

    
    public async Task<List<Subject>> GetAllAsync()
    {
        return await _subjectCollection.Find(_=>true).ToListAsync();
    }

    public async Task<Subject> GetByIdAsync(string id)
    {
        return await _subjectCollection.Find(s => s.SID == id).FirstOrDefaultAsync();
    }

    public async Task CreateSubjectAsync(Subject newSub)
    {
        newSub.SID= ObjectId.GenerateNewId().ToString();
        var faculty= await _facultyCollection.Find(_=> _.FID== newSub.SubjectFaculty).FirstOrDefaultAsync();
        SubjectView sv= new SubjectView{
            SID= newSub.SID,
            NameOfSubject= newSub.Name
        };
        faculty.SubjectsFac.Add(sv);
         await _facultyCollection.ReplaceOneAsync(Builders<Faculty>.Filter.Eq("_id", new ObjectId(newSub.SubjectFaculty)),
        faculty, new ReplaceOptions{ IsUpsert= false});
        await _subjectCollection.InsertOneAsync(newSub);
    }

    public async Task UpdateSubjectAsync(Subject updateSub)
    {
        await _subjectCollection.ReplaceOneAsync(s => s.SID == updateSub.SID, updateSub);
    }

    public async Task DeleteSubjectAsync(string id)
    {
        Subject subject= await _subjectCollection.Find(_=> _.SID== id).FirstOrDefaultAsync();
        var faculty= await _facultyCollection.Find(_=> _.FID== subject.SubjectFaculty).FirstOrDefaultAsync();
         var facultyList = faculty.SubjectsFac?.Where(a => a.SID != id).ToList();
        faculty.SubjectsFac= facultyList;
          await _facultyCollection.ReplaceOneAsync(Builders<Faculty>.Filter.Eq("_id", new ObjectId(subject.SubjectFaculty)),
        faculty, new ReplaceOptions{ IsUpsert= false});
        foreach(AdStudyBuddy par in subject.SubjectAdStudyBuddy )
        {
            IAdStudyBuddyRepository asb= new AdStudyBuddyRepository(_mongoDatabase);
            await asb?.DeleteAdSBAsync(par.AID);
        }
        foreach(AdTutor par in subject.SubjectAdTutor)
        {
            IAdTutorRepository at= new AdTutorRepository(_mongoDatabase);
            await at?.DeleteAdTutorAsync(par.AID);
        }
        foreach(ProfessorView pw in subject.SubjectProf)
        {
            Professor prof= await _profCollection.Find(_=> _.Username== pw.Username).FirstOrDefaultAsync();
            prof.ProfessorSubject.Remove( prof.ProfessorSubject.Where(p=>p.SID==id).FirstOrDefault());
            await _profCollection.ReplaceOneAsync(Builders<Professor>.Filter.Eq("_id", new ObjectId(prof.UID)),
            prof, new ReplaceOptions{ IsUpsert= false});
        }
        
        
        await _subjectCollection.DeleteOneAsync(s=>s.SID == id);
    }

    public async Task<IList<SubjectView>> ReturnSubjectsByProfessor(Professor p){
        IList<SubjectView> subs=new List<SubjectView>();
        subs=p.ProfessorSubject;
        return subs;
    }

    public async Task<string> GetSubjectName(string id)
    {
        var k= await _subjectCollection.Find(_ => _.SID== id).FirstOrDefaultAsync();
        return k.Name;
    }

    public async Task<string> GetFacultyOfSubject(string id)
    {
        var s= await _subjectCollection.Find(_=>_.SID==id).FirstOrDefaultAsync();
        var faculty= await _facultyCollection.Find(_=>_.FID==s.SubjectFaculty).FirstOrDefaultAsync();
        return faculty.NameOfFaculty;
    }
}