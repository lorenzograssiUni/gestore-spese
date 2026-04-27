using gestione_spese.Data;
using gestione_spese.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;

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
        [HttpPost("login")]
        public async Task<ActionResult<Utente>> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
                return BadRequest("Email e password sono obbligatorie.");

            var utente = await _context.Utenti
                .Include(u => u.Gruppi)
                .FirstOrDefaultAsync(u => u.Email.ToLower() == request.Email.ToLower());

            if (utente == null)
            {
                // Registrazione automatica
                utente = new Utente
                {
                    Email = request.Email,
                    Nome = request.Email.Split('@')[0],
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
                };
                _context.Utenti.Add(utente);
                await _context.SaveChangesAsync();
                return Ok(utente);
            }

            // Login: verifica password
            if (!BCrypt.Net.BCrypt.Verify(request.Password, utente.PasswordHash))
                return Unauthorized("Password errata.");

            return Ok(utente);
        }

        // GET: api/Auth/exists?email=...
        [HttpGet("exists")]
        public async Task<ActionResult<bool>> EmailExists([FromQuery] string email)
        {
            if (string.IsNullOrEmpty(email))
                return BadRequest("Email obbligatoria.");

            var exists = await _context.Utenti
                .AnyAsync(u => u.Email.ToLower() == email.ToLower());

            return Ok(exists);
        }
    }

    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}