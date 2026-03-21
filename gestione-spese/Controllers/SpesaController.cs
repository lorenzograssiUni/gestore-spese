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
    public class SpesaController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SpesaController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Spesa
        // Recupera tutte le spese registrate
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Spesa>>> GetSpese()
        {
            return await _context.Spese
                .Include(s => s.Gruppo)        
                .Include(s => s.UtenteChePaga)
                .ToListAsync();
        }

        // GET: api/Spesa/5
        // Recupera i dettagli di una singola spesa
        [HttpGet("{id}")]
        public async Task<ActionResult<Spesa>> GetSpesa(int id)
        {
            var spesa = await _context.Spese
                .Include(s => s.Gruppo)
                .Include(s => s.UtenteChePaga)
                .Include(s => s.Divisioni)     
                .FirstOrDefaultAsync(s => s.Id == id);

            if (spesa == null)
            {
                return NotFound("Spesa non trovata.");
            }

            return spesa;
        }

        // GET: api/Spesa/Gruppo/2
        [HttpGet("Gruppo/{gruppoId}")]
        public async Task<ActionResult<IEnumerable<Spesa>>> GetSpesePerGruppo(int gruppoId)
        {
            var spese = await _context.Spese
                .Include(s => s.UtenteChePaga)
                .Where(s => s.Gruppo_ID == gruppoId)
                .ToListAsync();

            if (!spese.Any())
            {
                return NotFound("Nessuna spesa trovata per questo gruppo.");
            }

            return spese;
        }

        // POST: api/Spesa
        [HttpPost]
        public async Task<ActionResult<Spesa>> PostSpesa([FromBody] NuovaSpesaDTO dto)
        {
            var gruppo = await _context.Gruppi
                .Include(g => g.Utenti) 
                .FirstOrDefaultAsync(g => g.Id == dto.Gruppo_ID);

            var utenteEsiste = await _context.Utenti.AnyAsync(u => u.Id == dto.ChiPaga_ID);

            if (gruppo == null) return BadRequest("Il Gruppo specificato non esiste.");
            if (!utenteEsiste) return BadRequest("L'Utente specificato come pagatore non esiste.");

            var nuovaSpesa = new Spesa
            {
                Gruppo_ID = dto.Gruppo_ID,
                ChiPaga_ID = dto.ChiPaga_ID,
                Importo = dto.Importo,
                Descrizione = dto.Descrizione,
                DataSpesa = System.DateTime.Now
            };

            _context.Spese.Add(nuovaSpesa);
            await _context.SaveChangesAsync(); 

            List<Utente> utentiDaAddebitare;

            if (dto.UtentiCoinvoltiIds == null || !dto.UtentiCoinvoltiIds.Any())
            {
                utentiDaAddebitare = gruppo.Utenti.ToList();
            }
            else
            {
                utentiDaAddebitare = gruppo.Utenti.Where(u => dto.UtentiCoinvoltiIds.Contains(u.Id)).ToList();
            }

            if (utentiDaAddebitare.Any())
            {
                decimal quota = Math.Round(nuovaSpesa.Importo / utentiDaAddebitare.Count, 2);

                foreach (var utente in utentiDaAddebitare)
                {
                    var divisione = new DivisioneSpesa
                    {
                        Spesa_ID = nuovaSpesa.Id,
                        Utente_ID = utente.Id,
                        Importo = quota
                    };
                    _context.Divisioni.Add(divisione);
                }

                await _context.SaveChangesAsync();
            }

            return CreatedAtAction(nameof(GetSpesa), new { id = nuovaSpesa.Id }, nuovaSpesa);
        }

        // PUT: api/Spesa/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSpesa(int id, [FromBody] Spesa spesa)
        {
            if (id != spesa.Id)
            {
                return BadRequest("L'ID dell'URL non corrisponde all'ID del corpo della richiesta.");
            }

            _context.Entry(spesa).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SpesaExists(id))
                {
                    return NotFound("La spesa che stai cercando di aggiornare non esiste.");
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Spesa/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSpesa(int id)
        {
            var spesa = await _context.Spese.FindAsync(id);
            if (spesa == null)
            {
                return NotFound();
            }

            _context.Spese.Remove(spesa);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SpesaExists(int id)
        {
            return _context.Spese.Any(e => e.Id == id);
        }
    }
}
