namespace HMS.API.Models
{
    public class BookingService
    {
        public int Id { get; set; }
        public int BookingId { get; set; }
        public int AncillaryServiceId { get; set; }
        public int Quantity { get; set; } = 1;
        public decimal TotalFee { get; set; }

        // Navigation
        public Booking Booking { get; set; } = null!;
        public AncillaryService AncillaryService { get; set; } = null!;
    }
}