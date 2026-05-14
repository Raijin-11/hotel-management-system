using HMS.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HMS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Manager,Admin")]
    public class ReportController : ControllerBase
    {
        private readonly ReportService _reportService;

        public ReportController(ReportService reportService)
        {
            _reportService = reportService;
        }

        [HttpGet("occupancy")]
        public async Task<IActionResult> Occupancy([FromQuery] DateTime from, [FromQuery] DateTime to)
        {
            var report = await _reportService.GetOccupancyReportAsync(from, to);
            return Ok(report);
        }

        [HttpGet("revenue")]
        public async Task<IActionResult> Revenue([FromQuery] DateTime from, [FromQuery] DateTime to)
        {
            var report = await _reportService.GetRevenueReportAsync(from, to);
            return Ok(report);
        }

        [HttpGet("dashboard")]
        [Authorize(Roles = "Staff,Manager,Admin")]
        public async Task<IActionResult> Dashboard()
        {
            var summary = await _reportService.GetDashboardSummaryAsync();
            return Ok(summary);
        }
    }
}