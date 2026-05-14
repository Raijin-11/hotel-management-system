using HMS.API.Data;
using HMS.API.Models;
using Microsoft.EntityFrameworkCore;

namespace HMS.API.Services
{
    public class RoomService
    {
        private readonly AppDbContext _context;

        public RoomService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Room>> SearchRoomsAsync(int? hotelId, DateTime checkIn, DateTime checkOut, string? roomType, int? capacity)
        {
            var query = _context.Rooms
                .Include(r => r.Hotel)
                .Where(r => r.Status == "Available");

            if (hotelId.HasValue)
                query = query.Where(r => r.HotelId == hotelId.Value);

            if (!string.IsNullOrEmpty(roomType))
                query = query.Where(r => r.RoomType == roomType);

            if (capacity.HasValue)
                query = query.Where(r => r.Capacity >= capacity.Value);

            // Exclude rooms already booked for the requested dates
            var bookedRoomIds = await _context.Bookings
                .Where(b => b.Status != "Cancelled" &&
                            b.CheckInDate < checkOut &&
                            b.CheckOutDate > checkIn)
                .Select(b => b.RoomId)
                .ToListAsync();

            query = query.Where(r => !bookedRoomIds.Contains(r.Id));

            return await query.ToListAsync();
        }

        public bool IsPeakSeason(DateTime date)
        {
            // Peak season: June-August and December
            return (date.Month >= 6 && date.Month <= 8) || date.Month == 12;
        }

        public decimal GetPricePerNight(Room room, DateTime checkIn)
        {
            return IsPeakSeason(checkIn) ? room.PricePerNightPeak : room.PricePerNightOffPeak;
        }

        public async Task<Room?> GetRoomByIdAsync(int id)
        {
            return await _context.Rooms
                .Include(r => r.Hotel)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<List<Room>> GetAllRoomsAsync()
        {
            return await _context.Rooms
                .Include(r => r.Hotel)
                .ToListAsync();
        }

        public async Task UpdateRoomStatusAsync(int roomId, string status)
        {
            var room = await _context.Rooms.FindAsync(roomId);
            if (room != null)
            {
                room.Status = status;
                await _context.SaveChangesAsync();
            }
        }
    }
}