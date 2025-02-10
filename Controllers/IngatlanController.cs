using IngatlanokBackend.DTOs;
using IngatlanokBackend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IngatlanokBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IngatlanController : ControllerBase
    {
        private readonly IngatlanberlesiplatformContext _context;
        public IngatlanController(IngatlanberlesiplatformContext context)
        {
            _context = context;
        }
        [HttpGet("ingatlanok")]
        public async Task<IActionResult> Get()
        {
            using (var cx = new IngatlanberlesiplatformContext())
            {
                try
                {
                    return Ok(await cx.Ingatlanoks.ToListAsync());
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }
        }

        [HttpGet("ingatlanok/{ingatlanId}")]
        public async Task<IActionResult> Get(int ingatlanId)
        {
            using (var cx = new IngatlanberlesiplatformContext())
            {
                try
                {
                    return Ok(await cx.Ingatlanoks.FirstOrDefaultAsync(f => f.IngatlanId == ingatlanId));
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }
        }


        [HttpPost("ingatlanok")]
        public async Task<IActionResult> Post(IngatlanDTO ingatlanDTO)
        {
            using (var cx = new IngatlanberlesiplatformContext())
            {
                try
                {
                    var tulajdonos = await _context.Felhasznaloks.FindAsync(ingatlanDTO.TulajdonosId);
                    if (tulajdonos == null)
                    {
                        return BadRequest(new { message = "A tulajdonos nem található." });
                    }

                    var ingatlan = new Ingatlanok
                    {
                        Cim = ingatlanDTO.Cim,
                        Leiras = ingatlanDTO.Leiras,
                        Helyszin = ingatlanDTO.Helyszin,
                        Ar = ingatlanDTO.Ar,
                        Meret = ingatlanDTO.Meret,
                        Szolgaltatasok = ingatlanDTO.Szolgaltatasok,
                        FeltoltesDatum = DateTime.UtcNow,
                        TulajdonosId = ingatlanDTO.TulajdonosId 
                    };

                    _context.Ingatlanoks.Add(ingatlan);
                    await _context.SaveChangesAsync();

                    return Ok(new { message = "Új ingatlan adatai eltárolva", ingatlan = ingatlanDTO });
                }
                catch (Exception ex)
                {
                    return BadRequest(new { message = ex.Message });
                }
            }
        }


        [HttpPut("ingatlanok/{id}")]
        public async Task<IActionResult> Put(int id, IngatlanDTO ingatlanDTO)
        {
            using (var cx = new IngatlanberlesiplatformContext())
            {
                try
                {
                    var ingatlan = await cx.Ingatlanoks.FindAsync(id);

                    if (ingatlan == null)
                    {
                        return NotFound(new { message = "Ingatlan nem található" });
                    }

                    ingatlan.Cim = ingatlanDTO.Cim;
                    ingatlan.Leiras = ingatlanDTO.Leiras;
                    ingatlan.Helyszin = ingatlanDTO.Helyszin;
                    ingatlan.Ar = ingatlanDTO.Ar;
                    ingatlan.Meret = ingatlanDTO.Meret;
                    ingatlan.Szolgaltatasok = ingatlanDTO.Szolgaltatasok;
                    ingatlan.FeltoltesDatum = ingatlanDTO.FeltoltesDatum;

                    cx.Update(ingatlan);
                    await cx.SaveChangesAsync();

                    return Ok(new { message = "Ingatlan adatai módosítva", ingatlan = ingatlanDTO });
                }
                catch (Exception ex)
                {
                    return BadRequest(new { message = ex.Message });
                }
            }
        }


        [HttpDelete("ingatlanok/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            using (var cx = new IngatlanberlesiplatformContext())
            {
                try
                {
                    cx.Remove(new Ingatlanok { IngatlanId = id });
                    await cx.SaveChangesAsync();
                    return Ok("Ingatlan adatai törölve");
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }
        }
    }
}
