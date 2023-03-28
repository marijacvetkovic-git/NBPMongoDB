using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MongoDB.Driver;
using MongoExample.Models;
using Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.Configure<MongoDBSettings>(
    builder.Configuration.GetSection("MongoDBSettings")
);
builder.Services.AddScoped<IUserService, UserServicess>();
builder.Services.AddHttpContextAccessor();
builder.Services.AddSingleton<IMongoDatabase>(options =>{
    var settings = builder.Configuration.GetSection("MongoDBSettings").Get<MongoDBSettings>();
    var client = new MongoClient(settings.ConnectionURI);
    return client.GetDatabase(settings.DatabaseName);
});

builder.Services.AddSingleton<IFacultyRepository, FacultyRepository>();
builder.Services.AddSingleton<IRateRepositroy,RateRepository>();
builder.Services.AddSingleton<ISubjectRepository, SubjectRepository>();
builder.Services.AddSingleton<IAdStudyBuddyRepository, AdStudyBuddyRepository>();
builder.Services.AddSingleton<IAdRoommateRepository, AdRoommateRepository>();
builder.Services.AddSingleton<IProfessorRepository,ProfessorRepository>();
builder.Services.AddSingleton<IAdTutorRepository, AdTutorRepository>();
builder.Services.AddSingleton<IStudentRepository,StudentRepository>();
builder.Services.AddSingleton<ICommentRepository,CommentRepository>();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(opitons=>{
    opitons.AddSecurityDefinition("oauth2", new Microsoft.OpenApi.Models.OpenApiSecurityScheme{
         Description = "Standard Authorization header using the Bearer scheme (\"bearer {token}\")",
        In = ParameterLocation.Header,
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey
    });

});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidateIssuer = false,
        ValidateAudience = false,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration.GetSection("AppSettings:Token").Value))
    };
}).AddCookie();

builder.Services.AddAuthorization();
builder.Services.AddCors(options => options.AddPolicy("CORS", builder =>
    {
        builder.AllowAnyOrigin();
        builder.WithOrigins(new string[]
        {
                        "http://localhost:7048",
                        "https://localhost:7048",
                        "http://127.0.0.1:7048",
                        "https://127.0.0.1:7048",
                        "http://localhost:8000",
                        "https://localhost:8000",
                        "http://127.0.0.1:8000",
                        "https://127.0.0.1:8000",
                        "http://localhost:3000",
                        "https://localhost:3000",
                        "http://127.0.0.1:3000",
                        "https://127.0.0.1:3000",
        })
        .AllowAnyHeader()
        .AllowAnyMethod()
		.WithMethods("GET","PUT","POST","DELETE","PATCH");
    }));



var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c=>{
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "MongoStudent V1");
    });
}

app.UseHttpsRedirection();
app.UseCors("CORS");
app.UseRouting();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
