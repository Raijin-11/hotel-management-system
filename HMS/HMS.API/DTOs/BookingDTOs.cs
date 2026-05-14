// Author: Ahmed Shaain Firaq | S2401269

namespace HMS.API.DTOs
{
    public class CreateBookingDTO
    {
        public int RoomId { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public int NumberOfGuests { get; set; }
        public string SpecialRequests { get; set; } = string.Empty;
    }

    public class BookingResponseDTO
    {
        public int Id { get; set; }
        public int RoomId { get; set; }
        public string RoomNumber { get; set; } = string.Empty;
        public string RoomType { get; set; } = string.Empty;
        public string HotelName { get; set; } = string.Empty;
        public string HotelLocation { get; set; } = string.Empty;
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public int NumberOfGuests { get; set; }
        public decimal TotalPrice { get; set; }
        public decimal CancellationFee { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime BookedAt { get; set; }
        public string SpecialRequests { get; set; } = string.Empty;
    }

    public class RoomSearchDTO
    {
        public int? HotelId { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public string? RoomType { get; set; }
        public int? Capacity { get; set; }
    }

    public class ProcessPaymentDTO
    {
        public int BookingId { get; set; }
        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
    }
}