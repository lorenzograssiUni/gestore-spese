using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System; 

namespace gestione_spese.Models
{
    public class Utente
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Il nome è obbligatorio")]
        [StringLength(100)]
        public string? Nome { get; set; }

        [Required(ErrorMessage = "L'email è obbligatoria")]
        [EmailAddress]
        public string? Email { get; set; }

        public DateTime DataIscrizione { get; set; } = DateTime.Now;

        // Relazione molti-a-molti: un utente può stare in più gruppi
        public virtual ICollection<Gruppo> Gruppi { get; set; } = new List<Gruppo>();

        public virtual ICollection<Spesa> SpesePagate { get; set; } = new List<Spesa>();
        public virtual ICollection<DivisioneSpesa> DivisioniSpesa { get; set; } = new List<DivisioneSpesa>();
        public virtual ICollection<Riepilogo> RiepiloghettiDovuti { get; set; } = new List<Riepilogo>();
        public virtual ICollection<Riepilogo> RiepiloghettiRicevuti { get; set; } = new List<Riepilogo>();
    }
}