using Models;
using MongoDB.Bson;
using MongoDB.Driver;

public class RateRepository : IRateRepositroy
{
    private readonly IMongoCollection<Rate> _rateCollection;
       private readonly IMongoCollection<Student> _studentCollection;
        private readonly IMongoCollection<Professor> _profCollection;
    public RateRepository(IMongoDatabase mongoDatabase){
        _rateCollection= mongoDatabase.GetCollection<Rate>("Rate");
         _studentCollection=mongoDatabase.GetCollection<Student>("Student");
        _profCollection=mongoDatabase.GetCollection<Professor>("Professors");
    }
    public async Task<string> CreateNewRateAsync(RateDto rate)
    {
        Student student = await _studentCollection.Find<Student>(x=>x.UID==rate.StudentRate).FirstOrDefaultAsync();
        Professor prof= await _profCollection.Find<Professor>(x=>x.UID==rate.ProfessorRate).FirstOrDefaultAsync();
        if(student==null)throw new InvalidOperationException("Student with certain id does not exist!");
        if(prof ==null)throw new InvalidOperationException("Professor with certain id does not exist!");
        var rateExists= await _rateCollection.Find(_=>_.ProfessorRate==rate.ProfessorRate && _.StudentRate== rate.StudentRate).FirstOrDefaultAsync();
        Rate r = new Rate
        {
            RateValue=rate.RateValue,
            StudentRate=rate.StudentRate,
            ProfessorRate=rate.ProfessorRate

        };
        if(rateExists!=null)
        {
           
            return "Already exists";
        }
           
       await _rateCollection.InsertOneAsync(r);
       prof.ProfessorRate.Add(r);
        float rez=0;
        foreach( var p in  prof.ProfessorRate)
        {
            rez+=p.RateValue;
        }
        rez=rez/prof.ProfessorRate.Count;
        prof.AvgRate=rez;
       await _profCollection.ReplaceOneAsync(x => x.UID == rate.ProfessorRate, prof);

       return "Ok";
    }

    public async Task<int>  DeleteRateAsync(string id)
    {
        Rate r= await _rateCollection.Find(_ => _.RID == id).FirstOrDefaultAsync();
        Professor prof =await _profCollection.Find<Professor>(x=>x.UID==r.ProfessorRate).FirstOrDefaultAsync();
        prof.ProfessorRate?.Remove(prof.ProfessorRate.Where(p=>p.RID==r.RID).FirstOrDefault());
        if(prof.ProfessorRate.Count()==0)
            prof.AvgRate=0;
        else{
             float rez=0;
            foreach( var p in  prof.ProfessorRate)
            {
                rez+=p.RateValue;
            }
            rez=rez/prof.ProfessorRate.Count;
            prof.AvgRate=rez;
        }
       
        await _profCollection.ReplaceOneAsync(x => x.UID == r.ProfessorRate, prof);
        var k = await _rateCollection.DeleteOneAsync(x => x.RID== id);

        int m=1;
        if(k.DeletedCount==0)
        {
            m=0;
        
        }
        return m;
    
    }
    public async Task<List<Rate>> GetAllAsync()
    {
        return await _rateCollection.Find(_ => true).ToListAsync();
    }

    public async Task<Rate> GetById(string filter)
    {
        var k= await _rateCollection.Find(_ => _.RID == filter).FirstOrDefaultAsync();
        return k;
    }

    public async Task UpdateRate(Rate r,Rate resp) 
    {
        Professor prof =await _profCollection.Find<Professor>(x=>x.UID==r.ProfessorRate).FirstOrDefaultAsync();
        var l=prof.ProfessorRate.Contains(resp);
       prof.ProfessorRate.Remove(prof.ProfessorRate.Where(p=>p.RID==resp.RID).FirstOrDefault());
       prof.ProfessorRate.Add(r);

        
        float rez=0;
        foreach( var p in  prof.ProfessorRate)
        {
            rez+=p.RateValue;
        }
        rez=rez/prof.ProfessorRate.Count;
        prof.AvgRate=rez;
       await _profCollection.ReplaceOneAsync(x => x.UID == r.ProfessorRate, prof);
       await _rateCollection.ReplaceOneAsync(x =>x.RID == r.RID, r);
       return;
    }
     public async Task<IList<Rate>> ReturnRatesByProfessor(Professor p){
        IList<Rate> rates=new List<Rate>();
        rates=p.ProfessorRate;
        return rates;
    }

    public async Task<IList<Rate>> ReturnRatesByStudent(string id)
    {
       return await _rateCollection.Find(_=>_.StudentRate==id).ToListAsync();
    }

    public async Task<string> AlreadyRated(string idProf, string idStud)
    {
        var rateExists= await _rateCollection.Find(_=>_.ProfessorRate==idProf && _.StudentRate== idStud).FirstOrDefaultAsync();
        if(rateExists == null)
        {
            return null;
        }
        else{
            return "Ok";
        }

    }
}