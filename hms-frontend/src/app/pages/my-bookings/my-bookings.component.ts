// Author: Abdulla Mumin Mohamed | S2401551
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Booking } from '../../models/models';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-content">
      <div class="page-header">
        <h1>My Bookings</h1>
        <p>View and manage your reservations</p>
      </div>

      <div class="alert alert-error" *ngIf="error">{{ error }}</div>

      <div class="empty-state" *ngIf="!loading && bookings.length === 0">
        <h3>No bookings yet</h3>
        <p>Browse our rooms and make your first reservation</p>
        <a routerLink="/rooms" class="btn btn-accent" style="margin-top:16px">Browse Rooms</a>
      </div>

      <div class="bookings-list" *ngIf="bookings.length > 0">
        <div class="booking-card card" *ngFor="let booking of bookings">
          <div class="booking-header">
            <div class="booking-id">
              <span class="id-label">Booking</span>
              <span class="id-value font-mono">#{{ booking.id }}</span>
            </div>
            <span class="badge" [ngClass]="getStatusClass(booking.status)">{{ booking.status }}</span>
          </div>

          <div class="booking-body">
            <div class="booking-info-grid">
              <div class="booking-info-item">
                <span class="info-label">Room</span>
                <span class="info-value">Room {{ booking.roomNumber }} — {{ booking.roomType }}</span>
              </div>
              <div class="booking-info-item">
                <span class="info-label">Hotel</span>
                <span class="info-value">{{ booking.hotelName }}</span>
              </div>
              <div class="booking-info-item">
                <span class="info-label">Check-in</span>
                <span class="info-value">{{ booking.checkInDate | date:'dd MMM yyyy' }}</span>
              </div>
              <div class="booking-info-item">
                <span class="info-label">Check-out</span>
                <span class="info-value">{{ booking.checkOutDate | date:'dd MMM yyyy' }}</span>
              </div>
              <div class="booking-info-item">
                <span class="info-label">Guests</span>
                <span class="info-value">{{ booking.numberOfGuests }}</span>
              </div>
              <div class="booking-info-item">
                <span class="info-label">Total</span>
                <span class="info-value accent">£{{ booking.totalPrice }}</span>
              </div>
            </div>

            <div class="cancellation-fee" *ngIf="booking.cancellationFee > 0">
              Cancellation fee: £{{ booking.cancellationFee }}
            </div>

            <div class="special-requests" *ngIf="booking.specialRequests">
              <span class="info-label">Special Requests:</span> {{ booking.specialRequests }}
            </div>
          </div>

          <div class="booking-footer">
            <span class="booked-at">Booked {{ booking.bookedAt | date:'dd MMM yyyy' }}</span>
            <button class="btn btn-danger btn-sm"
                    *ngIf="booking.status === 'Confirmed'"
                    (click)="cancelBooking(booking)"
                    [disabled]="cancelling === booking.id">
              {{ cancelling === booking.id ? 'Cancelling...' : 'Cancel Booking' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bookings-list { display: flex; flex-direction: column; gap: 16px; }
    .booking-card { padding: 0; overflow: hidden; }
    .booking-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 20px;
      background: var(--primary);
    }
    .booking-id { display: flex; align-items: center; gap: 8px; }
    .id-label { font-size: 12px; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 0.06em; }
    .id-value { font-family: var(--font-mono); color: var(--accent); font-size: 15px; font-weight: 500; }
    .font-mono { font-family: var(--font-mono); }
    .booking-body { padding: 20px; }
    .booking-info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 12px; }
    .booking-info-item { display: flex; flex-direction: column; gap: 3px; }
    .info-label { font-size: 11px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.06em; }
    .info-value { font-size: 14px; color: var(--text); }
    .info-value.accent { color: var(--accent); font-weight: 600; font-size: 16px; }
    .cancellation-fee { background: #FEF3C7; padding: 10px 14px; border-radius: 8px; font-size: 13px; color: #B45309; margin-top: 12px; }
    .special-requests { font-size: 13px; color: var(--text-secondary); margin-top: 10px; }
    .booking-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 20px;
      background: var(--background);
      border-top: 1px solid var(--border);
    }
    .booked-at { font-size: 12px; color: var(--text-secondary); }
    @media (max-width: 768px) { .booking-info-grid { grid-template-columns: repeat(2, 1fr); } }
  `]
})
export class MyBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  loading = false;
  error = '';
  cancelling: number | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.loading = true;
    this.apiService.getMyBookings().subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load bookings.';
        this.loading = false;
      }
    });
  }

  cancelBooking(booking: Booking) {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    this.cancelling = booking.id;

    this.apiService.cancelBooking(booking.id).subscribe({
      next: () => {
        this.cancelling = null;
        this.loadBookings();
      },
      error: (err) => {
        this.cancelling = null;
        this.error = err.error?.message || 'Failed to cancel booking.';
      }
    });
  }

  getStatusClass(status: string): string {
    const map: any = {
      'Confirmed': 'badge-info',
      'CheckedIn': 'badge-success',
      'CheckedOut': 'badge-neutral',
      'Cancelled': 'badge-error',
      'NoShow': 'badge-warning'
    };
    return map[status] || 'badge-neutral';
  }
}
