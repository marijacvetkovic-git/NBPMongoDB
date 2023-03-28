using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;

namespace Models{

    public class Student:User
    {
        public string? City { get; set; }
        public int YearOfStudies { get; set; } 
        public string? TypeOfStudies { get; set; } 
        public FacultyShort? FacultyStudent { get; set; }
        public IList<AdRoommate> AdsRoommate { get; set; } = new List<AdRoommate>();
        public IList<AdStudyBuddy> AdsStudyBuddy { get; set; } = new List<AdStudyBuddy>();
        public IList<AdTutor> AdsTutor { get; set; } = new List<AdTutor>();
    }
}