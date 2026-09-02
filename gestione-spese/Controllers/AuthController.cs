using System.Security.Cryptography;
using System.Text;
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

        // Verifica password (assumendo che sia memorizzata come hash o in chiaro - adattare se necessario)
        var passwordHash = HashPassword(request.Password, utente.Salt);
        if (passwordHash != utente.Password)
        {
            _logger.LogWarning("Tentativo di login fallito per utente: {Email}", request.Email);
            return Unauthorized(new { message = "Credenziali non valide" });
        }

        // Genera JWT token
        var token = _jwtTokenService.GenerateToken(utente);

        _logger.LogInformation("Login riuscito per utente: {Email}", request.Email);
        return Ok(new { token, expiresIn = 1800, utente = new { utente.Id, utente.Email, utente.Username } });
    }

    [HttpPost("/api/auth/register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password) || string.IsNullOrWhiteSpace(request.Username))
        {
            return BadRequest(new { message = "Email, password e username sono richiesti" });
        }

        // Verifica se l'utente esiste già
        var existingUser = await _context.Utenti
            .FirstOrDefaultAsync(u => u.Email == request.Email || u.Username == request.Username);

        if (existingUser != null)
        {
            return Conflict(new { message = "Email o username già registrati" });
        }

        // Genera salt e hash per la password
        var salt = GenerateSalt();
        var passwordHash = HashPassword(request.Password, salt);

        var nuovoUtente = new Utente
        {
            Email = request.Email,
            Username = request.Username,
            Password = passwordHash,
            Salt = salt
        };

        _context.Utenti.Add(nuovoUtente);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Registrazione riuscita per utente: {Email}", request.Email);
        return Ok(new { message = "Registrazione avvenuta con successo" });
    }

    private static string GenerateSalt()
    {
        var salt = new byte[32];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(salt);
        return Convert.ToBase64String(salt);
    }

    private static string HashPassword(string password, string salt)
    {
        using var sha256 = SHA256.Create();
        var saltBytes = Encoding.UTF8.GetBytes(salt);
        var passwordBytes = Encoding.UTF8.GetBytes(password);
        var combined = new byte[saltBytes.Length + passwordBytes.Length];
        Array.Copy(saltBytes, combined, saltBytes.Length);
        Array.Copy(passwordBytes, combined, saltBytes.Length, passwordBytes.Length);
        var hashBytes = sha256.ComputeHash(combined);
        return Convert.ToBase64String(hashBytes);
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
    public string Username { get; set; } = string.Empty;
}
