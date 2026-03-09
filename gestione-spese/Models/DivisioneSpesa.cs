using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace gestione_spese.Models
{
    public class DivisioneSpesa
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("Spesa")]
        public int Spesa_ID { get; set; }

        [ForeignKey("Utente")]
        public int Utente_ID { get; set; }

        [Required]
        [Column(TypeName = "decimal(10, 2)")]
        public decimal Importo { get; set; }

        public virtual Spesa? Spesa { get; set; }
        public virtual Utente? Utente { get; set; }
    }
}
