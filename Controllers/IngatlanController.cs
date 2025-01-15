using IngatlanokBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IngatlanokBackend.Controllers
{
    public class IngatlanokController : Controller
    {
  
        [HttpGet("api/ingatlanok")]
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

        [HttpGet("api/ingatlanok/{ingatlanId}")]
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

   
        [HttpPost("api/ingatlanok")]
        public async Task<IActionResult> Post(Ingatlanok ingatlan)
        {
            using (var cx = new IngatlanberlesiplatformContext())
            {
                try
                {
                    cx.Add(ingatlan);
                    await cx.SaveChangesAsync();
                    return Ok("Új ingatlan adatai eltárolva");
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }
        }


        [HttpPut("api/ingatlanok/{id}")]
        public async Task<IActionResult> Put(int id, Ingatlanok ingatlan)
        {
            using (var cx = new IngatlanberlesiplatformContext())
            {
                try
                {
                    cx.Update(ingatlan);
                    await cx.SaveChangesAsync();
                    return Ok("Ingatlan adatai módosítva");
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }
        }


        [HttpDelete("api/ingatlanok/{id}")]
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
