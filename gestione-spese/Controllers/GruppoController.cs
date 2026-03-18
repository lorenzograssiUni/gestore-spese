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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Gruppo>>> GetGruppi()
        {
            return await _context.Gruppi
                .Include(g => g.Utenti)
                .Include(g => g.Spese)
                .ToListAsync();
        }

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

        [HttpPost]
        public async Task<ActionResult<Gruppo>> PostGruppo([FromBody] Gruppo gruppo)
        {
            _context.Gruppi.Add(gruppo);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetGruppo), new { id = gruppo.Id }, gruppo);
        }

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
                    throw; 
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGruppo(int id)
        {
            var gruppo = await _context.Gruppi
                .Include(g => g.Utenti)
                .Include(g => g.Spese)
                    .ThenInclude(s => s.Divisioni)
                .FirstOrDefaultAsync(g => g.Id == id);

            if (gruppo == null)
            {
                return NotFound();
            }

            foreach (var spesa in gruppo.Spese)
            {
                _context.Divisioni.RemoveRange(spesa.Divisioni);
            }

            _context.Spese.RemoveRange(gruppo.Spese);

            _context.Utenti.RemoveRange(gruppo.Utenti);

            _context.Gruppi.Remove(gruppo);

            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool GruppoExists(int id)
        {
            return _context.Gruppi.Any(e => e.Id == id);
        }

        [HttpGet("{id}/Bilanci")]
        public async Task<ActionResult<IEnumerable<object>>> GetBilanciGruppo(int id)
        {
            var gruppoEsiste = await _context.Gruppi.AnyAsync(g => g.Id == id);
            if (!gruppoEsiste) return NotFound("Gruppo non trovato");

            var utenti = await _context.Utenti.Where(u => u.Gruppo_ID == id).ToListAsync();

            var saldi = new Dictionary<int, decimal>();
            foreach (var u in utenti) saldi[u.Id] = 0;

            var spese = await _context.Spese
                .Include(s => s.Divisioni)
                .Where(s => s.Gruppo_ID == id)
                .ToListAsync();

            foreach (var spesa in spese)
            {
                if (saldi.ContainsKey(spesa.ChiPaga_ID))
                {
                    saldi[spesa.ChiPaga_ID] += spesa.Importo;
                }

                foreach (var div in spesa.Divisioni)
                {
                    if (saldi.ContainsKey(div.Utente_ID))
                    {
                        saldi[div.Utente_ID] -= div.Importo;
                    }
                }
            }

            var debitori = saldi.Where(s => s.Value < -0.01m).OrderBy(s => s.Value).ToList();
            var creditori = saldi.Where(s => s.Value > 0.01m).OrderByDescending(s => s.Value).ToList();

            var riepiloghi = new List<object>();

            int i = 0;
            int j = 0;

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
