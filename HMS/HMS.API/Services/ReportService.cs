// Author: Ahmed Shaain Firaq | S2401269

using HMS.API.Data;
using Microsoft.EntityFrameworkCore;

namespace HMS.API.Services
{
    public class ReportService
    {
        private readonly AppDbContext _context;

        public ReportService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<object> GetOccupancyReportAsync(DateTime from, DateTime to)
        {
            var totalRooms = await _context.Rooms.CountAsync();

            var occupiedBookings = await _context.Bookings
                .Where(b => b.Status != "Cancelled" &&
                            b.CheckInDate >= from &&
                            b.CheckOutDate <= to)
                .CountAsync();

            var occupancyRate = totalRooms > 0
                ? Math.Round((double)occupiedBookings / totalRooms * 100, 2)
                : 0;

            return new
            {
                TotalRooms = totalRooms,
                OccupiedBookings = occupiedBookings,
                OccupancyRate = occupancyRate,
                From = from,
                To = to
            };
        }

        public async Task<object> GetRevenueReportAsync(DateTime from, DateTime to)
        {
            var bookings = await _context.Bookings
                .Include(b => b.Room)
                .Where(b => b.Status != "Cancelled" &&
                            b.BookedAt >= from &&
                            b.BookedAt <= to)
                .ToListAsync();

            var totalRevenue = bookings.Sum(b => b.TotalPrice);

            var revenueByRoomType = bookings
                .GroupBy(b => b.Room.RoomType)
                .Select(g => new
                {
                    RoomType = g.Key,
                    Revenue = g.Sum(b => b.TotalPrice),
                    Bookings = g.Count()
                }).ToList();

            return new
            {
                TotalRevenue = totalRevenue,
                RevenueByRoomType = revenueByRoomType,
                From = from,
                To = to
            };
        }

        public async Task<object> GetDashboardSummaryAsync()
        {
            var today = DateTime.UtcNow.Date;

            var totalBookings = await _context.Bookings.CountAsync();
            var activeGuests = await _context.Bookings.CountAsync(b => b.Status == "CheckedIn");
            var todayArrivals = await _context.Bookings.CountAsync(b => b.CheckInDate.Date == today && b.Status == "Confirmed");
            var todayDepartures = await _context.Bookings.CountAsync(b => b.CheckOutDate.Date == today && b.Status == "CheckedIn");
            var availableRooms = await _context.Rooms.CountAsync(r => r.Status == "Available");
            var totalRevenue = await _context.Payments.SumAsync(p => (decimal?)p.Amount) ?? 0;

            return new
            {
                TotalBookings = totalBookings,
                ActiveGuests = activeGuests,
                TodayArrivals = todayArrivals,
                TodayDepartures = todayDepartures,
                AvailableRooms = availableRooms,
                TotalRevenue = totalRevenue
            };
        }
    }
}