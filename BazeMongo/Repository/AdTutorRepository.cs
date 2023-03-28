using Models;
using MongoDB.Bson;
using MongoDB.Driver;

public class AdTutorRepository: IAdTutorRepository{

    private readonly IMongoCollection<AdTutor> _adTutorCollection;
    private readonly IMongoCollection<Student> _studentCollection;
        private readonly IMongoCollection<Subject> _subjectCollection;


    public AdTutorRepository(IMongoDatabase mongoDatabase){
        _adTutorCollection= mongoDatabase.GetCollection<AdTutor>("AdTutor");
        _studentCollection= mongoDatabase.GetCollection<Student>("Student");
        _subjectCollection= mongoDatabase.GetCollection<Subject>("Subject");

    }

    public async Task CreateAdTutorAsync(AdTutor newAdTutor, Student student,string sid)
    {
        await _adTutorCollection.InsertOneAsync(newAdTutor);
        student.AdsTutor.Add(newAdTutor);
        await _studentCollection.ReplaceOneAsync(Builders<Student>.Filter.Eq("_id", new ObjectId(newAdTutor.StudentAd)), student, new ReplaceOptions{ IsUpsert= false});

        Subject sub=await _subjectCollection.Find<Subject>(p=>p.SID==sid).FirstOrDefaultAsync();
        if(sub==null)
        {
            throw new InvalidOperationException("Wrong id of subject");
        }
        sub.SubjectAdTutor.Add(newAdTutor);
        await _subjectCollection.ReplaceOneAsync(Builders<Subject>.Filter.Eq("_id", new ObjectId(sid)), sub, new ReplaceOptions{ IsUpsert= false});

        return;
    }

    public async Task DeleteAdTutorAsync(string id)
    {
        AdTutor ad = await _adTutorCollection.Find(_=>_.AID == id).FirstOrDefaultAsync();
        var s = await _studentCollection.Find(_=>_.UID == ad.StudentAd).FirstOrDefaultAsync();
        var newAd = s.AdsTutor.Where(a=>a.AID != id).ToList();
        s.AdsTutor = newAd;
        await _studentCollection.ReplaceOneAsync(Builders<Student>.Filter.Eq("_id", new ObjectId(ad.StudentAd)), s, new ReplaceOptions{ IsUpsert= false});
         var subj=await _subjectCollection.Find<Subject>(p=>p.SID== ad.SubjectAdTutor).FirstOrDefaultAsync();
        if(subj == null)
        {
            throw new InvalidOperationException("Wrong id of subject");
        }
        subj.SubjectAdTutor.Remove(subj.SubjectAdTutor.Where(p=>p.AID==ad.AID).FirstOrDefault());
        await _subjectCollection.ReplaceOneAsync(Builders<Subject>.Filter.Eq("_id", new ObjectId(subj.SID)), subj, new ReplaceOptions{ IsUpsert= false});
        await _adTutorCollection.DeleteOneAsync(s => s.AID == id);
    }

    public async Task<List<AdTutor>> GetAllAsync()
    {
         return await _adTutorCollection.Find(_=>true).ToListAsync();
    }

    public async Task<AdTutor> GetByIdAsync(string id)
    {
        return await _adTutorCollection.Find(s => s.AID == id).FirstOrDefaultAsync();
    }

    public async Task UpdateAdTutuorAsync(AdTutor updateAdTutor)
    {
        await _adTutorCollection.ReplaceOneAsync(s => s.AID == updateAdTutor.AID, updateAdTutor);
    }
    public async Task<List<AdTutor>> GetAdsByStudent(string id)
    {
        return await _adTutorCollection.Find(_ => _.StudentAd == id).ToListAsync();
    }

    public async Task<List<AdTutor>> FilterAds(string subjID) 
    {
        var ad = await _adTutorCollection.Find(_=>_.SubjectAdTutor == subjID).ToListAsync();
        return ad;

    }
}