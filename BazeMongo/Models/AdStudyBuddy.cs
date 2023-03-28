using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;

namespace Models
{
    public class AdStudyBuddy:Ad
    {
        public string? YearOfStudies { get; set;}
        public string? TypeOfStudies {get; set;}

        public string? SubjectAdStudyBuddy {get; set;}
    }
}