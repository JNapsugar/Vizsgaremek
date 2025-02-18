namespace IngatlanokBackend.DTOs
{
    public class BookingResponseDTO
    {
        public int Id { get; set; }
        public int IngatlanId { get; set; }
        public int BerloId { get; set; }
        public DateTime KezdesDatum { get; set; }
        public DateTime BefejezesDatum { get; set; }
        public string Allapot { get; set; }
    }
}
