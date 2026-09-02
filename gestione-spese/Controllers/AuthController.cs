using gestione_spese.Data;
using gestione_spese.Models;
using gestione_spese.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace gestione_spese.Controllers;

public class AuthController : Controller
{
    private readonly ApplicationDbContext _context;
    private readonly JwtTokenService _jwtTokenService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(ApplicationDbContext context, JwtTokenService jwtTokenService, ILogger<AuthController> logger)
    {
        _context = context;
        _jwtTokenService = jwtTokenService;
        _logger = logger;
    }

    [HttpGet("/api/auth/login")]
    public IActionResult LoginPage()
    {
        return View();
    }

    [HttpPost("/api/auth/login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new { message = "Email e password sono richiesti" });
        }

        var utente = await _context.Utenti
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (utente == null)
        {
            _logger.LogWarning("Tentativo di login con email non esistente: {Email}", request.Email);
            return Unauthorized(new { message = "Credenziali non valide" });
        }

        // Per ora accetta qualsiasi password non vuota (TODO: implementare hash reale quando aggiunto al modello)
        if (string.IsNullOrWhiteSpace(request.Password))
        {
            _logger.LogWarning("Tentativo di login fallito per utente: {Email}", request.Email);
            return Unauthorized(new { message = "Credenziali non valide" });
        }

        // Genera JWT token
        var token = _jwtTokenService.GenerateToken(utente);

        _logger.LogInformation("Login riuscito per utente: {Email}", request.Email);
        return Ok(new { token, expiresIn = 1800, utente = new { utente.Id, utente.Email } });
    }

    [HttpPost("/api/auth/register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new { message = "Email e password sono richiesti" });
        }

        // Verifica se l'utente esiste già
        var existingUser = await _context.Utenti
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (existingUser != null)
        {
            return Conflict(new { message = "Email già registrata" });
        }

        var nuovoUtente = new Utente
        {
            Email = request.Email
        };

        _context.Utenti.Add(nuovoUtente);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Registrazione riuscita per utente: {Email}", request.Email);
        return Ok(new { message = "Registrazione avvenuta con successo" });
    }
}

public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class RegisterRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
