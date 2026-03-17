using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using gestione_spese.Models;
using gestione_spese.Data;

namespace gestione_spese.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class GruppoController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public GruppoController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Gruppo
        // Legge tutti i gruppi
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Gruppo>>> GetGruppi()
        {
            // Aggiungiamo anche le Spese al caricamento per la card!
            return await _context.Gruppi
                .Include(g => g.Utenti)
                .Include(g => g.Spese)
                .ToListAsync();
        }

        // GET: api/Gruppo/5
        // Legge un singolo gruppo tramite ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Gruppo>> GetGruppo(int id)
        {
            var gruppo = await _context.Gruppi
                .Include(g => g.Utenti)
                .Include(g => g.Spese)
                .FirstOrDefaultAsync(g => g.Id == id);

            if (gruppo == null)
            {
                return NotFound();
            }

            return gruppo;
        }

        // POST: api/Gruppo
        // Crea un nuovo gruppo
        [HttpPost]
        public async Task<ActionResult<Gruppo>> PostGruppo([FromBody] Gruppo gruppo)
        {
            // Il ModelState è validato in automatico dall'attributo [ApiController]
            _context.Gruppi.Add(gruppo);
            await _context.SaveChangesAsync();

            // Ritorna un 201 Created con l'URL per recuperare la risorsa appena creata
            return CreatedAtAction(nameof(GetGruppo), new { id = gruppo.Id }, gruppo);
        }

        // PUT: api/Gruppo/5
        // Aggiorna un gruppo esistente
        [HttpPut("{id}")]
        public async Task<IActionResult> PutGruppo(int id, [FromBody] Gruppo gruppo)
        {
            if (id != gruppo.Id)
            {
                return BadRequest("L'ID dell'URL non corrisponde all'ID del corpo della richiesta.");
            }

            _context.Entry(gruppo).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GruppoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw; // Rilancia l'eccezione se è un altro errore
                }
            }

            return NoContent();
        }

        // DELETE: api/Gruppo/5
        // Elimina un gruppo e TUTTO il suo contenuto (Spese, Utenti, Divisioni)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGruppo(int id)
        {
            // Carico il gruppo includendo TUTTO quello che gli appartiene
            var gruppo = await _context.Gruppi
                .Include(g => g.Utenti)
                .Include(g => g.Spese)
                    .ThenInclude(s => s.Divisioni)
                .FirstOrDefaultAsync(g => g.Id == id);

            if (gruppo == null)
            {
                return NotFound();
            }

            // 1. Elimino prima tutte le divisioni (quote) di ogni spesa
            foreach (var spesa in gruppo.Spese)
            {
                _context.Divisioni.RemoveRange(spesa.Divisioni);
            }

            // 2. Elimino tutte le spese del gruppo
            _context.Spese.RemoveRange(gruppo.Spese);

            // 3. Elimino tutti gli utenti del gruppo
            _context.Utenti.RemoveRange(gruppo.Utenti);

            // 4. Infine elimino il gruppo stesso
            _context.Gruppi.Remove(gruppo);

            // Salvo tutto in una singola transazione!
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Metodo di supporto per verificare l'esistenza
        private bool GruppoExists(int id)
        {
            return _context.Gruppi.Any(e => e.Id == id);
        }

        // =========================================================
        // CALCOLO BILANCI
        // =========================================================

        // GET: api/Gruppo/5/Bilanci
        // Calcola in tempo reale "Chi deve a Chi" per un gruppo specifico
        [HttpGet("{id}/Bilanci")]
        public async Task<ActionResult<IEnumerable<object>>> GetBilanciGruppo(int id)
        {
            var gruppoEsiste = await _context.Gruppi.AnyAsync(g => g.Id == id);
            if (!gruppoEsiste) return NotFound("Gruppo non trovato");

            // 1. Prendo tutti gli utenti del gruppo
            var utenti = await _context.Utenti.Where(u => u.Gruppo_ID == id).ToListAsync();

            // Dizionario per tenere traccia del SALDO NETTO di ogni utente
            var saldi = new Dictionary<int, decimal>();
            foreach (var u in utenti) saldi[u.Id] = 0;

            // 2. Prendo tutte le spese del gruppo con le relative "Divisioni"
            var spese = await _context.Spese
                .Include(s => s.Divisioni)
                .Where(s => s.Gruppo_ID == id)
                .ToListAsync();

            // 3. Calcolo i Saldi Netti
            foreach (var spesa in spese)
            {
                // Chi ha pagato ottiene un credito pari al totale della spesa
                if (saldi.ContainsKey(spesa.ChiPaga_ID))
                {
                    saldi[spesa.ChiPaga_ID] += spesa.Importo;
                }

                // Sottraggo a ciascun partecipante la sua quota ("Divisione")
                foreach (var div in spesa.Divisioni)
                {
                    if (saldi.ContainsKey(div.Utente_ID))
                    {
                        saldi[div.Utente_ID] -= div.Importo;
                    }
                }
            }

            // 4. Separo chi è in Debito da chi è in Credito
            var debitori = saldi.Where(s => s.Value < -0.01m).OrderBy(s => s.Value).ToList();
            var creditori = saldi.Where(s => s.Value > 0.01m).OrderByDescending(s => s.Value).ToList();

            var riepiloghi = new List<object>();

            int i = 0;
            int j = 0;

            // Algoritmo Greedy per sistemare i pagamenti
            while (i < debitori.Count && j < creditori.Count)
            {
                var debito = Math.Abs(debitori[i].Value);
                var credito = creditori[j].Value;

                var importoDaSaldare = Math.Min(debito, credito);

                riepiloghi.Add(new
                {
                    da = utenti.First(u => u.Id == debitori[i].Key).Nome,
                    a = utenti.First(u => u.Id == creditori[j].Key).Nome,
                    importo = importoDaSaldare
                });

                debitori[i] = new KeyValuePair<int, decimal>(debitori[i].Key, -(debito - importoDaSaldare));
                creditori[j] = new KeyValuePair<int, decimal>(creditori[j].Key, credito - importoDaSaldare);

                if (Math.Abs(debitori[i].Value) < 0.01m) i++;
                if (creditori[j].Value < 0.01m) j++;
            }

            return Ok(riepiloghi);
        }
    }
}
