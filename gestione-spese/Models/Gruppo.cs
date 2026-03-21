using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System;

namespace gestione_spese.Models
{
    public class Gruppo
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Il nome del gruppo è obbligatorio")]
        [StringLength(100)]
        public string? Nome { get; set; }

        [StringLength(500)]
        public string? Descrizione { get; set; }

        public DateTime DataCreazione { get; set; } = DateTime.Now;

        public bool Attivo { get; set; } = true;

        [StringLength(10)]
        public string CodiceInvito { get; set; } = Guid.NewGuid().ToString("N").Substring(0, 8).ToUpper();

        public virtual ICollection<Utente> Utenti { get; set; } = new List<Utente>();
        public virtual ICollection<Spesa> Spese { get; set; } = new List<Spesa>();
        public virtual ICollection<Riepilogo> Riepiloghetti { get; set; } = new List<Riepilogo>();
    }
}
