using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using gestione_spese.Models;
using Microsoft.IdentityModel.Tokens;

namespace gestione_spese.Services;

public class JwtTokenService
{
    private readonly string _key;
    private readonly string _issuer;
    private readonly string _audience;

    public JwtTokenService(IConfiguration config)
    {
        _key = config["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key not configured");
        _issuer = config["Jwt:Issuer"] ?? throw new InvalidOperationException("Jwt:Issuer not configured");
        _audience = config["Jwt:Audience"] ?? throw new InvalidOperationException("Jwt:Audience not configured");
    }

    public string GenerateToken(Utente utente)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_key));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, utente.Id.ToString()),
            new Claim(ClaimTypes.Email, utente.Email)
        };

        var token = new JwtSecurityToken(
            _issuer,
            _audience,
            claims,
            expires: DateTime.UtcNow.AddMinutes(30),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
