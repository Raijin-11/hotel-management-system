using HMS.API.DTOs;
using HMS.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace HMS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _authService.RegisterAsync(dto.FullName, dto.Email, dto.Password);
            if (user == null)
                return BadRequest(new { message = "Email already exists." });

            var token = _authService.GenerateToken(user);
            return Ok(new AuthResponseDTO
            {
                Token = token,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
            var (user, error) = await _authService.LoginAsync(dto.Email, dto.Password, ipAddress);

            if (user == null)
                return Unauthorized(new { message = error });

            var token = _authService.GenerateToken(user);
            return Ok(new AuthResponseDTO
            {
                Token = token,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role
            });
        }
    }
}