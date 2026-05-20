// Author: Ahmed Shaain Firaq | S2401269

namespace HMS.API.Models
{
    public class Payment
    {
        public int Id { get; set; }
        public int BookingId { get; set; }
        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; } = string.Empty; // Card, Cash
        public string Status { get; set; } = "Pending"; // Pending, Completed, Refunded
        public DateTime PaidAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public Booking Booking { get; set; } = null!;
    }
}