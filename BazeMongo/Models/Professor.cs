using System.Text.Json.Serialization;
using MongoDB.Driver;

namespace Models{

    public class Professor:User
    { 
        public string? Education { get; set; }
        [JsonIgnore]
        public double AvgRate { get; set; }
        public IList<Comment>? Comments { get; set; } = new List<Comment>();
        public IList<Rate>? ProfessorRate { get; set; }= new List<Rate>();
        public  IList<SubjectView>? ProfessorSubject { get; set; }  = new List<SubjectView>();
      
    }
}