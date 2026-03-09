using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace gestione_spese.Models
{
    public class Riepilogo
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("Gruppo")]
        public int Gruppo_ID { get; set; }

        [ForeignKey("UtenteCheDeve")]
        public int ChiDeve_ID { get; set; }

        [ForeignKey("UtenteACuiDeve")]
        public int AChiDeve_ID { get; set; }

        [Column(TypeName = "decimal(10, 2)")]
        public decimal Importo { get; set; }

        public DateTime DataCalcolo { get; set; } = DateTime.Now;

        public bool Pagato { get; set; } = false;

        public virtual Gruppo? Gruppo { get; set; }
        public virtual Utente? UtenteCheDeve { get; set; }
        public virtual Utente? UtenteACuiDeve { get; set; }
    }
}

