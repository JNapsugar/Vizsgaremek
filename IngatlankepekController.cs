using IngatlanokBackend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IngatlanokBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IngatlankepekController : ControllerBase
    {
        [HttpGet("ingatlankepek")]
        public async Task<IActionResult> Get()
        {
            using (var cx = new IngatlanberlesiplatformContext())
            {
                try
                {
                    return Ok(await cx.Ingatlankepeks.ToListAsync());
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }
        }

        [HttpGet("ingatlankepek/{ingatlanId}")]
        public async Task<IActionResult> Get(int ingatlanId)
        {
            using (var cx = new IngatlanberlesiplatformContext())
            {
                try
                {
                    return Ok(await cx.Ingatlankepeks.FirstOrDefaultAsync(f => f.IngatlanId == ingatlanId));
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }
        }


        [HttpPost("ingatlankepek")]
        public async Task<IActionResult> Post(Ingatlankepek ingatlankep)
        {
            using (var cx = new IngatlanberlesiplatformContext())
            {
                try
                {
                    cx.Add(ingatlankep);
                    await cx.SaveChangesAsync();
                    return Ok("Új ingatlan adatai eltárolva");
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }
        }


        [HttpPut("ingatlankepek/{id}")]
        public async Task<IActionResult> Put(int id, Ingatlankepek ingatlankep)
        {
            using (var cx = new IngatlanberlesiplatformContext())
            {
                try
                {
                    cx.Update(ingatlankep);
                    await cx.SaveChangesAsync();
                    return Ok("Ingatlan adatai módosítva");
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }
        }


        [HttpDelete("ingatlankepek/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            using (var cx = new IngatlanberlesiplatformContext())
            {
                try
                {
                    cx.Remove(new Ingatlankepek { IngatlanId = id });
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
