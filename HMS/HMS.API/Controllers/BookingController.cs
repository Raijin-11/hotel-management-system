// Author: Ahmed Shaain Firaq | S2401269

using HMS.API.DTOs;
using HMS.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HMS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BookingController : ControllerBase
    {
        private readonly HMS.API.Services.BookingService _bookingService;
        private readonly PaymentService _paymentService;

        public BookingController(HMS.API.Services.BookingService bookingService, PaymentService paymentService)
        {
            _bookingService = bookingService;
            _paymentService = paymentService;
        }

        private int GetUserId() =>
            int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateBookingDTO dto)
        {
            var booking = await _bookingService.CreateBookingAsync(
                GetUserId(), dto.RoomId, dto.CheckInDate,
                dto.CheckOutDate, dto.NumberOfGuests, dto.SpecialRequests);

            if (booking == null)
                return BadRequest(new { message = "Room is not available for the selected dates." });

            return Ok(new { message = "Booking confirmed.", bookingId = booking.Id, totalPrice = booking.TotalPrice });
        }

        [HttpGet("my")]
        public async Task<IActionResult> GetMyBookings()
        {
            var bookings = await _bookingService.GetUserBookingsAsync(GetUserId());
            var result = bookings.Select(b => new BookingResponseDTO
            {
                Id = b.Id,
                RoomId = b.RoomId,
                RoomNumber = b.Room.RoomNumber,
                RoomType = b.Room.RoomType,
                HotelName = b.Room.Hotel.Name,
                HotelLocation = b.Room.Hotel.Location,
                CheckInDate = b.CheckInDate,
                CheckOutDate = b.CheckOutDate,
                NumberOfGuests = b.NumberOfGuests,
                TotalPrice = b.TotalPrice,
                CancellationFee = b.CancellationFee,
                Status = b.Status,
                BookedAt = b.BookedAt,
                SpecialRequests = b.SpecialRequests
            });
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var booking = await _bookingService.GetBookingByIdAsync(id);
            if (booking == null) return NotFound();
            return Ok(booking);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Cancel(int id)
        {
            var (success, message, fee) = await _bookingService.CancelBookingAsync(id, GetUserId());
            if (!success) return BadRequest(new { message });
            return Ok(new { message, cancellationFee = fee });
        }

        [HttpGet]
        [Authorize(Roles = "Staff,Manager,Admin")]
        public async Task<IActionResult> GetAll()
        {
            var bookings = await _bookingService.GetAllBookingsAsync();
            return Ok(bookings);
        }

        [HttpPost("{id}/checkin")]
        [Authorize(Roles = "Staff,Manager,Admin")]
        public async Task<IActionResult> CheckIn(int id)
        {
            var success = await _bookingService.CheckInAsync(id, GetUserId());
            if (!success) return BadRequest(new { message = "Check-in failed. Booking must be in Confirmed status." });
            return Ok(new { message = "Guest checked in successfully." });
        }

        [HttpPost("{id}/checkout")]
        [Authorize(Roles = "Staff,Manager,Admin")]
        public async Task<IActionResult> CheckOut(int id)
        {
            var success = await _bookingService.CheckOutAsync(id, GetUserId());
            if (!success) return BadRequest(new { message = "Check-out failed. Guest must be checked in." });
            return Ok(new { message = "Guest checked out successfully." });
        }

        [HttpGet("arrivals/today")]
        [Authorize(Roles = "Staff,Manager,Admin")]
        public async Task<IActionResult> TodayArrivals()
        {
            var arrivals = await _bookingService.GetTodayArrivalsAsync();
            return Ok(arrivals);
        }

        [HttpGet("departures/today")]
        [Authorize(Roles = "Staff,Manager,Admin")]
        public async Task<IActionResult> TodayDepartures()
        {
            var departures = await _bookingService.GetTodayDeparturesAsync();
            return Ok(departures);
        }

        [HttpPost("payment")]
        [Authorize(Roles = "Staff,Manager,Admin")]
        public async Task<IActionResult> ProcessPayment([FromBody] ProcessPaymentDTO dto)
        {
            var finalBill = await _paymentService.CalculateFinalBillAsync(dto.BookingId);
            var payment = await _paymentService.ProcessPaymentAsync(
                dto.BookingId, dto.Amount, dto.PaymentMethod, GetUserId());

            if (payment == null)
                return BadRequest(new { message = "Payment failed." });

            return Ok(new { message = "Payment processed.", paymentId = payment.Id, finalBill });
        }
    }
}