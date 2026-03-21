using gestione_spese.Models;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

namespace gestione_spese.Data
{
    public class ApplicationDbContext : DbContext
    { 

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Gruppo> Gruppi { get; set; }
        public DbSet<Utente> Utenti { get; set; }
        public DbSet<Spesa> Spese { get; set; }
        public DbSet<DivisioneSpesa> Divisioni { get; set; }
        public DbSet<Riepilogo> Riepiloghi { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Utente>()
                .HasMany(u => u.Gruppi)
                .WithMany(g => g.Utenti)
                .UsingEntity(j => j.ToTable("UtenteGruppo"));

            modelBuilder.Entity<Spesa>()
                .HasOne(s => s.Gruppo)
                .WithMany(g => g.Spese)
                .HasForeignKey(s => s.Gruppo_ID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Spesa>()
                .HasOne(s => s.UtenteChePaga)
                .WithMany(u => u.SpesePagate)
                .HasForeignKey(s => s.ChiPaga_ID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<DivisioneSpesa>()
                .HasOne(d => d.Spesa)
                .WithMany(s => s.Divisioni)
                .HasForeignKey(d => d.Spesa_ID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<DivisioneSpesa>()
                .HasOne(d => d.Utente)
                .WithMany(u => u.DivisioniSpesa)
                .HasForeignKey(d => d.Utente_ID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Riepilogo>()
                .HasOne(r => r.Gruppo)
                .WithMany(g => g.Riepiloghetti)
                .HasForeignKey(r => r.Gruppo_ID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Riepilogo>()
                .HasOne(r => r.UtenteCheDeve)
                .WithMany(u => u.RiepiloghettiDovuti)
                .HasForeignKey(r => r.ChiDeve_ID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Riepilogo>()
                .HasOne(r => r.UtenteACuiDeve)
                .WithMany(u => u.RiepiloghettiRicevuti)
                .HasForeignKey(r => r.AChiDeve_ID)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}

