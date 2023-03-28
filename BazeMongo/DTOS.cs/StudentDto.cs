using MongoDB.Driver;

public class StudentDto{

        public string Name { get; set; }
        public string Surname { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
         public string City { get; set; }
        public int YearOfStudies { get; set; } 
        public string TypeOfStudies { get; set; } 
         public string FacultyStudent { get; set; }
}