using System;
using System.Collections.Generic;

namespace IngatlanokBackend.Models;

public partial class Foglalasok
{
    public int FoglalasId { get; set; }

    public int IngatlanId { get; set; }

    public int BerloId { get; set; }

    public DateTime KezdesDatum { get; set; }

    public DateTime BefejezesDatum { get; set; }

    public string? Allapot { get; set; }

    public DateTime LetrehozasDatum { get; set; }

    public virtual Felhasznalok Berlo { get; set; } = null!;

    public virtual Ingatlanok Ingatlan { get; set; } = null!;
}
