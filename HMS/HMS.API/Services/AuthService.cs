using HMS.API.Data;
using HMS.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace HMS.API.Services
{
    public class AuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;
        private readonly AuditService _auditService;

        public AuthService(AppDbContext context, IConfiguration config, AuditService auditService)
        {
            _context = context;
            _config = config;
            _auditService = auditService;
        }

        public async Task<User?> RegisterAsync(string fullName, string email, string password, string role = "Guest")
        {
            if (await _context.Users.AnyAsync(u => u.Email == email))
                return null;

            var user = new User
            {
                FullName = fullName,
                Email = email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                Role = role,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            await _auditService.LogAsync(user.Id, "Register", $"New user registered: {email}");
            return user;
        }

        public async Task<(User? user, string? error)> LoginAsync(string email, string password, string ipAddress)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
                return (null, "Invalid email or password.");

            // Check lockout
            if (user.IsLocked)
            {
                if (user.LockoutEnd.HasValue && user.LockoutEnd > DateTime.UtcNow)
                    return (null, "Account is locked. Try again later.");

                // Lockout expired — reset
                user.IsLocked = false;
                user.FailedLoginAttempts = 0;
                user.LockoutEnd = null;
            }

            if (!BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
            {
                user.FailedLoginAttempts++;

                if (user.FailedLoginAttempts >= 5)
                {
                    user.IsLocked = true;
                    user.LockoutEnd = DateTime.UtcNow.AddMinutes(15);
                    await _context.SaveChangesAsync();
                    await _auditService.LogAsync(user.Id, "AccountLocked", $"Account locked after 5 failed attempts", ipAddress);
                    return (null, "Account locked after 5 failed attempts. Try again in 15 minutes.");
                }

                await _context.SaveChangesAsync();
                await _auditService.LogAsync(user.Id, "FailedLogin", $"Failed login attempt {user.FailedLoginAttempts}/5", ipAddress);
                return (null, $"Invalid email or password. {5 - user.FailedLoginAttempts} attempts remaining.");
            }

            // Successful login — reset failed attempts
            user.FailedLoginAttempts = 0;
            user.IsLocked = false;
            user.LockoutEnd = null;
            await _context.SaveChangesAsync();
            await _auditService.LogAsync(user.Id, "Login", $"Successful login", ipAddress);

            return (user, null);
        }

        public string GenerateToken(User user)
        {
            var jwtSettings = _config.GetSection("JwtSettings");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.FullName),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(double.Parse(jwtSettings["ExpiryMinutes"]!)),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}