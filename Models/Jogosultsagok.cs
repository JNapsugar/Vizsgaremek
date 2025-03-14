using System;
using System.Collections.Generic;

namespace IngatlanokBackend.Models;

public partial class Jogosultsagok
{
    public int JogosultsagId { get; set; }

    public string JogosultsagNev { get; set; } = null!;

    public string? Leiras { get; set; }
}
