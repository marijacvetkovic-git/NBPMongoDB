using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Models;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Authorization;

using System.Security.Claims;

using Services;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

namespace projekatSWE.Controllers
{

[ApiController]
[Route("api/[controller]")]
 
    public class AuthenticateController : ControllerBase
    {

        private readonly IConfiguration _configuration;
        private readonly IUserService _userService;
        private readonly IWebHostEnvironment _hostEnvironment;
        private readonly IStudentRepository _studentRepository;
        private readonly IProfessorRepository _professorRepository;

        public AuthenticateController(IConfiguration configuration, IUserService userService, IWebHostEnvironment hostEnvironment, IStudentRepository studentRepository, IProfessorRepository professorRepository)
        {
            _configuration = configuration;
            _userService= userService;
            this._hostEnvironment= hostEnvironment;
            _studentRepository= studentRepository;
            _professorRepository= professorRepository;
        
        }

         private string CreateToken(User u, string role)
        {
            List<Claim> claims = new List<Claim>
            {
                
               new Claim(ClaimTypes.NameIdentifier, u.UID),
               new Claim(ClaimTypes.Name, u.Username),
               new Claim(ClaimTypes.Role, role),
               new Claim(ClaimTypes.Expiration, DateTime.Now.AddMinutes(120).ToString())
            };

            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(
                _configuration.GetSection("AppSettings:Token").Value));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddMinutes(60),
                signingCredentials: creds);

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }
    
    
    [HttpPut]
    [Route("Login")]
    public async Task<IActionResult> Login([FromBody]LogInDto s)
    {
        User u= new User();
        Student student=await _studentRepository.CheckUsernameAndPassword(s);
        if(student==null)
        {
            Professor prof=await _professorRepository.CheckUsernameAndPassword(s);
            if(prof==null) 
                return BadRequest("User with that username and password does not exist!");
            else 
            {
                var role1="Professor";
                u.UID= prof.UID;
                u.Username= prof.Username;
                string token1= CreateToken(u, role1);

                return Ok(new{
                    Token= token1,
                     UID=prof.UID,
                    Name= prof.Name ,
                    Surname= prof.Surname,
                    Email=prof.Email ,
                    Username=prof.Username,
                    Password=prof.Password,
                    Education=prof.Education,
                    AvgRate=prof.AvgRate 
                });
            }
        }
        var role= "Student";
        u.UID= student.UID;
        u.Username= student.Username;
        string token= CreateToken(u, role);
        return Ok(new{
            Token= token,
            UID=student.UID,
            Name= student.Name ,
            Surname= student.Surname,
            Email=student.Email ,
            Username=student.Username,
            Password=student.Password,
            City=student.City ,
            YearOfStudies= student.YearOfStudies,
            TypeOfStudies=student.TypeOfStudies,
            FacultyStudent=student.FacultyStudent

        });
    }
    }
}