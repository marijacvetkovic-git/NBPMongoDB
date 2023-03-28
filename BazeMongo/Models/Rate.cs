using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;

namespace Models
{
    public class Rate
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string RID {get; set; }
        public int RateValue { get; set; }
        public string? StudentRate { get; set; } 
        public string? ProfessorRate { get; set; } 
    
    }
}