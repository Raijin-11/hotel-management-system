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
                    new Room { HotelId = london, RoomNumber = "103", RoomType = "Standard Double",  Capacity = 2, PricePerNightOffPeak = 120, PricePerNightPeak = 180, Status = "Cleaning",  Description = "Standard room currently being serviced." },
                    new Room { HotelId = london, RoomNumber = "203", RoomType = "Deluxe King",      Capacity = 2, PricePerNightOffPeak = 180, PricePerNightPeak = 250, Status = "Occupied",  Description = "Deluxe room currently occupied." },
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
        }
    }
}