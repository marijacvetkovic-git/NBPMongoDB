using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;

namespace Models
{
    public class Subject
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string SID { get; set; }
        public string? Name {get; set;} 
        public string? SubjectFaculty {get; set;}
        public IList<ProfessorView>? SubjectProf { get; set; } = new List<ProfessorView>();
        public IList<AdStudyBuddy>? SubjectAdStudyBuddy {get; set;} = new List<AdStudyBuddy>();    
        public IList<AdTutor>? SubjectAdTutor {get; set;}= new List<AdTutor>();

     
        
    }
}