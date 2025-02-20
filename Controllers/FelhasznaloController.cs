using IngatlanokBackend.DTOs;
using IngatlanokBackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Win32;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace IngatlanokBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FelhasznaloController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IngatlanberlesiplatformContext _context;
        private static Dictionary<string, string> resetTokens = new Dictionary<string, string>();

        public FelhasznaloController(IConfiguration configuration, IngatlanberlesiplatformContext context)
        {
            _configuration = configuration;
            _context = context;
        }
        private async Task<string> GenerateJwtTokenAsync(Felhasznalok user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, user.LoginNev), 
                    new Claim(ClaimTypes.Role, user.PermissionId.ToString()),  
                    new Claim("UserId", user.Id.ToString())
                }),
                Expires = DateTime.UtcNow.AddHours(1),  
                Issuer = _configuration["Jwt:Issuer"], 
                Audience = _configuration["Jwt:Audience"], 
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),  
                    SecurityAlgorithms.HmacSha256Signature  
                )
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token); 
        }
        [HttpGet("allUsers")]
        public async Task<IActionResult> Get()
        {
            using (var cx = new IngatlanberlesiplatformContext())
            {
                try
                {
                    return Ok(await cx.Felhasznaloks.ToListAsync());
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }
        }

        [HttpGet("felhasznalo/{userId}")]
        public async Task<IActionResult> Get(int userId)
        {
            using (var cx = new IngatlanberlesiplatformContext())
            {
                try
                {
                    var user = await cx.Felhasznaloks
                        .Where(f => f.Id == userId)
                        .Select(f => new
                        {
                            f.LoginNev,
                            f.Name,
                            f.Email,
                            f.ProfilePicturePath
                        })
                        .FirstOrDefaultAsync();

                    if (user == null)
                        return NotFound("Felhasználó nem található.");

                    return Ok(user);
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }
        }

        [HttpGet("me/{loginNev}")]
        public async Task<IActionResult> GetCurrentUser(string loginNev)
        {
            try
            {
                if (string.IsNullOrEmpty(loginNev))
                {
                    return BadRequest("A felhasználónév nem lehet üres.");
                }

                var user = await _context.Felhasznaloks
                    .Where(u => u.LoginNev == loginNev)
                    .Select(u => new GetCurrentUserDTO
                    {
                        
                        LoginNev = u.LoginNev,
                        Name = u.Name,
                        Email = u.Email,
                        ProfilePicturePath = u.ProfilePicturePath
                    })
                    .FirstOrDefaultAsync();

                if (user == null)
                {
                    return NotFound("Felhasználó nem található.");
                }

                if (!user.Active)
                {
                    return Unauthorized("A felhasználó inaktív.");
                }

                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Hiba történt az adatok lekérése során: {ex.Message}");
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginDTO)
        {
            if (loginDTO == null)
            {
                return BadRequest("A bejelentkezési adatok nem lehetnek üresek.");
            }

            try
            {
                var loginUser = await _context.Felhasznaloks.FirstOrDefaultAsync(u => u.LoginNev == loginDTO.loginName);
                if (loginUser == null)
                {
                    return Unauthorized(new { Message = "Hibás felhasználónév vagy jelszó." });
                }

                string computedHash = Program.CreateSHA256(loginDTO.Password, loginUser.Salt);
                if (loginUser.Hash != computedHash)
                {
                    return Unauthorized(new { Message = "Hibás felhasználónév vagy jelszó." });
                }

                loginUser.Active = true;
                _context.Felhasznaloks.Update(loginUser);
                await _context.SaveChangesAsync();

                var token = await GenerateJwtTokenAsync(loginUser);

                return Ok(new
                {
                    Message = "Sikeres bejelentkezés",
                    Token = token,
                    User = new
                    {
                        loginUser.Id,
                        loginUser.LoginNev,
                        loginUser.Name,
                        loginUser.Email,
                        loginUser.PermissionId
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Hiba történt a bejelentkezés során.", Error = ex.Message });
            }
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] LogoutDTO logoutDTO)
        {
            try
            {
                var user = await _context.Felhasznaloks.FirstOrDefaultAsync(u => u.LoginNev == logoutDTO.LoginNev);
                if (user == null)
                {
                    return NotFound("Felhasználó nem található.");
                }

                user.Active = false;
                await _context.SaveChangesAsync();

                return Ok("Sikeres kijelentkezés.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Hiba történt a kijelentkezés során: {ex.Message}");
            }
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register1(RegistrationDTO registrationDTO)
        {
            try
            {
                if (await _context.Felhasznaloks.AnyAsync(f => f.LoginNev == registrationDTO.LoginName || f.Email == registrationDTO.Email))
                {
                    return BadRequest("A felhasználónév vagy e-mail már foglalt!");
                }

                int permissionId = registrationDTO.PermissionId;

                if (permissionId < 1 || permissionId > 3)   
                {
                    return BadRequest("Érvénytelen jogosultság ID. Csak 1, 2 vagy 3 engedélyezett.");
                }

                if (permissionId < 1 || permissionId > 3)
                {
                    return BadRequest("A jogosultság ID-nak 1, 2 vagy 3-nak kell lennie.");
                }

                if (!await _context.Jogosultsagoks.AnyAsync(p => p.JogosultsagId == permissionId))
                {
                    return BadRequest($"A megadott jogosultság ({permissionId}) nincs az adatbázisban.");
                }

                string salt = Program.GenerateSalt();
                byte[] saltBytes = Encoding.UTF8.GetBytes(salt); 
                string hash = Program.CreateSHA256(registrationDTO.Password, salt);


                var newUser = new Felhasznalok
                {
                    LoginNev = registrationDTO.LoginName,
                    Email = registrationDTO.Email,
                    Name = registrationDTO.Name,
                    Salt = salt,
                    Hash = hash,
                    Active = true,
                    PermissionId = permissionId,
                };

                _context.Felhasznaloks.Add(newUser);
                await _context.SaveChangesAsync();

                return Ok("Sikeres regisztráció!");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Hiba történt: {ex.Message}. További részletek: {ex.StackTrace}");
            }
        }

        [HttpPost("RequestPasswordReset")]
        public async Task<IActionResult> RequestPasswordReset([FromBody] RequestPasswordResetDTO request)
        {
            try
            {
                var user = await _context.Felhasznaloks.FirstOrDefaultAsync(f => f.Email == request.Email);
                if (user == null)
                {
                    return BadRequest("Az e-mail cím nem található!");
                }

                string token = Guid.NewGuid().ToString();
                resetTokens[request.Email] = token;

                return Ok(new
                {
                    Message = "Az alábbi tokennel állíthatja vissza a jelszavát.",
                    Token = token
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Hiba történt: {ex.Message}");
            }
        }

        [HttpPost("ResetPassword")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDTO resetPasswordDTO)
        {
            try
            {
                if (!resetTokens.ContainsKey(resetPasswordDTO.Email) || resetTokens[resetPasswordDTO.Email] != resetPasswordDTO.Token)
                {
                    return BadRequest("Érvénytelen vagy lejárt token!");
                }

                var user = await _context.Felhasznaloks.FirstOrDefaultAsync(f => f.Email == resetPasswordDTO.Email);
                if (user == null)
                {
                    return BadRequest("Felhasználó nem található!");
                }

                string newSalt = Program.GenerateSalt();
                string newHash = Program.CreateSHA256(resetPasswordDTO.NewPassword, newSalt);

                user.Salt = newSalt;
                user.Hash = newHash;
                _context.Felhasznaloks.Update(user);
                await _context.SaveChangesAsync();

                resetTokens.Remove(resetPasswordDTO.Email);

                return Ok("A jelszó sikeresen frissítve.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Hiba történt: {ex.Message}");
            }
        }

        [HttpPut("{loginNev}")]
        public async Task<IActionResult> UpdateUser(string loginNev, [FromBody] UpdateUserDTO updatedUserData)
        {
            try
            {
                var user = await _context.Felhasznaloks.FirstOrDefaultAsync(u => u.LoginNev == loginNev);
                if (user == null)
                {
                    return NotFound("A megadott felhasználónév nem található.");
                }

                if (!string.IsNullOrEmpty(updatedUserData.Name))
                {
                    user.Name = updatedUserData.Name;
                }

                if (!string.IsNullOrEmpty(updatedUserData.Email))
                {
                    user.Email = updatedUserData.Email;
                }

                if (!string.IsNullOrEmpty(updatedUserData.LoginNev))
                {
                    user.LoginNev = updatedUserData.LoginNev;
                }

                if (!string.IsNullOrEmpty(updatedUserData.Password))
                {
                    string newSalt = Program.GenerateSalt();
                    string newHash = Program.CreateSHA256(updatedUserData.Password, newSalt);

                    user.Salt = newSalt;
                    user.Hash = newHash; 
                }

                if (updatedUserData.PermissionId.HasValue)
                {
                    user.PermissionId = updatedUserData.PermissionId.Value;
                }

                if (!string.IsNullOrEmpty(updatedUserData.ProfilePicturePath))
                {
                    user.ProfilePicturePath = updatedUserData.ProfilePicturePath;
                }

                _context.Felhasznaloks.Update(user);
                await _context.SaveChangesAsync();

                return Ok("A felhasználói adatok sikeresen frissítve.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Hiba történt a felhasználói adatok frissítése során: {ex.Message}");
            }
        }


        [HttpDelete("delete/{loginName}")]
        public async Task<IActionResult> DeleteUser(string loginName)
        {
            if (string.IsNullOrWhiteSpace(loginName))
            {
                return BadRequest("A felhasználónév nem lehet üres.");
            }

            try
            {
                var user = await _context.Felhasznaloks.FirstOrDefaultAsync(u => u.LoginNev == loginName);

                if (user == null)
                {
                    return NotFound($"Felhasználó '{loginName}' nem található.");
                }

                if (!user.Active)
                {
                    return Unauthorized($"A felhasználó '{loginName}' inaktív, nem törölhető.");
                }

                _context.Felhasznaloks.Remove(user);
                await _context.SaveChangesAsync();

                return Ok($"Felhasználó '{loginName}' sikeresen törölve.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Hiba történt a felhasználó törlése során: {ex.Message}");
            }
        }
    }
}
