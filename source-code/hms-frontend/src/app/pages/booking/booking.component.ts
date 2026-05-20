// Author: Abdulla Mumin Mohamed | S2401551
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Room } from '../../models/models';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-content">
      <div class="page-header">
        <a routerLink="/rooms" class="back-link">← Back to Rooms</a>
        <h1>Book Your Room</h1>
        <p>Complete your reservation</p>
      </div>

      <div class="booking-layout" *ngIf="room">
        <!-- Room Summary -->
        <div class="room-summary card">
          <div class="summary-header" [ngClass]="getRoomClass(room.roomType)">
            <div class="summary-type">{{ room.roomType }}</div>
          </div>
          <div class="summary-body">
            <h3>Room {{ room.roomNumber }}</h3>
            <p class="summary-desc">{{ room.description }}</p>
            <div class="summary-details">
              <div class="summary-detail">
                <span class="detail-label">Capacity</span>
                <span class="detail-value">Up to {{ room.capacity }} guests</span>
              </div>
              <div class="summary-detail">
                <span class="detail-label">Off-Peak Price</span>
                <span class="detail-value accent">£{{ room.pricePerNightOffPeak }}/night</span>
              </div>
              <div class="summary-detail">
                <span class="detail-label">Peak Price</span>
                <span class="detail-value accent">£{{ room.pricePerNightPeak }}/night</span>
              </div>
            </div>
            <div class="price-note">
              <span>Peak season: June, July, August &amp; December</span>
            </div>
          </div>

          <!-- Price Estimate -->
          <div class="price-estimate" *ngIf="totalNights > 0">
            <div class="estimate-row">
              <span>£{{ estimatedPrice }} × {{ totalNights }} night{{ totalNights !== 1 ? 's' : '' }}</span>
              <span>£{{ totalPrice }}</span>
            </div>
            <div class="estimate-total">
              <span>Total Estimate</span>
              <span class="total-amount">£{{ totalPrice }}</span>
            </div>
            <p class="estimate-note">* Final price calculated at checkout based on actual dates</p>
          </div>
        </div>

        <!-- Booking Form -->
        <div class="booking-form card">
          <h3>Reservation Details</h3>

          <div class="alert alert-error" *ngIf="error">{{ error }}</div>
          <div class="alert alert-success" *ngIf="success">{{ success }}</div>

          <form (ngSubmit)="onBook()" *ngIf="!success">
            <div class="form-row">
              <div class="form-group">
                <label>Check-in Date</label>
                <input type="date" class="form-control" [(ngModel)]="checkInDate"
                       name="checkIn" [min]="today" (change)="calculatePrice()" required>
              </div>
              <div class="form-group">
                <label>Check-out Date</label>
                <input type="date" class="form-control" [(ngModel)]="checkOutDate"
                       name="checkOut" [min]="checkInDate || today" (change)="calculatePrice()" required>
              </div>
            </div>

            <div class="form-group">
              <label>Number of Guests</label>
              <select class="form-control" [(ngModel)]="numberOfGuests" name="guests" required>
                <option *ngFor="let n of guestOptions" [value]="n">{{ n }} Guest{{ n > 1 ? 's' : '' }}</option>
              </select>
            </div>

            <div class="form-group">
              <label>Special Requests (Optional)</label>
              <textarea class="form-control" [(ngModel)]="specialRequests" name="requests"
                        rows="3" placeholder="Any special requests or preferences..."></textarea>
            </div>

            <div class="cancellation-info">
              <h4>Cancellation Policy</h4>
              <ul>
                <li class="policy-free">Free cancellation if cancelled 14+ days before check-in</li>
                <li class="policy-warn">50% of first night charged if cancelled 3-14 days before</li>
                <li class="policy-strict">100% of first night charged if cancelled within 72 hours</li>
                <li class="policy-strict">100% of total if no-show</li>
              </ul>
            </div>

            <button type="submit" class="btn btn-accent btn-lg full-width" [disabled]="loading">
              <span class="spinner" *ngIf="loading"></span>
              {{ loading ? 'Confirming...' : 'Confirm Booking' }}
            </button>
          </form>

          <div class="success-actions" *ngIf="success">
            <a routerLink="/my-bookings" class="btn btn-primary btn-lg full-width">View My Bookings</a>
            <a routerLink="/rooms" class="btn btn-outline full-width">Browse More Rooms</a>
          </div>
        </div>
      </div>

      <div class="loading-state" *ngIf="!room && !error">
        <p>Loading room details...</p>
      </div>
    </div>
  `,
  styles: [`
    .back-link { color: var(--text-secondary); font-size: 14px; display: block; margin-bottom: 12px; }
    .back-link:hover { color: var(--accent); }
    .booking-layout { display: grid; grid-template-columns: 380px 1fr; gap: 24px; }
    .room-summary { padding: 0; overflow: hidden; }
    .summary-header { height: 140px; }
    .standard { background: linear-gradient(135deg, #1E293B, #334155); }
    .deluxe { background: linear-gradient(135deg, #7C3AED, #4F46E5); }
    .family { background: linear-gradient(135deg, #059669, #047857); }
    .penthouse { background: linear-gradient(135deg, #B45309, #92400E); }
    .summary-type { padding: 12px; color: rgba(255,255,255,0.7); font-size: 13px; font-weight: 500; }
    .summary-body { padding: 20px; }
    .summary-body h3 { font-size: 20px; margin-bottom: 8px; }
    .summary-desc { color: var(--text-secondary); font-size: 13px; margin-bottom: 16px; }
    .summary-details { display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px; }
    .summary-detail { display: flex; justify-content: space-between; font-size: 14px; }
    .detail-label { color: var(--text-secondary); }
    .detail-value { font-weight: 500; }
    .detail-value.accent { color: var(--accent); }
    .price-note { background: #FEF3C7; padding: 10px 14px; border-radius: 8px; font-size: 12px; color: #B45309; }
    .price-estimate { padding: 16px 20px; border-top: 1px solid var(--border); background: #F8FAFC; }
    .estimate-row { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 10px; color: var(--text-secondary); }
    .estimate-total { display: flex; justify-content: space-between; font-size: 15px; font-weight: 600; padding-top: 10px; border-top: 1px solid var(--border); }
    .total-amount { color: var(--accent); font-family: var(--font-heading); font-size: 20px; }
    .estimate-note { font-size: 11px; color: var(--text-secondary); margin-top: 8px; }
    .booking-form h3 { font-size: 20px; margin-bottom: 20px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .cancellation-info { background: #F8FAFC; border-radius: 8px; padding: 16px; margin-bottom: 20px; }
    .cancellation-info h4 { font-size: 14px; margin-bottom: 10px; color: var(--primary); font-family: var(--font-body); }
    .cancellation-info ul { list-style: none; display: flex; flex-direction: column; gap: 6px; }
    .cancellation-info li { font-size: 13px; color: var(--text-secondary); }
    .full-width { width: 100%; justify-content: center; margin-bottom: 10px; }
    .success-actions { display: flex; flex-direction: column; gap: 10px; }
    @media (max-width: 768px) { .booking-layout { grid-template-columns: 1fr; } }
    .policy-free { color: var(--success) !important; font-weight: 500; }
    .policy-warn { color: var(--warning) !important; font-weight: 500; }
    .policy-strict { color: var(--error) !important; font-weight: 500; }
  `]
})
export class BookingComponent implements OnInit {
  room: Room | null = null;
  checkInDate = '';
  checkOutDate = '';
  numberOfGuests = 1;
  specialRequests = '';
  loading = false;
  error = '';
  success = '';
  today = new Date().toISOString().split('T')[0];
  totalNights = 0;
  estimatedPrice = 0;
  totalPrice = 0;
  guestOptions: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const roomId = +this.route.snapshot.paramMap.get('roomId')!;
    const params = this.route.snapshot.queryParams;
    if (params['checkIn']) this.checkInDate = params['checkIn'];
    if (params['checkOut']) this.checkOutDate = params['checkOut'];

    this.apiService.getRoomById(roomId).subscribe({
      next: (room) => {
        this.room = room;
        this.guestOptions = Array.from({length: room.capacity}, (_, i) => i + 1);
        this.calculatePrice();
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Room not found.';
        this.cdr.detectChanges();
      }
    });
  }

  calculatePrice() {
    if (!this.checkInDate || !this.checkOutDate || !this.room) return;
    const checkIn = new Date(this.checkInDate);
    const checkOut = new Date(this.checkOutDate);
    this.totalNights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    if (this.totalNights <= 0) { this.totalNights = 0; return; }
    let total = 0;
    const peakMonths = [6, 7, 8, 12];
    for (let d = new Date(checkIn); d < checkOut; d.setDate(d.getDate() + 1)) {
      const isPeak = peakMonths.includes(d.getMonth() + 1);
      total += isPeak ? this.room.pricePerNightPeak : this.room.pricePerNightOffPeak;
    }
    this.totalPrice = total;
    this.estimatedPrice = Math.round(total / this.totalNights);
  }

  getRoomClass(type: string): string {
    if (type.includes('Standard')) return 'standard';
    if (type.includes('Deluxe')) return 'deluxe';
    if (type.includes('Family')) return 'family';
    return 'penthouse';
  }

  onBook() {
    if (!this.checkInDate || !this.checkOutDate) {
      this.error = 'Please select check-in and check-out dates.';
      return;
    }
    this.loading = true;
    this.error = '';

    this.apiService.createBooking({
      roomId: this.room!.id,
      checkInDate: this.checkInDate,
      checkOutDate: this.checkOutDate,
      numberOfGuests: this.numberOfGuests,
      specialRequests: this.specialRequests
    }).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Booking confirmed! Your reservation has been created successfully.';
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Booking failed. Please try again.';
        this.cdr.detectChanges(); 
      }
    });
  }
}
