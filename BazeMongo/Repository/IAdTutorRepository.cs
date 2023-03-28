using Models;
using MongoDB.Bson;

public interface IAdTutorRepository{
    
    Task<List<AdTutor>> GetAllAsync(); 
    Task<AdTutor> GetByIdAsync(string id);
    Task CreateAdTutorAsync(AdTutor newAdTutor, Student student,string sid);
    Task UpdateAdTutuorAsync(AdTutor updateAdTutor);
    Task DeleteAdTutorAsync(string id);
    Task<List<AdTutor>> FilterAds(string subjName);
    Task<List<AdTutor>> GetAdsByStudent(string id);

}