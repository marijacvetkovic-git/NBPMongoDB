using Models;
using MongoDB.Bson;

public interface IAdStudyBuddyRepository{
    
    Task<List<AdStudyBuddy>> GetAllAsync();
    Task<AdStudyBuddy> GetByIdAsync(string id);
    Task CreateAdSBAsync(AdStudyBuddy newAdSB, Student student,string sid);
    Task UpdateAdSBAsync(AdStudyBuddy updateAdSB);
    Task DeleteAdSBAsync(string id);
    Task<List<AdStudyBuddy>> FilterAds(string subjName);
    Task<List<AdStudyBuddy>> GetAdsByStudent(string id);
}