
using Models;
using MongoDB.Bson;

public interface IAdRoommateRepository{

    Task<List<AdRoommate>> GetAllAsync();
    Task<AdRoommate> GetByIdAsync(string id);
    Task CreateNewAdRoommateAsync(AdRoommate newAddRoommate, Student stud);
    Task UpdateAdRoommateAsync(AdRoommate addRoommateToUpdate);
    Task DeleteAdRoommateAsync(string id);
    Task<List<AdRoommate>> GetByStudent(string id);
    Task<List<AdRoommate>> GetAdByFilters(string city, int numberOfRoommates, bool flat);
    Task<List<AdRoommate>> GetAdByFilters2(string city, bool flat);

}