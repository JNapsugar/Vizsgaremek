namespace IngatlanokBackend.DTOs
{
    public class IngatlanDTO
    {
        public int IngatlanId { get; set; }
        public string Cim { get; set; } = null!;
        public string? Leiras { get; set; }
        public string?  Helyszin { get; set; }
        public decimal Ar { get; set; }
        public int Meret { get; set; }
        public string Szolgaltatasok { get; set; }
        public int Szoba { get; set; }
        public DateTime FeltoltesDatum { get; set; }
        public int TulajdonosId { get; set; }  
    }
}
