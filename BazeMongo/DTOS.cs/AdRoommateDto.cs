using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;

    public class AdRoommateDto
    {
        public string? Summary {get; set;}
        public bool Flat { get; set; }  
        public string? City {get; set;}
        public int NumberOfRoommates { get; set; } 
        public string? StudentId { get; set; }
    }
