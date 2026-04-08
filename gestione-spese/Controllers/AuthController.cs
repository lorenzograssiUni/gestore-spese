using gestione_spese.Data;
using gestione_spese.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace gestione_spese.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/Auth/login
        // Se l'utente NON esiste → lo registra con la password fornita
        // Se l'utente ESISTE → verifica la password
        [HttpPost("login")]
        public async Task<ActionResult<Utente>> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrEmpty(request.Email))
                return BadRequest("L'email è obbligatoria.");

            if (string.IsNullOrEmpty(request.Password))
                return BadRequest("La password è obbligatoria.");

            var utente = await _context.Utenti
                .Include(u => u.Gruppi)
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            // --- REGISTRAZIONE: utente non esiste ---
            if (utente == null)
            {
                utente = new Utente
                {
                    Email = request.Email,
                    Nome = request.Email.Split('@')[0],
                    // BCrypt genera automaticamente il salt e produce l'hash
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
                };
                _context.Utenti.Add(utente);
                await _context.SaveChangesAsync();

                // Restituisce l'utente senza esporre PasswordHash
                return Ok(NascondiPassword(utente));
            }

            // --- LOGIN: utente esiste, verifica password ---
            bool passwordCorretta = BCrypt.Net.BCrypt.Verify(request.Password, utente.PasswordHash);

            if (!passwordCorretta)
                return Unauthorized("Password errata.");

            return Ok(NascondiPassword(utente));
        }

        // Metodo privato: azzera l'hash prima di inviarlo al client
        // così la password hashata non viaggia mai sul frontend
        private object NascondiPassword(Utente u) => new
        {
            u.Id,
            u.Nome,
            u.Email,
            u.DataIscrizione,
            u.Gruppi
        };
    }

    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }  // NUOVO
    }
}