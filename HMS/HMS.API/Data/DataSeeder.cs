using HMS.API.Models;
using Microsoft.EntityFrameworkCore;

namespace HMS.API.Data
{
    public static class DataSeeder
    {
        public static async Task SeedAsync(AppDbContext context)
        {
            // ── Hotels ──────────────────────────────────────────────
            if (!await context.Hotels.AnyAsync())
            {
                var hotels = new List<Hotel>
                {
                    new Hotel { Name = "The Grand London", Location = "London, UK", Description = "A luxury hotel in the heart of London.", PhoneNumber = "+44 20 1234 5678", Email = "info@grandlondon.com" },
                    new Hotel { Name = "Paris Élite", Location = "Paris, France", Description = "Experience Parisian elegance and luxury.", PhoneNumber = "+33 1 2345 6789", Email = "info@pariselite.com" }
                };
                context.Hotels.AddRange(hotels);
                await context.SaveChangesAsync();

                // ── Rooms ────────────────────────────────────────────
                var london = hotels[0].Id;
                var paris = hotels[1].Id;
                var rooms = new List<Room>
                {
                    new Room { HotelId = london, RoomNumber = "101", RoomType = "Standard Double",  Capacity = 2, PricePerNightOffPeak = 120, PricePerNightPeak = 180, Status = "Available", Description = "Cosy standard room with city view." },
                    new Room { HotelId = london, RoomNumber = "102", RoomType = "Standard Double",  Capacity = 2, PricePerNightOffPeak = 120, PricePerNightPeak = 180, Status = "Available", Description = "Comfortable standard room." },
                    new Room { HotelId = london, RoomNumber = "201", RoomType = "Deluxe King",      Capacity = 2, PricePerNightOffPeak = 180, PricePerNightPeak = 250, Status = "Available", Description = "Spacious deluxe room with king bed." },
                    new Room { HotelId = london, RoomNumber = "202", RoomType = "Deluxe King",      Capacity = 2, PricePerNightOffPeak = 180, PricePerNightPeak = 250, Status = "Available", Description = "Deluxe room with panoramic view." },
                    new Room { HotelId = london, RoomNumber = "301", RoomType = "Family Suite",     Capacity = 4, PricePerNightOffPeak = 240, PricePerNightPeak = 320, Status = "Available", Description = "Perfect for families with two bedrooms." },
                    new Room { HotelId = london, RoomNumber = "302", RoomType = "Family Suite",     Capacity = 4, PricePerNightOffPeak = 240, PricePerNightPeak = 320, Status = "Available", Description = "Spacious family suite with lounge area." },
                    new Room { HotelId = london, RoomNumber = "401", RoomType = "Penthouse",        Capacity = 4, PricePerNightOffPeak = 500, PricePerNightPeak = 750, Status = "Available", Description = "The ultimate luxury penthouse suite." },
                    new Room { HotelId = london, RoomNumber = "103", RoomType = "Standard Double",  Capacity = 2, PricePerNightOffPeak = 120, PricePerNightPeak = 180, Status = "Available", Description = "Standard room near the garden." },
                    new Room { HotelId = london, RoomNumber = "203", RoomType = "Deluxe King",      Capacity = 2, PricePerNightOffPeak = 180, PricePerNightPeak = 250, Status = "Available", Description = "Deluxe room with premium amenities." },
                    new Room { HotelId = london, RoomNumber = "104", RoomType = "Standard Double",  Capacity = 2, PricePerNightOffPeak = 120, PricePerNightPeak = 180, Status = "Available", Description = "Standard room on ground floor." },
                    new Room { HotelId = paris,  RoomNumber = "101", RoomType = "Standard Double",  Capacity = 2, PricePerNightOffPeak = 120, PricePerNightPeak = 180, Status = "Available", Description = "Charming Parisian standard room." },
                    new Room { HotelId = paris,  RoomNumber = "102", RoomType = "Standard Double",  Capacity = 2, PricePerNightOffPeak = 120, PricePerNightPeak = 180, Status = "Available", Description = "Standard room with garden view." },
                    new Room { HotelId = paris,  RoomNumber = "201", RoomType = "Deluxe King",      Capacity = 2, PricePerNightOffPeak = 180, PricePerNightPeak = 250, Status = "Available", Description = "Elegant deluxe room with Eiffel Tower view." },
                    new Room { HotelId = paris,  RoomNumber = "202", RoomType = "Deluxe King",      Capacity = 2, PricePerNightOffPeak = 180, PricePerNightPeak = 250, Status = "Available", Description = "Deluxe room with balcony." },
                    new Room { HotelId = paris,  RoomNumber = "301", RoomType = "Family Suite",     Capacity = 4, PricePerNightOffPeak = 240, PricePerNightPeak = 320, Status = "Available", Description = "Luxurious family suite." },
                    new Room { HotelId = paris,  RoomNumber = "302", RoomType = "Family Suite",     Capacity = 4, PricePerNightOffPeak = 240, PricePerNightPeak = 320, Status = "Available", Description = "Family suite with separate living area." },
                    new Room { HotelId = paris,  RoomNumber = "401", RoomType = "Penthouse",        Capacity = 4, PricePerNightOffPeak = 500, PricePerNightPeak = 750, Status = "Available", Description = "Spectacular penthouse with city views." },
                    new Room { HotelId = paris,  RoomNumber = "103", RoomType = "Standard Double",  Capacity = 2, PricePerNightOffPeak = 120, PricePerNightPeak = 180, Status = "Available", Description = "Cosy standard room." },
                    new Room { HotelId = paris,  RoomNumber = "203", RoomType = "Deluxe King",      Capacity = 2, PricePerNightOffPeak = 180, PricePerNightPeak = 250, Status = "Available", Description = "Premium deluxe room." },
                    new Room { HotelId = paris,  RoomNumber = "104", RoomType = "Standard Double",  Capacity = 2, PricePerNightOffPeak = 120, PricePerNightPeak = 180, Status = "Available", Description = "Bright and airy standard room." },
                };
                context.Rooms.AddRange(rooms);
                await context.SaveChangesAsync();
            }

            // ── Ancillary Services ───────────────────────────────────
            if (!await context.AncillaryServices.AnyAsync())
            {
                context.AncillaryServices.AddRange(
                    new AncillaryService { ServiceName = "Airport Transfer", Fee = 50, Description = "One-way airport transfer service.", IsPerPerson = false, IsPerDay = false },
                    new AncillaryService { ServiceName = "Full English Breakfast", Fee = 20, Description = "Full English breakfast per person per day.", IsPerPerson = true, IsPerDay = true },
                    new AncillaryService { ServiceName = "Spa Access", Fee = 35, Description = "Full spa access per person per day.", IsPerPerson = true, IsPerDay = true },
                    new AncillaryService { ServiceName = "Late Check-out", Fee = 40, Description = "Late check-out until 2 PM.", IsPerPerson = false, IsPerDay = false }
                );
                await context.SaveChangesAsync();
            }

            // ── Users ────────────────────────────────────────────────
            if (!await context.Users.AnyAsync(u => u.Email == "admin@hms.com"))
            {
                context.Users.AddRange(
                    new User { FullName = "Admin User", Email = "admin@hms.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"), Role = "Admin" },
                    new User { FullName = "Hotel Manager", Email = "manager@hms.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Manager@123"), Role = "Manager" },
                    new User { FullName = "Front Desk Staff", Email = "staff@hms.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Staff@123"), Role = "Staff" },
                    new User { FullName = "John Guest", Email = "guest@hms.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Guest@123"), Role = "Guest" },
                    new User { FullName = "Jane Smith", Email = "jane@hms.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Guest@123"), Role = "Guest" }
                );
                await context.SaveChangesAsync();
            }

            // ── Demo Bookings ────────────────────────────────────────
            if (!await context.Bookings.AnyAsync())
            {
                var today = DateTime.UtcNow.Date;

                var john = await context.Users.FirstAsync(u => u.Email == "guest@hms.com");
                var jane = await context.Users.FirstAsync(u => u.Email == "jane@hms.com");

                var rooms = await context.Rooms.Include(r => r.Hotel).ToListAsync();

                // Helper to find a room by number and hotel name
                Room FindRoom(string number, string hotel) =>
                    rooms.First(r => r.RoomNumber == number && r.Hotel.Name == hotel);

                var london101 = FindRoom("101", "The Grand London");
                var london102 = FindRoom("102", "The Grand London");
                var london104 = FindRoom("104", "The Grand London");
                var london201 = FindRoom("201", "The Grand London");
                var london202 = FindRoom("202", "The Grand London");
                var london301 = FindRoom("301", "The Grand London");
                var london203 = FindRoom("203", "The Grand London");
                var paris101 = FindRoom("101", "Paris Élite");

                var bookings = new List<Booking>();

                // ─ Today's Arrivals (Confirmed, check-in today) ──
                bookings.Add(new Booking
                {
                    UserId = jane.Id,
                    RoomId = london102.Id,
                    CheckInDate = today,
                    CheckOutDate = today.AddDays(3),
                    NumberOfGuests = 2,
                    TotalPrice = 3 * 120,
                    Status = "Confirmed",
                    BookedAt = today.AddDays(-7),
                    SpecialRequests = "Extra pillows and a quiet room please"
                });

                bookings.Add(new Booking
                {
                    UserId = jane.Id,
                    RoomId = london201.Id,
                    CheckInDate = today,
                    CheckOutDate = today.AddDays(2),
                    NumberOfGuests = 2,
                    TotalPrice = 2 * 180,
                    Status = "Confirmed",
                    BookedAt = today.AddDays(-5),
                    SpecialRequests = ""
                });

                bookings.Add(new Booking
                {
                    UserId = john.Id,
                    RoomId = london203.Id,
                    CheckInDate = today,
                    CheckOutDate = today.AddDays(4),
                    NumberOfGuests = 2,
                    TotalPrice = 4 * 180,
                    Status = "Confirmed",
                    BookedAt = today.AddDays(-3),
                    SpecialRequests = "King bed preferred"
                });

                // ─ Currently Staying (CheckedIn) ────────────────
                bookings.Add(new Booking
                {
                    UserId = john.Id,
                    RoomId = london101.Id,
                    CheckInDate = today.AddDays(-2),
                    CheckOutDate = today.AddDays(1),
                    NumberOfGuests = 2,
                    TotalPrice = 3 * 120,
                    Status = "CheckedIn",
                    BookedAt = today.AddDays(-14),
                    SpecialRequests = ""
                });

                bookings.Add(new Booking
                {
                    UserId = john.Id,
                    RoomId = london301.Id,
                    CheckInDate = today.AddDays(-1),
                    CheckOutDate = today.AddDays(3),
                    NumberOfGuests = 3,
                    TotalPrice = 4 * 240,
                    Status = "CheckedIn",
                    BookedAt = today.AddDays(-10),
                    SpecialRequests = "Need a cot for the baby"
                });

                // ─ Today's Departures (CheckedIn, check-out today) ──
                bookings.Add(new Booking
                {
                    UserId = jane.Id,
                    RoomId = london104.Id,
                    CheckInDate = today.AddDays(-2),
                    CheckOutDate = today,
                    NumberOfGuests = 1,
                    TotalPrice = 2 * 120,
                    Status = "CheckedIn",
                    BookedAt = today.AddDays(-21),
                    SpecialRequests = ""
                });

                // ─ Checked Out / History ───────────────────────
                bookings.Add(new Booking
                {
                    UserId = john.Id,
                    RoomId = london202.Id,
                    CheckInDate = today.AddDays(-10),
                    CheckOutDate = today.AddDays(-8),
                    NumberOfGuests = 2,
                    TotalPrice = 2 * 180,
                    Status = "CheckedOut",
                    BookedAt = today.AddDays(-30),
                    SpecialRequests = ""
                });

                bookings.Add(new Booking
                {
                    UserId = jane.Id,
                    RoomId = paris101.Id,
                    CheckInDate = today.AddDays(-14),
                    CheckOutDate = today.AddDays(-10),
                    NumberOfGuests = 2,
                    TotalPrice = 4 * 120,
                    Status = "CheckedOut",
                    BookedAt = today.AddDays(-40),
                    SpecialRequests = "Loved the stay!"
                });

                context.Bookings.AddRange(bookings);
                await context.SaveChangesAsync();

                // ── Update room statuses to match bookings ───────────
                foreach (var room in rooms)
                    room.Status = "Available";

                var checkedInRoomIds = await context.Bookings
                    .Where(b => b.Status == "CheckedIn")
                    .Select(b => b.RoomId)
                    .ToListAsync();

                foreach (var room in rooms.Where(r => checkedInRoomIds.Contains(r.Id)))
                    room.Status = "Occupied";

                await context.SaveChangesAsync();
            }
        }
    }
}
