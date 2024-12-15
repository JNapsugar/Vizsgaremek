using System;
using System.Collections.Generic;

namespace IngatlanokBackend.Models;

public partial class Felhasznalok
{
    public int Id { get; set; }

    public string LoginNev { get; set; } = null!;

    public string Hash { get; set; } = null!;

    public string Salt { get; set; } = null!;

    public string Name { get; set; } = null!;

    public int? PermissionId { get; set; }

    public bool Active { get; set; }

    public string Email { get; set; } = null!;

    public string ProfilePicturePath { get; set; } = null!;

    public virtual ICollection<Foglalasok> Foglalasoks { get; set; } = new List<Foglalasok>();

    public virtual ICollection<Ingatlanok> Ingatlanoks { get; set; } = new List<Ingatlanok>();

    public virtual Szerepkorok Permission { get; set; } = null!;
}
