using HMS.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HMS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin,Manager")]
    public class AuditController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuditController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetLogs(
            [FromQuery] string? action,
            [FromQuery] int? userId,
            [FromQuery] DateTime? from,
            [FromQuery] DateTime? to)
        {
            var query = _context.AuditLogs
                .Include(a => a.User)
                .AsQueryable();

            if (!string.IsNullOrEmpty(action))
                query = query.Where(a => a.Action == action);

            if (userId.HasValue)
                query = query.Where(a => a.UserId == userId.Value);

            if (from.HasValue)
                query = query.Where(a => a.Timestamp >= from.Value);

            if (to.HasValue)
                query = query.Where(a => a.Timestamp <= to.Value);

            var logs = await query
                .OrderByDescending(a => a.Timestamp)
                .Take(200)
                .Select(a => new
                {
                    a.Id,
                    a.Action,
                    a.Details,
                    a.IpAddress,
                    a.Timestamp,
                    UserName = a.User != null ? a.User.FullName : "System"
                })
                .ToListAsync();

            return Ok(logs);
        }
    }
}