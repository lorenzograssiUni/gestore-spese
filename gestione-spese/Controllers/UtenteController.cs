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
            return await _context.Utenti
                .Include(u => u.Gruppi) // CAMBIATO DA Gruppo A Gruppi
                .ToListAsync();
        }

        // GET: api/Utente/5
        // Recupera un singolo utente tramite ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Utente>> GetUtente(int id)
        {
            var utente = await _context.Utenti
                .Include(u => u.Gruppi) // CAMBIATO DA Gruppo A Gruppi
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
            // RIMOSSO IL CONTROLLO SU GRUPPO_ID PERCHÈ ORA L'UTENTE SI UNISCE AI GRUPPI SUCCESSIVAMENTE
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

        private bool UtenteExists(int id)
        {
            return _context.Utenti.Any(e => e.Id == id);
        }

        public class LoginRequest
        {
            public string Email { get; set; }
        }

        [HttpPost("login")]
        public async Task<ActionResult<Utente>> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email))
                return BadRequest("L'email è obbligatoria");

            var utente = await _context.Utenti
                .Include(u => u.Gruppi)
                .FirstOrDefaultAsync(u => u.Email.ToLower() == request.Email.ToLower());

            if (utente == null)
            {
                utente = new Utente
                {
                    Email = request.Email,
                    Nome = request.Email.Split('@')[0] 
                };

                _context.Utenti.Add(utente);
                await _context.SaveChangesAsync();
            }

            return Ok(utente);
        }
        public class UpdateNomeRequest
        {
            public string NuovoNome { get; set; }
        }

        // PUT: api/Utente/5/nome
        [HttpPut("{id}/nome")]
        public async Task<IActionResult> AggiornaNome(int id, [FromBody] UpdateNomeRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.NuovoNome))
                return BadRequest("Il nome non può essere vuoto.");

            var utente = await _context.Utenti.FindAsync(id);
            if (utente == null)
                return NotFound("Utente non trovato.");

            utente.Nome = request.NuovoNome;
            await _context.SaveChangesAsync();

            return Ok(utente);
        }

    }
}
