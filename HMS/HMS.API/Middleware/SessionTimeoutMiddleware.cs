// Author: Ahmed Shaain Firaq | S2401269

using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace HMS.API.Middleware
{
    public class SessionTimeoutMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IConfiguration _config;

        public SessionTimeoutMiddleware(RequestDelegate next, IConfiguration config)
        {
            _next = next;
            _config = config;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var token = context.Request.Headers["Authorization"]
                .FirstOrDefault()?.Split(" ").Last();

            if (!string.IsNullOrEmpty(token))
            {
                try
                {
                    var jwtSettings = _config.GetSection("JwtSettings");
                    var key = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]!));

                    var tokenHandler = new JwtSecurityTokenHandler();
                    tokenHandler.ValidateToken(token, new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = key,
                        ValidateIssuer = true,
                        ValidIssuer = jwtSettings["Issuer"],
                        ValidateAudience = true,
                        ValidAudience = jwtSettings["Audience"],
                        ValidateLifetime = true,
                        ClockSkew = TimeSpan.Zero
                    }, out SecurityToken validatedToken);

                    var jwtToken = (JwtSecurityToken)validatedToken;
                    var expiry = jwtToken.ValidTo;

                    // Token expires in less than 0 minutes = expired
                    if (expiry < DateTime.UtcNow)
                    {
                        context.Response.StatusCode = 401;
                        await context.Response.WriteAsync("Session expired. Please log in again.");
                        return;
                    }
                }
                catch
                {
                    // Invalid token — let the auth middleware handle it
                }
            }

            await _next(context);
        }
    }
}