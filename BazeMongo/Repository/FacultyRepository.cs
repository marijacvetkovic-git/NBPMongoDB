using System.Diagnostics;
using Models;
using MongoDB.Bson;
using MongoDB.Driver;

public class FacultyRepository: IFacultyRepository{
    private readonly IMongoCollection<Faculty> _facultyCollection;
    private readonly IMongoCollection<Subject> _subjectCollection;
    private readonly IMongoDatabase _mongoDatabase;

    public FacultyRepository(IMongoDatabase mongoDatabase){
        _mongoDatabase= mongoDatabase;
        _facultyCollection= mongoDatabase.GetCollection<Faculty>("Faculty");
        _subjectCollection= mongoDatabase.GetCollection<Subject>("Subject");
    }


    public async Task CreateNewFacultyAsync(Faculty newFaculty)
    {

        await _facultyCollection.InsertOneAsync(newFaculty);    
    
    }

    public async Task DeleteFacultyAsync(string id)
    {
        var faculty= await _facultyCollection.Find(_=> _.FID==id).FirstOrDefaultAsync();
        foreach (SubjectView sv in faculty.SubjectsFac)
        {
            ISubjectRepository isr= new SubjectRepository(_mongoDatabase);
            await isr.DeleteSubjectAsync(sv.SID);
        }
        await _facultyCollection.DeleteOneAsync(x => x.FID== id);
    }


    public async Task<List<Faculty>> GetAllAsync()
    {
        return await _facultyCollection.Find(_ => true).ToListAsync();
    }

    public async Task<Faculty> GetByIdAsync(string id)
    {
        return await _facultyCollection.Find(_ => _.FID == id).FirstOrDefaultAsync();
    }

    public async Task<Faculty> GetFacultyByName(string name)
    {
        return await _facultyCollection.Find(_ => _.NameOfFaculty == name).FirstOrDefaultAsync();
    }

    public async Task<string> GetFacultyName(string id)
    {
        var f= await _facultyCollection.Find(_=>_.FID==id).FirstOrDefaultAsync();
        return f.NameOfFaculty;
    }

    public async Task UpdateFacultyAsync(Faculty facultyToUpdate)
    {
       await _facultyCollection.ReplaceOneAsync(x => x.FID == facultyToUpdate.FID, facultyToUpdate);
    }
}