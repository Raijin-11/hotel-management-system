// Author: Ahmed Shaain Firaq | S2401269

using HMS.API.Data;
using HMS.API.Models;
using Microsoft.EntityFrameworkCore;

namespace HMS.API.Services
{
    public class BookingService
    {
        private readonly AppDbContext _context;
        private readonly RoomService _roomService;
        private readonly AuditService _auditService;

        public BookingService(AppDbContext context, RoomService roomService, AuditService auditService)
        {
            _context = context;
            _roomService = roomService;
            _auditService = auditService;
        }

        public async Task<Booking?> CreateBookingAsync(int userId, int roomId, DateTime checkIn, DateTime checkOut, int guests, string specialRequests)
        {
            // Check room exists and is bookable
            var room = await _roomService.GetRoomByIdAsync(roomId);
            if (room == null || room.Status == "OutOfService")
                return null;

            var nights = (checkOut - checkIn).Days;
            if (nights <= 0) return null;

            // Use serializable transaction to prevent race-condition double-booking
            using var transaction = await _context.Database
                .BeginTransactionAsync(System.Data.IsolationLevel.Serializable);

            try
            {
                // Re-fetch room within the transaction so we see the latest state
                var roomCheck = await _context.Rooms.FindAsync(roomId);
                if (roomCheck == null || roomCheck.Status == "OutOfService")
                    return null;

                var hasOverlap = await _context.Bookings.AnyAsync(b =>
                    b.RoomId == roomId &&
                    b.Status != "Cancelled" &&
                    b.CheckInDate < checkOut &&
                    b.CheckOutDate > checkIn);

                if (hasOverlap) return null;

                var totalPrice = _roomService.CalculateTotalPrice(room, checkIn, checkOut);

                var booking = new Booking
                {
                    UserId = userId,
                    RoomId = roomId,
                    CheckInDate = checkIn,
                    CheckOutDate = checkOut,
                    NumberOfGuests = guests,
                    TotalPrice = totalPrice,
                    Status = "Confirmed",
                    SpecialRequests = specialRequests,
                    BookedAt = DateTime.UtcNow
                };

                _context.Bookings.Add(booking);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                await _auditService.LogAsync(userId, "Booking", $"Booking created for room {roomId}, check-in {checkIn:yyyy-MM-dd}");

                return booking;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public decimal CalculateCancellationFee(Booking booking)
        {
            var daysUntilCheckIn = (booking.CheckInDate - DateTime.UtcNow).Days;
            var nights = (booking.CheckOutDate - booking.CheckInDate).Days;
            if (nights <= 0) return 0;
            var pricePerNight = booking.TotalPrice / nights;

            // No-show or already checked in
            if (booking.Status == "NoShow")
                return booking.TotalPrice;

            // Less than 72 hours (3 days)
            if (daysUntilCheckIn < 3)
                return pricePerNight; // 100% of first night

            // 3-14 days before check-in
            if (daysUntilCheckIn <= 14)
                return pricePerNight * 0.5m; // 50% of first night

            // More than 14 days — free cancellation
            return 0;
        }

        public async Task<(bool success, string message, decimal fee)> CancelBookingAsync(int bookingId, int userId)
        {
            var booking = await _context.Bookings
                .Include(b => b.Room)
                .FirstOrDefaultAsync(b => b.Id == bookingId);

            if (booking == null)
                return (false, "Booking not found.", 0);

            if (booking.UserId != userId && userId != 0) // userId 0 = staff override
                return (false, "Unauthorized.", 0);

            if (booking.Status == "Cancelled")
                return (false, "Booking is already cancelled.", 0);

            var fee = CalculateCancellationFee(booking);
            booking.CancellationFee = fee;
            booking.Status = "Cancelled";

            await _context.SaveChangesAsync();
            await _auditService.LogAsync(userId, "Cancellation", $"Booking {bookingId} cancelled. Fee: £{fee}");

            return (true, $"Booking cancelled. Cancellation fee: £{fee}", fee);
        }

        public async Task<List<Booking>> GetUserBookingsAsync(int userId)
        {
            return await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.Room)
                .ThenInclude(r => r.Hotel)
                .Include(b => b.BookingServices)
                .ThenInclude(bs => bs.AncillaryService)
                .Include(b => b.Payment)
                .Where(b => b.UserId == userId)
                .OrderByDescending(b => b.BookedAt)
                .ToListAsync();
        }

        public async Task<Booking?> GetBookingByIdAsync(int bookingId)
        {
            return await _context.Bookings
                .Include(b => b.Room)
                .ThenInclude(r => r.Hotel)
                .Include(b => b.User)
                .Include(b => b.BookingServices)
                .ThenInclude(bs => bs.AncillaryService)
                .Include(b => b.Payment)
                .FirstOrDefaultAsync(b => b.Id == bookingId);
        }

        public async Task<bool> CheckInAsync(int bookingId, int staffId)
        {
            var booking = await _context.Bookings
                .Include(b => b.Room)
                .FirstOrDefaultAsync(b => b.Id == bookingId);

            if (booking == null || booking.Status != "Confirmed")
                return false;

            booking.Status = "CheckedIn";
            booking.Room.Status = "Occupied";
            await _context.SaveChangesAsync();
            await _auditService.LogAsync(staffId, "CheckIn", $"Guest checked in for booking {bookingId}");

            return true;
        }

        public async Task<bool> CheckOutAsync(int bookingId, int staffId)
        {
            var booking = await _context.Bookings
                .Include(b => b.Room)
                .FirstOrDefaultAsync(b => b.Id == bookingId);

            if (booking == null || booking.Status != "CheckedIn")
                return false;

            booking.Status = "CheckedOut";
            booking.Room.Status = "Cleaning";
            await _context.SaveChangesAsync();
            await _auditService.LogAsync(staffId, "CheckOut", $"Guest checked out for booking {bookingId}");

            return true;
        }

        public async Task<List<Booking>> GetAllBookingsAsync()
        {
            return await _context.Bookings
                .Include(b => b.Room)
                .ThenInclude(r => r.Hotel)
                .Include(b => b.User)
                .Include(b => b.Payment)
                .OrderByDescending(b => b.BookedAt)
                .ToListAsync();
        }

        public async Task<List<Booking>> GetTodayArrivalsAsync()
        {
            var today = DateTime.UtcNow.Date;
            return await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.Room).ThenInclude(r => r.Hotel)
                .Where(b => b.CheckInDate.Date == today && b.Status == "Confirmed")
                .ToListAsync();
        }

        public async Task<List<Booking>> GetTodayDeparturesAsync()
        {
            var today = DateTime.UtcNow.Date;
            return await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.Room).ThenInclude(r => r.Hotel)
                .Where(b => b.CheckOutDate.Date == today && b.Status == "CheckedIn")
                .ToListAsync();
        }

        public async Task<List<Booking>> GetCurrentlyStayingAsync()
        {
            return await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.Room).ThenInclude(r => r.Hotel)
                .Where(b => b.Status == "CheckedIn")
                .ToListAsync();
        }
    }
}