// Author: Ahmed Shaain Firaq | S2401269

namespace HMS.API.Models
{
    public class AncillaryService
    {
        public int Id { get; set; }
        public string ServiceName { get; set; } = string.Empty; // Airport Transfer, Breakfast, Spa, Late Checkout
        public decimal Fee { get; set; }
        public string Description { get; set; } = string.Empty;
        public bool IsPerPerson { get; set; } = false;
        public bool IsPerDay { get; set; } = false;

        // Navigation
        public ICollection<BookingService> BookingServices { get; set; } = new List<BookingService>();
    }
}