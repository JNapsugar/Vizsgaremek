using IngatlanokBackend.DTOs;
using IngatlanokBackend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net.Mail;
using System.Net;

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
        public static async Task SendEmail(string mailAddressTo, string subject, string body, bool isHtml = false)
        {
            MailMessage mail = new MailMessage();
            SmtpClient SmtpServer = new SmtpClient("smtp.gmail.com");
            mail.From = new MailAddress("ingatlanberlesiplatform@gmail.com");
            mail.To.Add(mailAddressTo);
            mail.Subject = subject;
            mail.Body = body;
            mail.IsBodyHtml = isHtml;

            SmtpServer.Port = 587;
            SmtpServer.Credentials = new System.Net.NetworkCredential("ingatlanberlesiplatform@gmail.com", "mhwhbcbihzzozqvc");
            SmtpServer.EnableSsl = true;

            await SmtpServer.SendMailAsync(mail);
        }


        [HttpGet("allBookings")]
        public async Task<IActionResult> Get()
        {
            using (var cx = new IngatlanberlesiplatformContext())
            {
                try
                {
                    return Ok(await cx.Foglalasoks  .ToListAsync());
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
            var property = await _context.Ingatlanoks.Include(i => i.Tulajdonos)
                                                       .FirstOrDefaultAsync(i => i.IngatlanId == request.IngatlanId);

            if (property == null)
            {
                return NotFound("Az ingatlan nem található.");
            }

            if (property.Tulajdonos == null)
            {
                return BadRequest("Az ingatlannak nincs hozzárendelt tulajdonosa.");
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

            var tenant = await _context.Felhasznaloks.FirstOrDefaultAsync(f => f.Id == request.BerloId);
            if (tenant == null)
            {
                return BadRequest("A bérlő nem található.");
            }

            _context.Foglalasoks.Add(booking);
            await _context.SaveChangesAsync();

            await SendEmail(property.Tulajdonos.Email, "Új foglalás az ingatlanára!",
            $"Kedves {property.Tulajdonos.Name},\n\n" +
            $"Örömmel értesítjük, hogy {tenant.Name} nevű bérlő lefoglalta az Ön \"{property.Cim}\" című ingatlanát.\n\n" +
            $"📅 **Foglalási időszak:** {booking.KezdesDatum:yyyy.MM.dd} - {booking.BefejezesDatum:yyyy.MM.dd}\n\n" +
            $"Kérjük, mielőbb tekintse át a foglalást, és jelezze vissza annak elfogadását vagy elutasítását. Amennyiben kérdése van, forduljon hozzánk bizalommal!\n\n" +
            $"Üdvözlettel,\n" +
            $"Rentify");

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
                          b.Allapot == "elfogadva" && 
                          b.KezdesDatum < updatedBooking.BefejezesDatum &&
                          b.BefejezesDatum > updatedBooking.KezdesDatum);

            if (!isAvailable)
            {
                return BadRequest("Az ingatlan a kiválasztott időszakban már foglalt.");
            }

            booking.KezdesDatum = updatedBooking.KezdesDatum;
            booking.BefejezesDatum = updatedBooking.BefejezesDatum;

            if (!string.IsNullOrEmpty(updatedBooking.Allapot))
            {
                booking.Allapot = updatedBooking.Allapot;
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "A foglalás sikeresen módosítva.",
                BookingId = booking.FoglalasId,
                Status = booking.Allapot,
                KezdesDatum = booking.KezdesDatum,
                BefejezesDatum = booking.BefejezesDatum
            });
        }



        [HttpPut("valasz/{foglalasId}")]
        public async Task<IActionResult> RespondToBooking(int foglalasId, [FromBody] string allapot)
        {
            var booking = await _context.Foglalasoks.FindAsync(foglalasId);
            if (booking == null)
            {
                return NotFound("A foglalás nem található.");
            }

            if (allapot != "elfogadva" && allapot != "elutasítva")
            {
                return BadRequest("Csak 'Elfogadva' vagy 'Elutasítva' állapot adható meg.");
            }

            booking.Allapot = allapot;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = $"A foglalás állapota {allapot} lett.",
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
