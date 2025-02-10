using System;
using System.Collections.Generic;

namespace IngatlanokBackend.Models;

public partial class Telepulesek
{
    public string Nev { get; set; } = null!;

    public string Megye { get; set; } = null!;

    public string? Leiras { get; set; }

    public string? Kep { get; set; }
}
