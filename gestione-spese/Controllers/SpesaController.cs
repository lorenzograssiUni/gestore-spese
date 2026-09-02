using System.Diagnostics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using gestione_spese.Data;
using gestione_spese.Models;

namespace gestione_spese.Controllers;

[Authorize]
public class SpesaController : Controller
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<SpesaController> _logger;

    public SpesaController(ApplicationDbContext context, ILogger<SpesaController> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<IActionResult> Index()
    {
        var spese = await _context.Spese
            .Include(s => s.Utente)
            .Include(s => s.Gruppo)
            .ToListAsync();

        return View(spese);
    }

    public async Task<IActionResult> Details(int? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var spesa = await _context.Spese
            .Include(s => s.Utente)
            .Include(s => s.Gruppo)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (spesa == null)
        {
            return NotFound();
        }

        return View(spesa);
    }

    public IActionResult Create()
    {
        ViewBag.Utenti = _context.Utenti.ToList();
        ViewBag.Gruppi = _context.Gruppi.ToList();
        return View();
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create([Bind] Spesa spesa)
    {
        if (ModelState.IsValid)
        {
            _context.Add(spesa);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        ViewBag.Utenti = _context.Utenti.ToList();
        ViewBag.Gruppi = _context.Gruppi.ToList();
        return View(spesa);
    }

    public async Task<IActionResult> Edit(int? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var spesa = await _context.Spese
            .Include(s => s.Utente)
            .Include(s => s.Gruppo)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (spesa == null)
        {
            return NotFound();
        }

        ViewBag.Utenti = _context.Utenti.ToList();
        ViewBag.Gruppi = _context.Gruppi.ToList();
        return View(spesa);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int id, [Bind] Spesa spesa)
    {
        if (id != spesa.Id)
        {
            return NotFound();
        }

        if (ModelState.IsValid)
        {
            try
            {
                _context.Update(spesa);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SpesaExists(spesa.Id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return RedirectToAction(nameof(Index));
        }

        ViewBag.Utenti = _context.Utenti.ToList();
        ViewBag.Gruppi = _context.Gruppi.ToList();
        return View(spesa);
    }

    public async Task<IActionResult> Delete(int? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var spesa = await _context.Spese
            .Include(s => s.Utente)
            .Include(s => s.Gruppo)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (spesa == null)
        {
            return NotFound();
        }

        return View(spesa);
    }

    [HttpPost, ActionName("Delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteConfirmed(int id)
    {
        var spesa = await _context.Spese.FindAsync(id);
        if (spesa != null)
        {
            _context.Spese.Remove(spesa);
            await _context.SaveChangesAsync();
        }

        return RedirectToAction(nameof(Index));
    }

    private bool SpesaExists(int id)
    {
        return _context.Spese.Any(e => e.Id == id);
    }
}
