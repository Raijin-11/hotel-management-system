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
            var totalNights = Math.Max(1, (to - from).Days);

            // Bookings that overlap the date range (excluding cancelled)
            var bookings = await _context.Bookings
                .Include(b => b.Room)
                .ThenInclude(r => r.Hotel)
                .Where(b => b.Status != "Cancelled" &&
                            b.CheckInDate < to &&
                            b.CheckOutDate > from)
                .ToListAsync();

            // Compute room-nights per booking, clamped to the report range
            var bookingsWithNights = bookings.Select(b =>
            {
                var effectiveStart = b.CheckInDate > from ? b.CheckInDate : from;
                var effectiveEnd = b.CheckOutDate < to ? b.CheckOutDate : to;
                var nights = Math.Max(0, (int)(effectiveEnd - effectiveStart).TotalDays);
                return new
                {
                    b.Id,
                    RoomNumber = b.Room.RoomNumber,
                    HotelName = b.Room.Hotel.Name,
                    b.CheckInDate,
                    b.CheckOutDate,
                    Nights = nights,
                    b.Status
                };
            }).ToList();

            var occupiedRoomNights = bookingsWithNights.Sum(b => b.Nights);
            var totalPossibleRoomNights = totalRooms * totalNights;
            var occupancyRate = totalPossibleRoomNights > 0
                ? Math.Round((double)occupiedRoomNights / totalPossibleRoomNights * 100, 2)
                : 0;

            return new
            {
                TotalRooms = totalRooms,
                OccupiedBookings = occupiedRoomNights,
                OccupancyRate = occupancyRate,
                TotalPossibleRoomNights = totalPossibleRoomNights,
                From = from,
                To = to,
                Bookings = bookingsWithNights
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

            var totalBookingsCount = bookings.Count;
            var averageRevenue = totalBookingsCount > 0 ? totalRevenue / totalBookingsCount : 0;
            return new
            {
                TotalRevenue = totalRevenue,
                TotalBookings = totalBookingsCount,
                AverageRevenue = Math.Round(averageRevenue, 2),
                RevenueByRoomType = revenueByRoomType,
                From = from,
                To = to
            };
        }

        public async Task<object> GetDashboardSummaryAsync()
        {
            var today = DateTime.UtcNow.Date;

            var totalBookings = await _context.Bookings.CountAsync();
            var activeBookings = await _context.Bookings.CountAsync(b => b.Status == "CheckedIn");
            var todayArrivals = await _context.Bookings.CountAsync(b => b.CheckInDate.Date == today && b.Status == "Confirmed");
            var todayDepartures = await _context.Bookings.CountAsync(b => b.CheckOutDate.Date == today && b.Status == "CheckedIn");
            var totalRooms = await _context.Rooms.CountAsync();
            var availableRooms = await _context.Rooms.CountAsync(r => r.Status == "Available");
            var occupiedRooms = await _context.Rooms.CountAsync(r => r.Status == "Occupied");
            var totalRevenue = await _context.Payments.SumAsync(p => (decimal?)p.Amount) ?? 0;
            var occupancyRate = totalRooms > 0
                ? Math.Round((double)occupiedRooms / totalRooms * 100, 1)
                : 0;

            return new
            {
                TotalBookings = totalBookings,
                ActiveBookings = activeBookings,
                TodayArrivals = todayArrivals,
                TodayDepartures = todayDepartures,
                AvailableRooms = availableRooms,
                TotalRooms = totalRooms,
                TotalRevenue = totalRevenue,
                OccupancyRate = occupancyRate
            };
        }
    }
}