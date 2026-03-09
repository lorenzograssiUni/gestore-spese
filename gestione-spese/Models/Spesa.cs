using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace gestione_spese.Models
{
    public class Spesa
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("Gruppo")]
        public int Gruppo_ID { get; set; }

        [ForeignKey("UtenteChePaga")]
        public int ChiPaga_ID { get; set; }

        [Required(ErrorMessage = "L'importo è obbligatorio")]
        [Range(0.01, double.MaxValue, ErrorMessage = "L'importo deve essere maggiore di 0")]
        [Column(TypeName = "decimal(10, 2)")]
        public decimal Importo { get; set; }

        [StringLength(200)]
        public string? Descrizione { get; set; }

        public DateTime DataSpesa { get; set; } = DateTime.Now;

        [StringLength(50)]
        public string? Categoria { get; set; }

        public virtual Gruppo? Gruppo { get; set; }
        public virtual Utente? UtenteChePaga { get; set; }
        public virtual ICollection<DivisioneSpesa> Divisioni { get; set; } = new List<DivisioneSpesa>();
    }
}
