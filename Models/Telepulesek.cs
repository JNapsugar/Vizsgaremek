using System;
using System.Collections.Generic;
using System.Reflection.Metadata;

namespace IngatlanokBackend.Models;

public partial class Telepulesek
{
    public string nev { get; set; }
    public string megye { get; set; }
    public string? leiras { get; set; }
    public string? kep { get; set; }
}

