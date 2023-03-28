using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;

namespace Models
{
    public class Faculty
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string FID { get; set; }
        public string? NameOfFaculty {get; set;}
        public IList<SubjectView>? SubjectsFac { get; set; }= new List<SubjectView>();
    }
}