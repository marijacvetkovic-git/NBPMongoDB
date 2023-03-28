using Models;
using MongoDB.Bson;
using MongoDB.Driver;
public interface IRateRepositroy
{
  Task<List<Rate>>GetAllAsync();
  Task<Rate> GetById( string filter);
  Task<string> CreateNewRateAsync(RateDto rate);
  Task UpdateRate(Rate rate,Rate Resp);
  Task<int> DeleteRateAsync(string id);
  Task <IList<Rate>> ReturnRatesByProfessor(Professor p);
  Task<IList<Rate>> ReturnRatesByStudent(string id);
  Task<string> AlreadyRated(string idProf, string idStud);
}