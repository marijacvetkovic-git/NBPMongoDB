using Microsoft.AspNetCore.Mvc;
using Models;
using MongoDB.Bson;
using MongoDB.Driver;



public class StudentRepository : IStudentRepository
{
    private readonly IMongoCollection<Student> _studentCollection;
        private readonly IMongoCollection<Professor> _profCollection;
        private readonly IMongoCollection<Faculty> _facCollection;
        private readonly IMongoCollection<AdRoommate> _adRoommateCollection;
        private readonly IMongoCollection<AdStudyBuddy> _adSBCollection;
        private readonly IMongoCollection<AdTutor> _adTutorCollection;




     public StudentRepository(IMongoDatabase mongoDatabase){
        _studentCollection= mongoDatabase.GetCollection<Student>("Student");
        _profCollection=mongoDatabase.GetCollection<Professor>("Professors");
        _facCollection=mongoDatabase.GetCollection<Faculty>("Faculty");
        _adRoommateCollection=mongoDatabase.GetCollection<AdRoommate>("AdRoommate");
        _adSBCollection=mongoDatabase.GetCollection<AdStudyBuddy>("AdStudyBuddy");
        _adTutorCollection=mongoDatabase.GetCollection<AdTutor>("AdTutor");
    }

    public async Task<Student> CheckUsernameAndPassword(LogInDto l)
    {
        Student s = await _studentCollection.Find<Student>(x=>x.Username==l.Username && x.Password==l.Password).FirstOrDefaultAsync();
        if(s==null)
        {
            return null;

        }
        return s;

    }

    public async Task CreateNewStudentAsync(StudentDto student)
    {
        var s = await _studentCollection.Find<Student>(x=>x.Username==student.Username).ToListAsync();
        var p = await _profCollection.Find<Professor>(x=>x.Username==student.Username).ToListAsync();
        Faculty fac=await _facCollection.Find<Faculty>(x=>x.FID == student.FacultyStudent).FirstOrDefaultAsync();
        if(fac==null)
        {
            throw new InvalidOperationException("Faculty with certain id does not exist!");

        }
        if(s.Count!=0 || p.Count!=0)
        {
            throw new InvalidOperationException("A student or professor with the same username already exists.");
 
        }

         await _studentCollection.InsertOneAsync(new Student{
            Name=student.Name,
            Surname=student.Surname,
            Email=student.Email,
            Username=student.Username,
            Password=student.Password,
            City=student.City,
            YearOfStudies=student.YearOfStudies=student.YearOfStudies,
            TypeOfStudies=student.TypeOfStudies,
            FacultyStudent= new FacultyShort
            {
                FID=fac.FID,
                NameOfFaculty=fac.NameOfFaculty
            }

         });
       return ;
    }

    public async Task<int>  DeleteStudentAsync(string id)
    {
        Student student= await _studentCollection.Find(_ => _.UID == id).FirstOrDefaultAsync();
        foreach(AdRoommate par in student.AdsRoommate )
        {
            await _adRoommateCollection.DeleteOneAsync(_ => _.AID== par.AID);
        }
        var k = await _studentCollection.DeleteOneAsync(x => x.UID== id);
        int m=1;
        if(k.DeletedCount==0)
        {
            m=0;
        
        }
        return m;
    
    }

    public async Task<List<Student>> GetAllAsync()
    {
         return await _studentCollection.Find(_ => true).ToListAsync();
    }

    public async Task<Student> GetById(string filter)
    {
         var k= await _studentCollection.Find(_ => _.UID == filter).FirstOrDefaultAsync();
        return k;
    }

    public async Task<string> GetStudentUsername(string id)
    {
        var k= await _studentCollection.Find(_ => _.UID== id).FirstOrDefaultAsync();
        return k.Username;
    }


    public async Task UpdateStudent(Student s)
    {

        await _studentCollection.ReplaceOneAsync(x =>x.UID == s.UID, s);
       return;
    }

    public async Task<IList<AdRoommate>> ReturnAdRoomatesByStudent(Student s)
    {
       IList<AdRoommate> lista =new List<AdRoommate>();
       lista= s.AdsRoommate;
       return lista;
    }

    public async Task<IList<AdStudyBuddy>> ReturnAdSBByStudent(Student s)
    {
        IList<AdStudyBuddy> lista =new List<AdStudyBuddy>();
       lista=s.AdsStudyBuddy;

       return lista;
    }

    public async Task<IList<AdTutor>> ReturnAdTutorByStudent(Student s)
    {
        IList<AdTutor> lista =new List<AdTutor>();
       lista=s.AdsTutor;

       return lista;
    }
}