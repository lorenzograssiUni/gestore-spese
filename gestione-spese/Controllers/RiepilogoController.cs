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
    public class RiepilogoController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RiepilogoController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Riepilogo
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Riepilogo>>> GetRiepiloghi()
        {
            return await _context.Riepiloghi
                .Include(r => r.Gruppo)
                .Include(r => r.UtenteCheDeve)
                .Include(r => r.UtenteACuiDeve)
                .ToListAsync();
        }

        // GET: api/Riepilogo/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Riepilogo>> GetRiepilogo(int id)
        {
            var riepilogo = await _context.Riepiloghi
                .Include(r => r.Gruppo)
                .Include(r => r.UtenteCheDeve)
                .Include(r => r.UtenteACuiDeve)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (riepilogo == null)
            {
                return NotFound("Riepilogo non trovato.");
            }

            return riepilogo;
        }

        // GET: api/Riepilogo/Gruppo/2
        [HttpGet("Gruppo/{gruppoId}")]
        public async Task<ActionResult<IEnumerable<Riepilogo>>> GetRiepiloghiPerGruppo(int gruppoId)
        {
            var riepiloghi = await _context.Riepiloghi
                .Include(r => r.UtenteCheDeve)
                .Include(r => r.UtenteACuiDeve)
                .Where(r => r.Gruppo_ID == gruppoId)
                .ToListAsync();

            if (!riepiloghi.Any())
            {
                return NotFound("Nessun debito registrato per questo gruppo.");
            }

            return riepiloghi;
        }

        // POST: api/Riepilogo
        [HttpPost]
        public async Task<ActionResult<Riepilogo>> PostRiepilogo([FromBody] Riepilogo riepilogo)
        {
            var gruppoEsiste = await _context.Gruppi.AnyAsync(g => g.Id == riepilogo.Gruppo_ID);
            var utenteDeveEsiste = await _context.Utenti.AnyAsync(u => u.Id == riepilogo.ChiDeve_ID);
            var utenteACuiDeveEsiste = await _context.Utenti.AnyAsync(u => u.Id == riepilogo.AChiDeve_ID);

            if (!gruppoEsiste || !utenteDeveEsiste || !utenteACuiDeveEsiste)
            {
                return BadRequest("Gruppo o Utenti specificati non validi.");
            }

            if (riepilogo.ChiDeve_ID == riepilogo.AChiDeve_ID)
            {
                return BadRequest("Un utente non può avere un debito verso se stesso.");
            }

            var riepilogoEsistente = await _context.Riepiloghi
                .FirstOrDefaultAsync(r =>
                    r.Gruppo_ID == riepilogo.Gruppo_ID &&
                    r.ChiDeve_ID == riepilogo.ChiDeve_ID &&
                    r.AChiDeve_ID == riepilogo.AChiDeve_ID);

            if (riepilogoEsistente != null)
            {
                // Usa 'Importo' e 'Pagato' come definito nel tuo Model
                riepilogoEsistente.Importo += riepilogo.Importo;
                riepilogoEsistente.Pagato = false;
                _context.Entry(riepilogoEsistente).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return Ok(riepilogoEsistente);
            }

            _context.Riepiloghi.Add(riepilogo);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRiepilogo), new { id = riepilogo.Id }, riepilogo);
        }

        // PUT: api/Riepilogo/5/Saldato
        [HttpPut("{id}/Saldato")]
        public async Task<IActionResult> SegnaComeSaldato(int id)
        {
            var riepilogo = await _context.Riepiloghi.FindAsync(id);
            if (riepilogo == null)
            {
                return NotFound();
            }

            // Usa 'Pagato' e 'Importo' 
            riepilogo.Pagato = true;
            riepilogo.Importo = 0;

            _context.Entry(riepilogo).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(new { Messaggio = "Debito saldato con successo.", Riepilogo = riepilogo });
        }

        // DELETE: api/Riepilogo/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRiepilogo(int id)
        {
            var riepilogo = await _context.Riepiloghi.FindAsync(id);
            if (riepilogo == null)
            {
                return NotFound();
            }

            _context.Riepiloghi.Remove(riepilogo);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
