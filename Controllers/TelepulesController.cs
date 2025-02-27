using IngatlanokBackend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IngatlanokBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TelepulesController : ControllerBase
    {
        [HttpGet("telepulesek")]
        public async Task<IActionResult> Get()
        {
            using (var cx = new IngatlanberlesiplatformContext())
            {
                try
                {
                    var telepulesek = await cx.Telepuleseks.ToListAsync();
                    if (telepulesek == null || telepulesek.Count == 0)
                    {
                        return NotFound("Nincs elérhető település.");
                    }
                    return Ok(telepulesek);
                }
                catch (Exception ex)
                {
                    return BadRequest($"Hiba történt: {ex.Message}");
                }
            }
        }

        [HttpGet("telepulesek/{nev}")]
        public async Task<IActionResult> Get(string nev)
        {
            using (var cx = new IngatlanberlesiplatformContext())
            {
                try
                {
                    var telepules = await cx.Telepuleseks.FirstOrDefaultAsync(f => f.Nev == nev);
                    if (telepules == null)
                    {
                        return NotFound($"A {nev} település nem található.");
                    }

                    if (telepules.Kep == null)
                    {
                        return Ok(new { telepules.Nev, telepules.Megye, telepules.Leiras, kep = "Nincs kép" });
                    }

                    return Ok(telepules);
                }
                catch (Exception ex)
                {
                    return BadRequest($"Hiba történt: {ex.Message}");
                }
            }
        }
    }
}
