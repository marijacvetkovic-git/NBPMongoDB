using Models;
using MongoDB.Bson;
using MongoDB.Driver;

public class AdStudyBuddyRepository: IAdStudyBuddyRepository{

    private readonly IMongoCollection<AdStudyBuddy> _adSBCollection;
    private readonly IMongoCollection<Student> _studentCollection;
    private readonly IMongoCollection<Subject> _subjectCollection;
    
    public AdStudyBuddyRepository(IMongoDatabase mongoDatabase){
        _adSBCollection= mongoDatabase.GetCollection<AdStudyBuddy>("AdStudyBuddy");
        _studentCollection= mongoDatabase.GetCollection<Student>("Student");
        _subjectCollection= mongoDatabase.GetCollection<Subject>("Subject");
    }

    public async Task CreateAdSBAsync(AdStudyBuddy newAdSB, Student student,string sid)
    {
        await _adSBCollection.InsertOneAsync(newAdSB);
        student.AdsStudyBuddy.Add(newAdSB);
        await _studentCollection.ReplaceOneAsync(Builders<Student>.Filter.Eq("_id", new ObjectId(newAdSB.StudentAd)), student, new ReplaceOptions{ IsUpsert= false});
        Subject sub=await _subjectCollection.Find<Subject>(p=>p.SID==sid).FirstOrDefaultAsync();
        if(sub==null)
        {
            throw new InvalidOperationException("Wrong id of subject");
        }
        sub.SubjectAdStudyBuddy.Add(newAdSB);
        await _subjectCollection.ReplaceOneAsync(Builders<Subject>.Filter.Eq("_id", new ObjectId(sid)), sub, new ReplaceOptions{ IsUpsert= false});
        return;
    }

    public async Task DeleteAdSBAsync(string id)
    {
        AdStudyBuddy ad = await _adSBCollection.Find(_=>_.AID == id).FirstOrDefaultAsync();
        var s = await _studentCollection.Find(_=>_.UID == ad.StudentAd).FirstOrDefaultAsync();
        var newAd = s.AdsStudyBuddy.Where(a=>a.AID != id).ToList();
        s.AdsStudyBuddy = newAd;
        await _studentCollection.ReplaceOneAsync(Builders<Student>.Filter.Eq("_id", new ObjectId(ad.StudentAd)), s, new ReplaceOptions{ IsUpsert= false});
        var subj=await _subjectCollection.Find<Subject>(p=>p.SID== ad.SubjectAdStudyBuddy).FirstOrDefaultAsync();
        if(subj == null)
        {
            throw new InvalidOperationException("Wrong id of subject");

        }
        subj.SubjectAdStudyBuddy.Remove(subj.SubjectAdStudyBuddy.Where(p=>p.AID==ad.AID).FirstOrDefault());
        await _subjectCollection.ReplaceOneAsync(Builders<Subject>.Filter.Eq("_id", new ObjectId(subj.SID)), subj, new ReplaceOptions{ IsUpsert= false});
        await _adSBCollection.DeleteOneAsync(s => s.AID == id);
    }

    public async Task<List<AdStudyBuddy>> GetAllAsync()
    {
        return await _adSBCollection.Find(_=>true).ToListAsync();
    }

    public async Task<AdStudyBuddy> GetByIdAsync(string id)
    {
        return await _adSBCollection.Find(s => s.AID == id).FirstOrDefaultAsync();
    }

    public async Task UpdateAdSBAsync(AdStudyBuddy updateAdSB)
    {
           await _adSBCollection.ReplaceOneAsync(s => s.AID == updateAdSB.AID, updateAdSB);
    }

    public async Task<List<AdStudyBuddy>> GetAdsByStudent(string id)
    {
        return await _adSBCollection.Find(_ => _.StudentAd == id).ToListAsync();
    }

    public async Task<List<AdStudyBuddy>> FilterAds(string subjID) 
    {
        var ad = await _adSBCollection.Find(_=>_.SubjectAdStudyBuddy == subjID).ToListAsync();
        return ad;

    }
}