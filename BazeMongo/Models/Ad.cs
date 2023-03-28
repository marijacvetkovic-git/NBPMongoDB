using System.Text.Json.Serialization;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;

namespace Models
{
    public class Ad
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string AID { get; set; }
        public DateTime Date { get; set; }
        public string? Summary {get; set;}
        public string StudentAd { get; set; } 
    
    }
}