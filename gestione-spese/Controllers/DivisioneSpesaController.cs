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
    public class DivisioneSpesaController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DivisioneSpesaController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<DivisioneSpesa>>> GetDivisioni()
        {
            return await _context.Divisioni
                .Include(d => d.Utente)
                .Include(d => d.Spesa)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DivisioneSpesa>> GetDivisioneSpesa(int id)
        {
            var divisione = await _context.Divisioni
                .Include(d => d.Utente)
                .Include(d => d.Spesa)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (divisione == null)
            {
                return NotFound("Divisione spesa non trovata.");
            }

            return divisione;
        }

        [HttpGet("Spesa/{spesaId}")]
        public async Task<ActionResult<IEnumerable<DivisioneSpesa>>> GetDivisioniPerSpesa(int spesaId)
        {
            var divisioni = await _context.Divisioni
                .Include(d => d.Utente)
                .Where(d => d.Spesa_ID == spesaId)
                .ToListAsync();

            if (!divisioni.Any())
            {
                return NotFound("Nessuna divisione trovata per questa spesa.");
            }

            return divisioni;
        }

        [HttpPost]
        public async Task<ActionResult<DivisioneSpesa>> PostDivisioneSpesa([FromBody] DivisioneSpesa divisioneSpesa)
        {
            var spesaEsiste = await _context.Spese.AnyAsync(s => s.Id == divisioneSpesa.Spesa_ID);
            var utenteEsiste = await _context.Utenti.AnyAsync(u => u.Id == divisioneSpesa.Utente_ID);

            if (!spesaEsiste)
            {
                return BadRequest("La Spesa specificata non esiste.");
            }
            if (!utenteEsiste)
            {
                return BadRequest("L'Utente specificato non esiste.");
            }

            var quotaGiaEsistente = await _context.Divisioni
                .AnyAsync(d => d.Spesa_ID == divisioneSpesa.Spesa_ID && d.Utente_ID == divisioneSpesa.Utente_ID);

            if (quotaGiaEsistente)
            {
                return Conflict("Questo utente ha già una quota registrata per questa spesa. Usa la rotta PUT per aggiornarla.");
            }

            _context.Divisioni.Add(divisioneSpesa);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDivisioneSpesa), new { id = divisioneSpesa.Id }, divisioneSpesa);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutDivisioneSpesa(int id, [FromBody] DivisioneSpesa divisioneSpesa)
        {
            if (id != divisioneSpesa.Id)
            {
                return BadRequest("L'ID non corrisponde.");
            }

            _context.Entry(divisioneSpesa).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DivisioneSpesaExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDivisioneSpesa(int id)
        {
            var divisione = await _context.Divisioni.FindAsync(id);
            if (divisione == null)
            {
                return NotFound();
            }

            _context.Divisioni.Remove(divisione);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DivisioneSpesaExists(int id)
        {
            return _context.Divisioni.Any(e => e.Id == id);
        }
    }
}
