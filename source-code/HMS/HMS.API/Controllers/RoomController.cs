// Author: Ahmed Shaain Firaq | S2401269

using HMS.API.DTOs;
using HMS.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HMS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoomController : ControllerBase
    {
        private readonly RoomService _roomService;

        public RoomController(RoomService roomService)
        {
            _roomService = roomService;
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] RoomSearchDTO dto)
        {
            var rooms = await _roomService.SearchRoomsAsync(
                dto.HotelId, dto.CheckInDate, dto.CheckOutDate,
                dto.RoomType, dto.Capacity);

            var result = rooms.Select(r => new
            {
                id = r.Id,
                hotelId = r.HotelId,
                roomNumber = r.RoomNumber,
                roomType = r.RoomType,
                capacity = r.Capacity,
                status = r.Status,
                description = r.Description,
                imageUrl = r.ImageUrl,
                hotelName = r.Hotel.Name,
                hotelLocation = r.Hotel.Location,
                pricePerNightOffPeak = r.PricePerNightOffPeak,
                pricePerNightPeak = r.PricePerNightPeak,
                pricePerNight = _roomService.GetPricePerNight(r, dto.CheckInDate),
                isPeakSeason = _roomService.IsPeakSeason(dto.CheckInDate)
            });

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var room = await _roomService.GetRoomByIdAsync(id);
            if (room == null) return NotFound();
            return Ok(room);
        }

        [HttpGet]
        [Authorize(Roles = "Staff,Manager,Admin")]
        public async Task<IActionResult> GetAll()
        {
            var rooms = await _roomService.GetAllRoomsAsync();
            return Ok(rooms);
        }

        [HttpPatch("{id}/status")]
        [Authorize(Roles = "Staff,Manager,Admin")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateRoomStatusDTO dto)
        {
            var validStatuses = new[] { "Available", "Occupied", "Cleaning", "OutOfService" };
            if (!validStatuses.Contains(dto.Status))
                return BadRequest(new { message = "Invalid status." });

            await _roomService.UpdateRoomStatusAsync(id, dto.Status);
            return Ok(new { message = "Room status updated." });
        }
    }
}