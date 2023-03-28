
using Models;
using MongoDB.Bson;

public interface IProfessorRepository{
    Task<List<Professor>> GetAllAsync();
    Task<Professor> GetByIdAsync(string id);
    Task<Professor> GetProfessorUsername(string id);
    Task<string> GetProfessorIdByUsername(string username);
    Task<Professor> CheckUsernameAndPassword(LogInDto l);
    Task CreateNewProfessorAsync(ProfessorDto newProfessor);
    Task UpdateProfessorAsync(Professor updatedProfessor);
    Task DeleteProfessorAsync(string id);
    Task AddSubjectProfesor(Subject s, Professor p);

}