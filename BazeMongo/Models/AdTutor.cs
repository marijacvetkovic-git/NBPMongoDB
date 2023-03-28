using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;

namespace Models
{
    public class AdTutor:Ad
    {
        public string? YearOfStudies { get; set;}
        public string? TypeOfStudies {get; set;}
        public string? SubjectAdTutor {get; set;}
    }
}