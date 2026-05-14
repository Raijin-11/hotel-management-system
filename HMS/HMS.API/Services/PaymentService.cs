using HMS.API.Data;
using HMS.API.Models;
using Microsoft.EntityFrameworkCore;

namespace HMS.API.Services
{
    public class PaymentService
    {
        private readonly AppDbContext _context;
        private readonly AuditService _auditService;

        public PaymentService(AppDbContext context, AuditService auditService)
        {
            _context = context;
            _auditService = auditService;
        }

        public async Task<Payment?> ProcessPaymentAsync(int bookingId, decimal amount, string paymentMethod, int staffId)
        {
            var booking = await _context.Bookings.FindAsync(bookingId);
            if (booking == null) return null;

            var payment = new Payment
            {
                BookingId = bookingId,
                Amount = amount,
                PaymentMethod = paymentMethod,
                Status = "Completed",
                PaidAt = DateTime.UtcNow
            };

            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();
            await _auditService.LogAsync(staffId, "Payment", $"Payment of £{amount} processed for booking {bookingId}");

            return payment;
        }

        public async Task<decimal> CalculateFinalBillAsync(int bookingId)
        {
            var booking = await _context.Bookings
                .Include(b => b.BookingServices)
                .ThenInclude(bs => bs.AncillaryService)
                .FirstOrDefaultAsync(b => b.Id == bookingId);

            if (booking == null) return 0;

            var serviceTotal = booking.BookingServices.Sum(bs => bs.TotalFee);
            return booking.TotalPrice + serviceTotal;
        }
    }
}