using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace IngatlanokBackend.Models;

public partial class Ingatlankepek
{
    public int? KepId { get; set; }

    public int IngatlanId { get; set; }

    public string KepUrl { get; set; } = null!;

    public DateTime FeltoltesDatum { get; set; }

    [JsonIgnore]
    public virtual Ingatlanok? Ingatlan { get; set; } = null!;
}
