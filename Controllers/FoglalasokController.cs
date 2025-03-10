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

        [HttpGet("tulajdonos/{tulajdonosId}/pending")]
        public async Task<IActionResult> GetPendingBookingsForOwner(int tulajdonosId)
        {
            var pendingBookings = await _context.Foglalasoks
                .Where(b => b.Allapot == "függőben" && _context.Ingatlanoks
                    .Any(i => i.IngatlanId == b.IngatlanId && i.TulajdonosId == tulajdonosId))
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

            return Ok(pendingBookings);
        }

        [HttpGet("tulajdonos/{tulajdonosId}")]
        public async Task<IActionResult> GetOwnerBookings(int tulajdonosId)
        {
            var ownerBookings = await _context.Foglalasoks
                .Where(b => _context.Ingatlanoks
                    .Any(i => i.IngatlanId == b.IngatlanId && i.TulajdonosId == tulajdonosId))
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

            return Ok(ownerBookings);
        }

        [HttpGet("ingatlan/{ingatlanId}/tulajdonos")]
        public async Task<IActionResult> GetPropertyOwner(int ingatlanId)
        {
            var property = await _context.Ingatlanoks
                .Where(i => i.IngatlanId == ingatlanId)
                .Select(i => new { i.TulajdonosId })
                .FirstOrDefaultAsync();

            if (property == null)
            {
                return NotFound("Az ingatlan nem található.");
            }

            return Ok(property);
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
                TulajdonosId = request.TulajdonosId,
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
