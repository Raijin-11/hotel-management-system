namespace HMS.API.Models
{
    public class Booking
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int RoomId { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public int NumberOfGuests { get; set; }
        public decimal TotalPrice { get; set; }
        public decimal CancellationFee { get; set; } = 0;
        public string Status { get; set; } = "Confirmed"; // Confirmed, CheckedIn, CheckedOut, Cancelled, NoShow
        public DateTime BookedAt { get; set; } = DateTime.UtcNow;
        public string SpecialRequests { get; set; } = string.Empty;

        // Navigation
        public User User { get; set; } = null!;
        public Room Room { get; set; } = null!;
        public ICollection<BookingService> BookingServices { get; set; } = new List<BookingService>();
        public Payment? Payment { get; set; }
    }
}