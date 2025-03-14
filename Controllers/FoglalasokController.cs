using IngatlanokBackend.DTOs;
using IngatlanokBackend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IngatlanokBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FoglalasokController : ControllerBase
    {
        private readonly IngatlanberlesiplatformContext _context;

        public FoglalasokController(IngatlanberlesiplatformContext context)
        {
            _context = context;
        }



        [HttpGet("allBookings")]
        public async Task<IActionResult> Get()
        {
            using (var cx = new IngatlanberlesiplatformContext())
            {
                try
                {
                    return Ok(await cx.Foglalasoks.ToListAsync());
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }
        }


        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserBookings(int userId)
        {
            var bookings = await _context.Foglalasoks
                .Where(b => b.BerloId == userId)
                .Select(b => new BookingResponseDTO
                {
                    FoglalasId = b.FoglalasId,
                    IngatlanId = b.IngatlanId,
                    BerloId = b.BerloId,
                    KezdesDatum = b.KezdesDatum,
                    BefejezesDatum = b.BefejezesDatum,
                    Allapot = b.Allapot
                })
                .ToListAsync();

            return Ok(bookings);
        }

        [HttpGet("ingatlan/{ingatlanId}")]
        public async Task<IActionResult> CheckPropertyBookings(int ingatlanId)
        {
            var bookings = await _context.Foglalasoks
                .Where(b => b.IngatlanId == ingatlanId)
                .ToListAsync();

            return Ok(new
            {
                HasBookings = bookings.Any(),
                Bookings = bookings
            });
        }


        [HttpPost("addBooking")]
        public async Task<IActionResult> CreateBooking([FromBody] BookingRequestDTO request)
        {
            var property = await _context.Ingatlanoks.FindAsync(request.IngatlanId);
            if (property == null)
            {
                return NotFound("Az ingatlan nem található.");
            }

            bool isAvailable = !_context.Foglalasoks
                .Any(b => b.IngatlanId == request.IngatlanId &&
                          b.Allapot == "elfogadva" &&
                          b.KezdesDatum < request.BefejezesDatum &&
                          b.BefejezesDatum > request.KezdesDatum);

            if (!isAvailable)
            {
                return BadRequest("Az ingatlan a kiválasztott időszakban már foglalt.");
            }

            var booking = new Foglalasok
            {
                IngatlanId = request.IngatlanId,
                BerloId = request.BerloId,
                KezdesDatum = request.KezdesDatum,
                BefejezesDatum = request.BefejezesDatum,
                Allapot = "függőben"
            };

            _context.Foglalasoks.Add(booking);
            await _context.SaveChangesAsync();

            return Ok(new BookingResponseDTO
            {
                FoglalasId = booking.FoglalasId,
                IngatlanId = booking.IngatlanId,
                BerloId = booking.BerloId,
                KezdesDatum = booking.KezdesDatum,
                BefejezesDatum = booking.BefejezesDatum,
                Allapot = booking.Allapot
            });
        }

        [HttpPut("valasz/{foglalasId}/{tulajdonosId}")]
        public async Task<IActionResult> RespondToBooking(int foglalasId, int tulajdonosId, [FromBody] BookingResponseDTO response)
        {
            var booking = await _context.Foglalasoks.FindAsync(foglalasId);
            if (booking == null)
            {
                return NotFound("A foglalás nem található.");
            }

            var property = await _context.Ingatlanoks.FindAsync(booking.IngatlanId);
            if (property == null)
            {
                return NotFound("Az ingatlan nem található.");
            }

            if (property.TulajdonosId != tulajdonosId)
            {
                return Unauthorized("Nem vagy jogosult ezt a foglalást kezelni.");
            }

            if (response.Allapot != "Elfogadva" && response.Allapot != "Elutasítva")
            {
                return BadRequest("Csak 'Elfogadva' vagy 'Elutasítva' állapot adható meg.");
            }

            booking.Allapot = response.Allapot;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = $"A foglalás állapota {response.Allapot} lett.",
                BookingId = booking.FoglalasId
            });
        }

        [HttpPut("modositas/{foglalasId}")]
        public async Task<IActionResult> UpdateBooking(int foglalasId, [FromBody] BookingRequestDTO updatedBooking)
        {
            var booking = await _context.Foglalasoks.FindAsync(foglalasId);
            if (booking == null)
            {
                return NotFound("A foglalás nem található.");
            }

            bool isAvailable = !_context.Foglalasoks
                .Any(b => b.IngatlanId == booking.IngatlanId &&
                          b.FoglalasId != foglalasId &&
                          b.KezdesDatum < updatedBooking.BefejezesDatum &&
                          b.BefejezesDatum > updatedBooking.KezdesDatum);

            if (!isAvailable)
            {
                return BadRequest("Az ingatlan a kiválasztott időszakban már foglalt.");
            }

            booking.KezdesDatum = updatedBooking.KezdesDatum;
            booking.BefejezesDatum = updatedBooking.BefejezesDatum;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "A foglalás sikeresen módosítva.",
                BookingId = booking.FoglalasId
            });
        }




        [HttpDelete("{foglalasId}")]
        public async Task<IActionResult> DeleteBooking(int foglalasId)
        {
            var booking = await _context.Foglalasoks.FindAsync(foglalasId);
            if (booking == null)
            {
                return NotFound("A foglalás nem található.");
            }

            _context.Foglalasoks.Remove(booking);
            await _context.SaveChangesAsync();

            return Ok("A foglalás sikeresen törölve.");
        }
    }
}
