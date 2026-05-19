// Author: Abdulla Mumin Mohamed | S2401551
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Booking, Room, DashboardStats } from '../../models/models';

@Component({
  selector: 'app-staff-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-content">
      <div class="page-header">
        <h1>Staff Dashboard</h1>
        <p>Manage check-ins, check-outs and room status</p>
      </div>

      <!-- Stats -->
      <div class="grid-4" style="margin-bottom:28px" *ngIf="stats">
        <div class="stat-card">
          <div class="stat-label">Today's Arrivals</div>
          <div class="stat-value">{{ stats.todayArrivals }}</div>
          <div class="stat-sub">Expected check-ins</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Today's Departures</div>
          <div class="stat-value">{{ stats.todayDepartures }}</div>
          <div class="stat-sub">Expected check-outs</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Available Rooms</div>
          <div class="stat-value">{{ stats.availableRooms }}</div>
          <div class="stat-sub">of {{ stats.totalRooms }} total</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Active Bookings</div>
          <div class="stat-value">{{ stats.activeBookings }}</div>
          <div class="stat-sub">Currently checked in</div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button class="tab" [class.active]="activeTab === 'arrivals'" (click)="activeTab = 'arrivals'">
          Today's Arrivals ({{ arrivals.length }})
        </button>
        <button class="tab" [class.active]="activeTab === 'departures'" (click)="activeTab = 'departures'">
          Today's Departures ({{ departures.length }})
        </button>
        <button class="tab" [class.active]="activeTab === 'all'" (click)="activeTab = 'all'">
          All Bookings
        </button>
        <button class="tab" [class.active]="activeTab === 'rooms'" (click)="activeTab = 'rooms'">
          Room Status
        </button>
      </div>

      <!-- Arrivals Tab -->
      <div *ngIf="activeTab === 'arrivals'">
        <div class="alert alert-success" *ngIf="actionSuccess">{{ actionSuccess }}</div>
        <div class="alert alert-error" *ngIf="actionError">{{ actionError }}</div>
        <div class="empty-state" *ngIf="arrivals.length === 0">
          <h3>No arrivals today</h3>
          <p>No guests expected today</p>
        </div>
        <div class="table-container" *ngIf="arrivals.length > 0">
          <table>
            <thead>
              <tr>
                <th>Booking #</th>
                <th>Guest</th>
                <th>Room</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Guests</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let b of arrivals">
                <td><span class="font-mono">#{{ b.id }}</span></td>
                <td>{{ b.guestName || 'Guest' }}</td>
                <td>Room {{ b.roomNumber }} — {{ b.roomType }}</td>
                <td>{{ b.checkInDate | date:'dd MMM' }}</td>
                <td>{{ b.checkOutDate | date:'dd MMM' }}</td>
                <td>{{ b.numberOfGuests }}</td>
                <td><span class="badge" [ngClass]="getStatusClass(b.status)">{{ b.status }}</span></td>
                <td>
                  <button class="btn btn-success btn-sm" (click)="checkIn(b)"
                          *ngIf="b.status === 'Confirmed'" [disabled]="processing === b.id">
                    {{ processing === b.id ? '...' : 'Check In' }}
                  </button>
                  <span class="text-success" *ngIf="b.status === 'CheckedIn'">Checked In</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Departures Tab -->
      <div *ngIf="activeTab === 'departures'">
        <div class="alert alert-success" *ngIf="actionSuccess">{{ actionSuccess }}</div>
        <div class="alert alert-error" *ngIf="actionError">{{ actionError }}</div>
        <div class="empty-state" *ngIf="departures.length === 0">
          <h3>No departures today</h3>
          <p>No guests checking out today</p>
        </div>
        <div class="table-container" *ngIf="departures.length > 0">
          <table>
            <thead>
              <tr>
                <th>Booking #</th>
                <th>Guest</th>
                <th>Room</th>
                <th>Check-out</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let b of departures">
                <td><span class="font-mono">#{{ b.id }}</span></td>
                <td>{{ b.guestName || 'Guest' }}</td>
                <td>Room {{ b.roomNumber }}</td>
                <td>{{ b.checkOutDate | date:'dd MMM' }}</td>
                <td class="accent">£{{ b.totalPrice }}</td>
                <td><span class="badge" [ngClass]="getStatusClass(b.status)">{{ b.status }}</span></td>
                <td>
                  <button class="btn btn-primary btn-sm" (click)="checkOut(b)"
                          *ngIf="b.status === 'CheckedIn'" [disabled]="processing === b.id">
                    {{ processing === b.id ? '...' : 'Check Out' }}
                  </button>
                  <span class="text-muted" *ngIf="b.status === 'CheckedOut'">Done</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- All Bookings Tab -->
      <div *ngIf="activeTab === 'all'">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Booking #</th>
                <th>Guest</th>
                <th>Room</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let b of allBookings">
                <td><span class="font-mono">#{{ b.id }}</span></td>
                <td>{{ b.guestName || 'Guest' }}</td>
                <td>Room {{ b.roomNumber }}</td>
                <td>{{ b.checkInDate | date:'dd MMM yyyy' }}</td>
                <td>{{ b.checkOutDate | date:'dd MMM yyyy' }}</td>
                <td class="accent">£{{ b.totalPrice }}</td>
                <td><span class="badge" [ngClass]="getStatusClass(b.status)">{{ b.status }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Rooms Tab -->
      <div *ngIf="activeTab === 'rooms'">
        <div class="alert alert-success" *ngIf="actionSuccess">{{ actionSuccess }}</div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Room</th>
                <th>Type</th>
                <th>Capacity</th>
                <th>Off-Peak Price</th>
                <th>Current Status</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let room of rooms">
                <td>Room {{ room.roomNumber }}</td>
                <td>{{ room.roomType }}</td>
                <td>{{ room.capacity }} guests</td>
                <td>£{{ room.pricePerNightOffPeak }}</td>
                <td><span class="badge" [ngClass]="getRoomStatusClass(room.status)">{{ room.status }}</span></td>
                <td>
                  <select class="form-control" style="width:140px;padding:6px 10px;font-size:13px"
                          [(ngModel)]="room.status" (change)="updateRoomStatus(room)">
                    <option>Available</option>
                    <option>Cleaning</option>
                    <option>OutOfService</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tabs { display: flex; gap: 4px; margin-bottom: 20px; border-bottom: 2px solid var(--border); padding-bottom: 0; }
    .tab {
      padding: 10px 20px;
      background: none;
      border: none;
      font-family: var(--font-body);
      font-size: 14px;
      font-weight: 500;
      color: var(--text-secondary);
      cursor: pointer;
      border-bottom: 2px solid transparent;
      margin-bottom: -2px;
      transition: all 0.2s;
    }
    .tab.active { color: var(--accent); border-bottom-color: var(--accent); }
    .tab:hover { color: var(--primary); }
    .font-mono { font-family: var(--font-mono); color: var(--accent); }
    .accent { color: var(--accent); font-weight: 600; }
    .text-success { color: var(--success); font-size: 13px; }
    .text-muted { color: var(--text-secondary); font-size: 13px; }
    .btn-success { background: var(--success); color: white; }
    .btn-success:hover { background: #15803D; }
  `]
})
export class StaffDashboardComponent implements OnInit {
  activeTab = 'arrivals';
  arrivals: Booking[] = [];
  departures: Booking[] = [];
  allBookings: Booking[] = [];
  rooms: Room[] = [];
  stats: DashboardStats | null = null;
  processing: number | null = null;
  actionSuccess = '';
  actionError = '';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.apiService.getDashboardStats().subscribe(s => this.stats = s);
    this.apiService.getTodayArrivals().subscribe(a => this.arrivals = a);
    this.apiService.getTodayDepartures().subscribe(d => this.departures = d);
    this.apiService.getAllBookings().subscribe(b => this.allBookings = b);
    this.apiService.getAllRooms().subscribe(r => this.rooms = r);
  }

  checkIn(booking: Booking) {
    this.processing = booking.id;
    this.actionSuccess = '';
    this.actionError = '';
    this.apiService.checkIn(booking.id).subscribe({
      next: () => {
        this.processing = null;
        this.actionSuccess = `Guest checked in to Room ${booking.roomNumber} successfully.`;
        this.loadData();
      },
      error: (err) => {
        this.processing = null;
        this.actionError = err.error?.message || 'Check-in failed.';
      }
    });
  }

  checkOut(booking: Booking) {
    this.processing = booking.id;
    this.actionSuccess = '';
    this.actionError = '';
    this.apiService.checkOut(booking.id).subscribe({
      next: () => {
        this.processing = null;
        this.actionSuccess = `Guest checked out from Room ${booking.roomNumber} successfully.`;
        this.loadData();
      },
      error: (err) => {
        this.processing = null;
        this.actionError = err.error?.message || 'Check-out failed.';
      }
    });
  }

  updateRoomStatus(room: Room) {
    this.apiService.updateRoomStatus(room.id, room.status).subscribe({
      next: () => this.actionSuccess = `Room ${room.roomNumber} status updated to ${room.status}.`,
      error: () => this.actionError = 'Failed to update room status.'
    });
  }

  getStatusClass(status: string): string {
    const map: any = { 'Confirmed': 'badge-info', 'CheckedIn': 'badge-success', 'CheckedOut': 'badge-neutral', 'Cancelled': 'badge-error', 'NoShow': 'badge-warning' };
    return map[status] || 'badge-neutral';
  }

  getRoomStatusClass(status: string): string {
    const map: any = { 'Available': 'badge-success', 'Occupied': 'badge-error', 'Cleaning': 'badge-warning', 'OutOfService': 'badge-neutral' };
    return map[status] || 'badge-neutral';
  }
}
