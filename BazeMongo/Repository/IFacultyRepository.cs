
using Models;
using MongoDB.Bson;

public interface IFacultyRepository{
    Task<List<Faculty>> GetAllAsync();
    Task<Faculty> GetByIdAsync(string id);
    Task CreateNewFacultyAsync(Faculty newFaculty);
    Task UpdateFacultyAsync(Faculty facultyToUpdate);
    Task DeleteFacultyAsync(string id);
    Task<Faculty> GetFacultyByName(string name);
    Task<string> GetFacultyName(string id);



}