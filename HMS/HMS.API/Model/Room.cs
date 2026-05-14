namespace HMS.API.Models
{
    public class Room
    {
        public int Id { get; set; }
        public int HotelId { get; set; }
        public string RoomNumber { get; set; } = string.Empty;
        public string RoomType { get; set; } = string.Empty; // Standard, Deluxe, Family Suite, Penthouse
        public int Capacity { get; set; }
        public decimal PricePerNightOffPeak { get; set; }
        public decimal PricePerNightPeak { get; set; }
        public string Status { get; set; } = "Available"; // Available, Occupied, Cleaning, OutOfService
        public string Description { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;

        // Navigation
        public Hotel Hotel { get; set; } = null!;
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }
}