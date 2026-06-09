using gestione_spese.Data;
using gestione_spese.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

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
            if (string.IsNullOrEmpty(request.Email))
                return BadRequest("L'email è obbligatoria.");

            var utente = await _context.Utenti
                .Include(u => u.Gruppi)
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (utente == null)
                return Unauthorized("Utente non trovato. Registrati prima di accedere.");

            return Ok(utente);
        }

        // POST: api/Auth/register
        [HttpPost("register")]
        public async Task<ActionResult<Utente>> Register([FromBody] RegisterRequest request)
        {
            if (string.IsNullOrEmpty(request.Email))
                return BadRequest("L'email è obbligatoria.");

            var esistente = await _context.Utenti.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (esistente != null)
                return Conflict("Un utente con questa email esiste già.");

            var utente = new Utente
            {
                Email = request.Email,
                Nome = string.IsNullOrEmpty(request.Nome) ? request.Email.Split('@')[0] : request.Nome
            };

            _context.Utenti.Add(utente);
            await _context.SaveChangesAsync();

            return Ok(utente);
        }
    }

    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class RegisterRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string Nome { get; set; }
    }
}
