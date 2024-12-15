using IngatlanokBackend.DTOs;
using IngatlanokBackend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IngatlanokBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {



        [HttpPost("SaltRequest/{LoginNev}")]

        public async Task<IActionResult> SaltRequest(string LoginNev)
        {
            using (var cx = new IngatlanberlesiplatformContext())
            {
                try
                {
                    Felhasznalok response = await cx.Felhasznaloks.FirstOrDefaultAsync(f => f.LoginNev == LoginNev);
                    if (response == null)
                    {
                        return BadRequest("Hiba");
                    }
                    return Ok(response.Salt);
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }
        }

        [HttpPost]

        public async Task<IActionResult> Login(LoginDTO loginDTO)
        {
            using (var cx = new IngatlanberlesiplatformContext())
            {
                try
                {
                    string Hash = IngatlanokBackend.Program.CreateSHA256(loginDTO.TmpHash);
                    Felhasznalok loggedUser = await cx.Felhasznaloks.FirstOrDefaultAsync(f => f.LoginNev == loginDTO.LoginName && f.Hash == Hash);
                    if (loggedUser != null && loggedUser.Active)
                    {
                        string token = Guid.NewGuid().ToString();
                        lock (Program.LoggedInUsers)
                        {
                            Program.LoggedInUsers.Add(token, loggedUser);
                        }
                        return Ok(new LoggedUser { Name = loggedUser.Name, Email = loggedUser.Email, ProfilePicturePath = loggedUser.ProfilePicturePath, Permission = loggedUser.PermissionId, Token = token });
                    }
                    else
                    {
                        return BadRequest("Hibás név vagy jelszó/inaktív felhszanáló!");
                    }
                }
                catch (Exception ex)
                {
                    return BadRequest(new LoggedUser { Permission = -1, Name = ex.Message, ProfilePicturePath = "", Email = "" });
                }
            }
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register(RegistrationDTO registrationDTO)
        {
            using (var cx = new IngatlanberlesiplatformContext())
            {
                try
                {
                    if (await cx.Felhasznaloks.AnyAsync(f => f.LoginNev == registrationDTO.LoginName || f.Email == registrationDTO.Email))
                    {
                        return BadRequest("A felhasználónév vagy e-mail már foglalt!");
                    }

                    if (!await cx.Jogosultsagoks.AnyAsync(p => p.JogosultsagId == 1))
                    {
                        return BadRequest("Alapértelmezett jogosultság nincs az adatbázisban.");
                    }

                    string salt = Program.GenerateSalt();
                    string hash = Program.CreateSHA256(registrationDTO.Password + salt);

                    var newUser = new Felhasznalok
                    {
                        LoginNev = registrationDTO.LoginName,
                        Email = registrationDTO.Email,
                        Name = registrationDTO.Name,
                        Salt = salt,
                        Hash = hash,
                        Active = true,
                        PermissionId = 1,
                        ProfilePicturePath = ""
                    };

                    cx.Felhasznaloks.Add(newUser);
                    await cx.SaveChangesAsync();




                    return Ok("Sikeres regisztráció!");
                }
                catch (DbUpdateException dbEx)
                {
                    return BadRequest($"Adatbázis hiba: {dbEx.InnerException?.Message ?? dbEx.Message}");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Hiba: {ex.Message}");
                    return BadRequest($"Ismeretlen hiba: {ex.Message}");
                }
            }
        }
    }
}

