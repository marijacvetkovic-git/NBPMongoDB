using System.Diagnostics;
using Models;
using MongoDB.Bson;
using MongoDB.Driver;

public class AdRoommateRepository: IAdRoommateRepository{
    private readonly IMongoCollection<AdRoommate> _adRoommateCollection;
    private readonly IMongoCollection<Student> _studentCollection;
    public AdRoommateRepository(IMongoDatabase mongoDatabase){
        _adRoommateCollection= mongoDatabase.GetCollection<AdRoommate>("AdRoommate");
        _studentCollection= mongoDatabase.GetCollection<Student>("Student");
    }

    public async Task CreateNewAdRoommateAsync(AdRoommate newAddRoommate, Student stud)
    {
        await _adRoommateCollection.InsertOneAsync(newAddRoommate);
        stud.AdsRoommate.Add(newAddRoommate);
        await _studentCollection.ReplaceOneAsync(Builders<Student>.Filter.Eq("_id", new ObjectId(newAddRoommate.StudentAd)),
        stud, new ReplaceOptions{ IsUpsert= false});
        return;
    }

    public async Task DeleteAdRoommateAsync(string id)
    {
        AdRoommate k= await _adRoommateCollection.Find(_ => _.AID== id).FirstOrDefaultAsync();
        var stud= await _studentCollection.Find(_=> _.UID== k.StudentAd).FirstOrDefaultAsync();
        var newAdsRoommate = stud.AdsRoommate.Where(a => a.AID != id).ToList();
        stud.AdsRoommate = newAdsRoommate;
        await _studentCollection.ReplaceOneAsync(Builders<Student>.Filter.Eq("_id", new ObjectId(k.StudentAd)),
        stud, new ReplaceOptions{ IsUpsert= false});
        await _adRoommateCollection.DeleteOneAsync(x => x.AID== id);
    }

    public async Task<List<AdRoommate>> GetAdByFilters(string city, int numberOfRoommates, bool flat)
    {
        List<AdRoommate> proba= new List<AdRoommate>();
        var ad= await _adRoommateCollection.Find(_ => _.NumberOfRoommates== numberOfRoommates).FirstOrDefaultAsync();
        if(ad==null)
        {
            AdRoommate noRoomates= new AdRoommate{
                Summary="-1"
            };
            proba.Add(noRoomates);
            return proba;
        }
        var ad2= await _adRoommateCollection.Find(_ => _.NumberOfRoommates== numberOfRoommates && _.City== city).FirstOrDefaultAsync();
        if (ad2==null){
            AdRoommate noCity= new AdRoommate{
                Summary="-2"
            };
            proba.Add(noCity);
            return proba;
        }
        var ad3= await _adRoommateCollection.Find(_ => _.NumberOfRoommates== numberOfRoommates && _.City== city && _.Flat== flat).ToListAsync();
         if (ad3.Count()==0){
            AdRoommate noFlat= new AdRoommate{
                Summary="-3"
            };
            proba.Add(noFlat);
            return proba;
        }
        return ad3;
    }

    public async Task<List<AdRoommate>> GetAdByFilters2(string city, bool flat)
    {
        List<AdRoommate> proba= new List<AdRoommate>();
        var ad= await _adRoommateCollection.Find(_ => _.City== city).FirstOrDefaultAsync();
        if(ad==null)
        {
            AdRoommate noCity= new AdRoommate{
                Summary="-1"
            };
            proba.Add(noCity);
            return proba;
        }
        var ad2= await _adRoommateCollection.Find(_ => _.City== city && _.Flat== flat).ToListAsync();
        if (ad2.Count()==0){
            AdRoommate noFlat= new AdRoommate{
                Summary="-2"
            };
            proba.Add(noFlat);
            return proba;
        }
        return ad2;
    }

    public async Task<List<AdRoommate>> GetAllAsync()
    {
          return await _adRoommateCollection.Find(_ => true).ToListAsync();
    }

    public async Task<AdRoommate> GetByIdAsync(string id)
    {
       return await _adRoommateCollection.Find(_ => _.AID == id).FirstOrDefaultAsync();
    }

    public async Task<List<AdRoommate>> GetByStudent(string id)
    {
        return await _adRoommateCollection.Find(_ => _.StudentAd== id).ToListAsync();
    }

    public async Task UpdateAdRoommateAsync(AdRoommate adRoommateToUpdate)
    {
        await _adRoommateCollection.ReplaceOneAsync(x => x.AID == adRoommateToUpdate.AID, adRoommateToUpdate);
    }
}
