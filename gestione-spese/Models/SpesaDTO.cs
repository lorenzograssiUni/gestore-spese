using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace gestione_spese.Models
{
    public class NuovaSpesaDTO
    {
        public int Gruppo_ID { get; set; }
        public int ChiPaga_ID { get; set; }

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Importo { get; set; }

        public string? Descrizione { get; set; }

        public List<int> UtentiCoinvoltiIds { get; set; } = new List<int>();
    }
}
