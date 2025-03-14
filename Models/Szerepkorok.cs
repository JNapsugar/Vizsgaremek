using System;
using System.Collections.Generic;

namespace IngatlanokBackend.Models;

public partial class Szerepkorok
{
    public int SzerepkorId { get; set; }

    public string SzerepkorNev { get; set; } = null!;

    public virtual ICollection<Felhasznalok> Felhasznaloks { get; set; } = new List<Felhasznalok>();
}
