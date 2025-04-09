using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace IngatlanokBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KepekController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        public KepekController(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProxiedImage(int id)
        {
            var imageUrl = $"http://images.ingatlanok.nhely.hu/{id}.png";

            try
            {
                var response = await _httpClient.GetAsync(imageUrl);

                if (!response.IsSuccessStatusCode)
                {
                    return NotFound();
                }

                var imageBytes = await response.Content.ReadAsByteArrayAsync();

                return File(imageBytes, "image/png");
            }
            catch
            {
                return StatusCode(500, "Hiba történt a kép lekérése közben.");
            }
        }
    }
}
