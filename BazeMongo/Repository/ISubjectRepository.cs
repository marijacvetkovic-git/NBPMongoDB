using Models;
using MongoDB.Bson;

public interface ISubjectRepository{
  
    Task<List<Subject>> GetAllAsync();
    Task<Subject> GetByIdAsync(string id);
    Task CreateSubjectAsync(Subject newSub);
    Task UpdateSubjectAsync(Subject updateSub);
    Task DeleteSubjectAsync(string id);
    Task <IList<SubjectView>> ReturnSubjectsByProfessor(Professor p);

    Task<string> GetSubjectName(string id);

    Task<string> GetFacultyOfSubject(string id);



}