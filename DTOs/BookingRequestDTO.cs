using IngatlanokBackend.Models;

namespace IngatlanokBackend.DTOs
{
    public class BookingRequestDTO
    {
            public int IngatlanId { get; set; }
            public int BerloId { get; set; }
            public DateTime KezdesDatum { get; set; }
            public DateTime BefejezesDatum { get; set; }
            public string Allapot { get; set; }

    }
}
