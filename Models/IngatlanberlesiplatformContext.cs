using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace IngatlanokBackend.Models;

public partial class IngatlanberlesiplatformContext : DbContext
{
    public IngatlanberlesiplatformContext()
    {
    }

    public IngatlanberlesiplatformContext(DbContextOptions<IngatlanberlesiplatformContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Felhasznalok> Felhasznaloks { get; set; }

    public virtual DbSet<Foglalasok> Foglalasoks { get; set; }

    public virtual DbSet<Ingatlankepek> Ingatlankepeks { get; set; }

    public virtual DbSet<Ingatlanok> Ingatlanoks { get; set; }

    public virtual DbSet<Jogosultsagok> Jogosultsagoks { get; set; }

    public virtual DbSet<Szerepkorok> Szerepkoroks { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseMySQL("SERVER=localhost;PORT=3306;DATABASE=ingatlanberlesiplatform;USER=root;PASSWORD=;SSL MODE=none;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Felhasznalok>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("felhasznalok");

            entity.HasIndex(e => e.Email, "Email").IsUnique();
            entity.HasIndex(e => e.LoginNev, "LoginNev").IsUnique();
            entity.HasIndex(e => e.PermissionId, "Jog");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)");

            entity.Property(e => e.Email)
                .IsRequired()
                .HasMaxLength(64);

            entity.Property(e => e.Hash)
                .HasMaxLength(64)
                .HasColumnName("HASH");

            entity.Property(e => e.LoginNev)
                .IsRequired()
                .HasMaxLength(16);

            entity.Property(e => e.Name)
                .HasMaxLength(64);

            entity.Property(e => e.PermissionId)
                .IsRequired() 
                .HasColumnType("int(11)");

            entity.Property(e => e.ProfilePicturePath)
                .HasMaxLength(64)
                .IsRequired()
                .HasDefaultValue("");

            entity.Property(e => e.Salt)
                .HasMaxLength(64)
                .HasColumnName("SALT");

            entity.HasOne(d => d.Permission)
                .WithMany(p => p.Felhasznaloks)
                .HasForeignKey(d => d.PermissionId)
                .OnDelete(DeleteBehavior.Restrict)
                .IsRequired() 
                .HasConstraintName("felhasznalok_ibfk_1");
        });

        modelBuilder.Entity<Foglalasok>(entity =>
        {
            entity.HasKey(e => e.FoglalasId).HasName("PRIMARY");

            entity.ToTable("foglalasok");

            entity.HasIndex(e => e.BerloId, "berlo_id");

            entity.HasIndex(e => e.IngatlanId, "ingatlan_id");

            entity.Property(e => e.FoglalasId)
                .HasColumnType("int(11)")
                .HasColumnName("foglalas_id");
            entity.Property(e => e.Allapot)
                .HasDefaultValueSql("'''függőben'''")
                .HasColumnType("enum('függőben','elfogadva','elutasítva')")
                .HasColumnName("allapot");
            entity.Property(e => e.BefejezesDatum)
                .HasColumnType("date")
                .HasColumnName("befejezes_datum");
            entity.Property(e => e.BerloId)
                .HasColumnType("int(11)")
                .HasColumnName("berlo_id");
            entity.Property(e => e.IngatlanId)
                .HasColumnType("int(11)")
                .HasColumnName("ingatlan_id");
            entity.Property(e => e.KezdesDatum)
                .HasColumnType("date")
                .HasColumnName("kezdes_datum");
            entity.Property(e => e.LetrehozasDatum)
                .HasDefaultValueSql("'current_timestamp()'")
                .HasColumnType("timestamp")
                .HasColumnName("letrehozas_datum");

            entity.HasOne(d => d.Berlo).WithMany(p => p.Foglalasoks)
                .HasForeignKey(d => d.BerloId)
                .HasConstraintName("foglalasok_ibfk_2");

            entity.HasOne(d => d.Ingatlan).WithMany(p => p.Foglalasoks)
                .HasForeignKey(d => d.IngatlanId)
                .HasConstraintName("foglalasok_ibfk_1");
        });

        modelBuilder.Entity<Ingatlankepek>(entity =>
        {
            entity.HasKey(e => e.KepId).HasName("PRIMARY");

            entity.ToTable("ingatlankepek");

            entity.HasIndex(e => e.IngatlanId, "ingatlan_id");

            entity.Property(e => e.KepId)
                .HasColumnType("int(11)")
                .HasColumnName("kep_id");
            entity.Property(e => e.FeltoltesDatum)
                .HasDefaultValueSql("'current_timestamp()'")
                .HasColumnType("timestamp")
                .HasColumnName("feltoltes_datum");
            entity.Property(e => e.IngatlanId)
                .HasColumnType("int(11)")
                .HasColumnName("ingatlan_id");
            entity.Property(e => e.KepUrl)
                .HasColumnType("blob")
                .HasColumnName("kep_url");

            entity.HasOne(d => d.Ingatlan).WithMany(p => p.Ingatlankepeks)
                .HasForeignKey(d => d.IngatlanId)
                .HasConstraintName("ingatlankepek_ibfk_1");
        });

        modelBuilder.Entity<Ingatlanok>(entity =>
        {
            entity.HasKey(e => e.IngatlanId).HasName("PRIMARY");

            entity.ToTable("ingatlanok");

            entity.HasIndex(e => e.TulajdonosId, "tulajdonos_id");

            entity.Property(e => e.IngatlanId)
                .HasColumnType("int(11)")
                .HasColumnName("ingatlan_id");
            entity.Property(e => e.Ar)
                .HasPrecision(10)
                .HasColumnName("ar");
            entity.Property(e => e.Cim)
                .HasMaxLength(255)
                .HasColumnName("cim");
            entity.Property(e => e.FeltoltesDatum)
                .HasDefaultValueSql("'current_timestamp()'")
                .HasColumnType("timestamp")
                .HasColumnName("feltoltes_datum");
            entity.Property(e => e.Helyszin)
                .HasMaxLength(255)
                .HasDefaultValueSql("'NULL'")
                .HasColumnName("helyszin");
            entity.Property(e => e.Leiras)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("text")
                .HasColumnName("leiras");
            entity.Property(e => e.Meret)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("int(11)")
                .HasColumnName("meret");
            entity.Property(e => e.Szolgaltatasok)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("text")
                .HasColumnName("szolgaltatasok");
            entity.Property(e => e.TulajdonosId)
                .HasColumnType("int(11)")
                .HasColumnName("tulajdonos_id");

            entity.HasOne(d => d.Tulajdonos).WithMany(p => p.Ingatlanoks)
                .HasForeignKey(d => d.TulajdonosId)
                .HasConstraintName("ingatlanok_ibfk_1");
        });

        modelBuilder.Entity<Jogosultsagok>(entity =>
        {
            entity.HasKey(e => e.JogosultsagId).HasName("PRIMARY");

            entity.ToTable("jogosultsagok");

            entity.HasIndex(e => e.JogosultsagNev, "jogosultsag_nev").IsUnique();

            entity.Property(e => e.JogosultsagId)
                .HasColumnType("int(11)")
                .HasColumnName("jogosultsag_id");
            entity.Property(e => e.JogosultsagNev)
                .HasMaxLength(100)
                .HasColumnName("jogosultsag_nev");
            entity.Property(e => e.Leiras)
                .HasDefaultValueSql("'NULL'")
                .HasColumnType("text")
                .HasColumnName("leiras");
        });

        modelBuilder.Entity<Szerepkorok>(entity =>
        {
            entity.HasKey(e => e.SzerepkorId).HasName("PRIMARY");

            entity.ToTable("szerepkorok");

            entity.HasIndex(e => e.SzerepkorNev, "szerepkor_nev").IsUnique();

            entity.Property(e => e.SzerepkorId)
                .HasColumnType("int(11)")
                .HasColumnName("szerepkor_id");
            entity.Property(e => e.SzerepkorNev)
                .HasMaxLength(50)
                .HasColumnName("szerepkor_nev");

            entity.HasMany(d => d.Jogosultsags).WithMany(p => p.Szerepkors)
                .UsingEntity<Dictionary<string, object>>(
                    "Szerepkorjogosultsagok",
                    r => r.HasOne<Jogosultsagok>().WithMany()
                        .HasForeignKey("JogosultsagId")
                        .HasConstraintName("szerepkorjogosultsagok_ibfk_2"),
                    l => l.HasOne<Szerepkorok>().WithMany()
                        .HasForeignKey("SzerepkorId")
                        .HasConstraintName("szerepkorjogosultsagok_ibfk_1"),
                    j =>
                    {
                        j.HasKey("SzerepkorId", "JogosultsagId").HasName("PRIMARY");
                        j.ToTable("szerepkorjogosultsagok");
                        j.HasIndex(new[] { "JogosultsagId" }, "jogosultsag_id");
                        j.IndexerProperty<int>("SzerepkorId")
                            .HasColumnType("int(11)")
                            .HasColumnName("szerepkor_id");
                        j.IndexerProperty<int>("JogosultsagId")
                            .HasColumnType("int(11)")
                            .HasColumnName("jogosultsag_id");
                    });
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
