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

        [HttpPost]
        public async Task<IActionResult> CreateBooking([FromBody] BookingRequestDTO request)
        {
            var property = await _context.Ingatlanoks.FindAsync(request.IngatlanId);
            if (property == null)
            {
                return NotFound("Az ingatlan nem található.");
            }

            bool isAvailable = !_context.Foglalasoks
                .Any(b => b.IngatlanId == request.IngatlanId &&
                          b.Allapot == "Confirmed" &&
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
                Allapot = "Pending"
            };

            _context.Foglalasoks.Add(booking);
            await _context.SaveChangesAsync();


            var response = new BookingResponseDTO
            {
                FoglalasId = booking.FoglalasId,
                IngatlanId = booking.IngatlanId,
                BerloId = booking.BerloId,
                KezdesDatum = booking.KezdesDatum,
                BefejezesDatum = booking.BefejezesDatum,
                Allapot = booking.Allapot
            };

            return Ok(response);
        }

        [HttpGet("{userId}")]
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


        [HttpGet("{ingatlanId}")]
        public async Task<IActionResult> CheckPropertyBookings(int propertyId)
        {
            var bookings = await _context.Foglalasoks
                .Where(b => b.IngatlanId == propertyId)
                .ToListAsync();

            if (bookings.Any())
            {
                return Ok(new { HasBookings = true, Bookings = bookings });
            }
            else
            {
                return Ok(new { HasBookings = false });
            }
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
