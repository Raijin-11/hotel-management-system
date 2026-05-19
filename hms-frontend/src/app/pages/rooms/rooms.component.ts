// Author: Abdulla Mumin Mohamed | S2401551
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Room } from '../../models/models';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-content">
      <div class="page-header">
        <h1>Available Rooms</h1>
        <p>Find your perfect room across our London and Paris hotels</p>
      </div>

      <!-- Search Filters -->
      <div class="search-card card">
        <div class="search-grid">
          <div class="form-group">
            <label>Hotel</label>
            <select class="form-control" [(ngModel)]="filters.hotelId">
              <option value="">All Hotels</option>
              <option value="1">The Grand London</option>
              <option value="2">Paris Élite</option>
            </select>
          </div>
          <div class="form-group">
            <label>Check-in Date</label>
            <input type="date" class="form-control" [(ngModel)]="filters.checkInDate" [min]="today">
          </div>
          <div class="form-group">
            <label>Check-out Date</label>
            <input type="date" class="form-control" [(ngModel)]="filters.checkOutDate" [min]="filters.checkInDate || today">
          </div>
          <div class="form-group">
            <label>Room Type</label>
            <select class="form-control" [(ngModel)]="filters.roomType">
              <option value="">All Types</option>
              <option>Standard Double</option>
              <option>Deluxe King</option>
              <option>Family Suite</option>
              <option>Penthouse</option>
            </select>
          </div>
          <div class="form-group">
            <label>Guests</label>
            <select class="form-control" [(ngModel)]="filters.capacity">
              <option value="">Any</option>
              <option value="1">1 Guest</option>
              <option value="2">2 Guests</option>
              <option value="3">3 Guests</option>
              <option value="4">4 Guests</option>
            </select>
          </div>
          <div class="form-group search-btn-group">
            <label>&nbsp;</label>
            <button class="btn btn-primary" (click)="searchRooms()" [disabled]="loading">
              <span class="spinner" *ngIf="loading"></span>
              {{ loading ? 'Searching...' : 'Search' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Alert -->
      <div class="alert alert-error" *ngIf="error">{{ error }}</div>

      <!-- Results -->
      <div class="results-header" *ngIf="rooms.length > 0">
        <span>{{ rooms.length }} room{{ rooms.length !== 1 ? 's' : '' }} found</span>
      </div>

      <div class="empty-state" *ngIf="!loading && rooms.length === 0 && searched">
        <h3>No rooms found</h3>
        <p>Try adjusting your search filters</p>
      </div>

      <div class="rooms-grid">
        <div class="room-card card" *ngFor="let room of rooms">
          <div class="room-image" [ngClass]="getRoomClass(room.roomType)">
            <div class="room-type-badge">{{ room.roomType }}</div>
            <div class="room-status-badge badge" [ngClass]="getStatusClass(room.status)">
              {{ room.status }}
            </div>
          </div>
          <div class="room-info">
            <div class="room-header">
              <div>
                <h3>Room {{ room.roomNumber }}</h3>
                <p class="room-hotel">{{ room.hotelName || 'HMS Hotel' }}</p>
              </div>
              <div class="room-price">
                <span class="price-amount">£{{ room.pricePerNightOffPeak }}</span>
                <span class="price-label">/night</span>
              </div>
            </div>
            <p class="room-desc">{{ room.description }}</p>
            <div class="room-details">
              <span class="room-detail">Up to {{ room.capacity }} guests</span>
              <span class="room-detail peak" *ngIf="room.pricePerNightPeak !== room.pricePerNightOffPeak">
                Peak: £{{ room.pricePerNightPeak }}/night
              </span>
            </div>
            <div class="room-actions">
              <a [routerLink]="['/booking', room.id]"
                 [queryParams]="getBookingParams()"
                 class="btn btn-accent"
                 *ngIf="isLoggedIn && room.status === 'Available'">
                Book Now
              </a>
              <a routerLink="/login" class="btn btn-outline"
                 *ngIf="!isLoggedIn && room.status === 'Available'">
                Login to Book
              </a>
              <span class="unavailable" *ngIf="room.status !== 'Available'">
                Currently {{ room.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .search-card { margin-bottom: 24px; }
    .search-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 16px; align-items: end; }
    .search-btn-group { display: flex; flex-direction: column; }
    .search-btn-group .btn { height: 44px; }
    .results-header { margin-bottom: 16px; color: var(--text-secondary); font-size: 14px; }
    .rooms-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
    .room-card { padding: 0; overflow: hidden; }
    .room-image {
      height: 160px;
      position: relative;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding: 12px;
    }
    .standard { background: linear-gradient(135deg, #1E293B, #334155); }
    .deluxe { background: linear-gradient(135deg, #7C3AED, #4F46E5); }
    .family { background: linear-gradient(135deg, #059669, #047857); }
    .penthouse { background: linear-gradient(135deg, #B45309, #92400E); }
    .room-type-badge {
      background: rgba(255,255,255,0.15);
      color: white;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }
    .room-status-badge { font-size: 11px; }
    .room-info { padding: 16px; }
    .room-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
    .room-header h3 { font-size: 18px; margin-bottom: 2px; }
    .room-hotel { color: var(--text-secondary); font-size: 12px; }
    .room-price { text-align: right; }
    .price-amount { font-family: var(--font-heading); font-size: 22px; color: var(--accent); font-weight: 600; }
    .price-label { font-size: 12px; color: var(--text-secondary); }
    .room-desc { color: var(--text-secondary); font-size: 13px; margin-bottom: 10px; line-height: 1.5; }
    .room-details { display: flex; gap: 12px; margin-bottom: 14px; }
    .room-detail { font-size: 12px; color: var(--text-secondary); }
    .room-actions { display: flex; gap: 8px; }
    .unavailable { font-size: 13px; color: var(--text-secondary); font-style: italic; }
    @media (max-width: 1024px) { .rooms-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 768px) {
      .search-grid { grid-template-columns: 1fr; }
      .rooms-grid { grid-template-columns: 1fr; }
    }
    .peak { color: var(--accent); font-weight: 500; }
  `]
})
export class RoomsComponent implements OnInit {
  rooms: Room[] = [];
  loading = false;
  error = '';
  searched = false;
  isLoggedIn = false;
  today = new Date().toISOString().split('T')[0];

  filters = {
    hotelId: '',
    checkInDate: '',
    checkOutDate: '',
    roomType: '',
    capacity: ''
  };

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.route.queryParams.subscribe(params => {
      if (params['hotelId']) this.filters.hotelId = params['hotelId'];
    });
    this.searchRooms();
  }

  searchRooms() {
    this.loading = true;
    this.error = '';
    this.searched = true;

    const params: any = {};
    if (this.filters.hotelId) params.hotelId = +this.filters.hotelId;
    if (this.filters.checkInDate) params.checkInDate = this.filters.checkInDate;
    if (this.filters.checkOutDate) params.checkOutDate = this.filters.checkOutDate;
    if (this.filters.roomType) params.roomType = this.filters.roomType;
    if (this.filters.capacity) params.capacity = +this.filters.capacity;

    this.apiService.searchRooms(params).subscribe({
      next: (rooms) => {
        this.rooms = rooms;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load rooms. Please try again.';
        this.loading = false;
      }
    });
  }

  getBookingParams() {
    const p: any = {};
    if (this.filters.checkInDate) p.checkIn = this.filters.checkInDate;
    if (this.filters.checkOutDate) p.checkOut = this.filters.checkOutDate;
    return p;
  }

  getRoomClass(type: string): string {
    if (type.includes('Standard')) return 'standard';
    if (type.includes('Deluxe')) return 'deluxe';
    if (type.includes('Family')) return 'family';
    if (type.includes('Penthouse')) return 'penthouse';
    return 'standard';
  }

  getStatusClass(status: string): string {
    const map: any = {
      'Available': 'badge-success',
      'Occupied': 'badge-error',
      'Cleaning': 'badge-warning',
      'OutOfService': 'badge-neutral'
    };
    return map[status] || 'badge-neutral';
  }
}
