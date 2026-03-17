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
    public class UtenteController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UtenteController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Utente
        // Recupera tutti gli utenti
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Utente>>> GetUtenti()
        {
            // Includo il gruppo di appartenenza per restituire dati più completi
            return await _context.Utenti
                .Include(u => u.Gruppo)
                .ToListAsync();
        }

        // GET: api/Utente/5
        // Recupera un singolo utente tramite ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Utente>> GetUtente(int id)
        {
            var utente = await _context.Utenti
                .Include(u => u.Gruppo)
                .Include(u => u.SpesePagate)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (utente == null)
            {
                return NotFound("Utente non trovato.");
            }

            return utente;
        }

        // POST: api/Utente
        // Crea un nuovo utente
        [HttpPost]
        public async Task<ActionResult<Utente>> PostUtente([FromBody] Utente utente)
        {
            // Verifichiamo se il Gruppo associato esiste prima di creare l'utente
            var gruppoEsiste = await _context.Gruppi.AnyAsync(g => g.Id == utente.Gruppo_ID);
            if (!gruppoEsiste)
            {
                return BadRequest("Impossibile creare l'utente: il Gruppo specificato non esiste. Crea prima il Gruppo.");
            }

            _context.Utenti.Add(utente);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUtente), new { id = utente.Id }, utente);
        }

        // PUT: api/Utente/5
        // Aggiorna i dati di un utente esistente (es. cambia email o nome)
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUtente(int id, [FromBody] Utente utente)
        {
            if (id != utente.Id)
            {
                return BadRequest("L'ID dell'URL non corrisponde all'ID del corpo della richiesta.");
            }

            _context.Entry(utente).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UtenteExists(id))
                {
                    return NotFound("L'utente che stai cercando di aggiornare non esiste.");
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Utente/5
        // Rimuove un utente
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUtente(int id)
        {
            var utente = await _context.Utenti.FindAsync(id);
            if (utente == null)
            {
                return NotFound();
            }

            _context.Utenti.Remove(utente);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Metodo privato di supporto
        private bool UtenteExists(int id)
        {
            return _context.Utenti.Any(e => e.Id == id);
        }
    }
}
