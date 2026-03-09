using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace gestione_spese.Models
{
    public class Utente
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Il nome è obbligatorio")]
        [StringLength(100)]
        public string? Nome { get; set; }

        [EmailAddress]
        public string? Email { get; set; }

        [ForeignKey("Gruppo")]
        public int Gruppo_ID { get; set; }

        public DateTime DataIscrizione { get; set; } = DateTime.Now;

        public virtual Gruppo? Gruppo { get; set; }
        public virtual ICollection<Spesa> SpesePagate { get; set; } = new List<Spesa>();
        public virtual ICollection<DivisioneSpesa> DivisioniSpesa { get; set; } = new List<DivisioneSpesa>();
        public virtual ICollection<Riepilogo> RiepiloghettiDovuti { get; set; } = new List<Riepilogo>();
        public virtual ICollection<Riepilogo> RiepiloghettiRicevuti { get; set; } = new List<Riepilogo>();
    }
}

