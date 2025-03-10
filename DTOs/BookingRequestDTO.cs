namespace IngatlanokBackend.DTOs
{
    public class BookingRequestDTO
    {
            public int IngatlanId { get; set; }
            public int BerloId { get; set; }
            public int TulajdonosId { get; set; }
            public DateTime KezdesDatum { get; set; }
            public DateTime BefejezesDatum { get; set; }

    }
}
