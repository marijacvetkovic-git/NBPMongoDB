using System.Text.Json.Serialization;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;
//using Newtonsoft.Json;

namespace Models
{
    public class AdRoommate:Ad
    {
        public bool Flat { get; set; }  
        public string? City {get; set;}
        public int NumberOfRoommates { get; set; } 
 
    }
}