using MongoExample.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using MongoDB.Bson;
using Models;

namespace MongoExample.Services;

public class MongoDBService {

    private readonly IMongoCollection<User> _user;
    private readonly IMongoCollection<Student> _student;
    private readonly IMongoCollection<Professor> _professor;
    private readonly IMongoCollection<Subject> _subject;
    private readonly IMongoCollection<Faculty> _faculty;
    private readonly IMongoCollection<AdRoommate> _adRoommate;
    private readonly IMongoCollection<AdStudyBuddy> _adStudyBuddy;
    private readonly IMongoCollection<AdTutor> _adTutor;
    

    public MongoDBService(IOptions<MongoDBSettings> mongoDBSettings) {
        MongoClient client = new MongoClient(mongoDBSettings.Value.ConnectionURI);
        IMongoDatabase database = client.GetDatabase(mongoDBSettings.Value.DatabaseName);
        
    }
}