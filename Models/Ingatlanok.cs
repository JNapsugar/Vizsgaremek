using System;
using System.Collections.Generic;

namespace IngatlanokBackend.Models;

public partial class Ingatlanok
{
    public int IngatlanId { get; set; }

    public int TulajdonosId { get; set; }

    public string Cim { get; set; } = null!;

    public string? Leiras { get; set; }

    public string? Helyszin { get; set; }

    public decimal Ar { get; set; }

    public int? Meret { get; set; }

    public string? Szolgaltatasok { get; set; }

    public int Szoba { get; set; }

    public DateTime FeltoltesDatum { get; set; }

    public virtual ICollection<Foglalasok> Foglalasoks { get; set; } = new List<Foglalasok>();

    public virtual ICollection<Ingatlankepek> Ingatlankepeks { get; set; } = new List<Ingatlankepek>();

    public virtual Felhasznalok Tulajdonos { get; set; } = null!;
}
