using Models;
using MongoDB.Bson;
using MongoDB.Driver;
public interface IStudentRepository
{
    Task<List<Student>>GetAllAsync();
    Task<Student> GetById( string filter);
    Task CreateNewStudentAsync(StudentDto rate);
    Task UpdateStudent(Student rate);
    Task<int> DeleteStudentAsync(string id);
    Task<string> GetStudentUsername(string id);
    Task<Student>CheckUsernameAndPassword(LogInDto s);
    Task<IList<AdRoommate>> ReturnAdRoomatesByStudent(Student s);
    Task<IList<AdStudyBuddy>> ReturnAdSBByStudent(Student s);
    Task<IList<AdTutor>> ReturnAdTutorByStudent(Student s);




}