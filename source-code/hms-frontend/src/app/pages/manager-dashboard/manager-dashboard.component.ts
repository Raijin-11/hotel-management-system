// Author: Abdulla Mumin Mohamed | S2401551
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { DashboardStats } from '../../models/models';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-content">
      <div class="page-header">
        <h1>Manager Dashboard</h1>
        <p>Reports, analytics and revenue overview</p>
      </div>

      <!-- Stats Overview -->
      <div class="grid-4" style="margin-bottom:28px" *ngIf="stats">
        <div class="stat-card">
          <div class="stat-label">Total Revenue</div>
          <div class="stat-value">£{{ stats.totalRevenue | number }}</div>
          <div class="stat-sub">All time</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Occupancy Rate</div>
          <div class="stat-value">{{ stats.occupancyRate }}%</div>
          <div class="stat-sub">Current</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Total Bookings</div>
          <div class="stat-value">{{ stats.totalBookings }}</div>
          <div class="stat-sub">All time</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Active Bookings</div>
          <div class="stat-value">{{ stats.activeBookings }}</div>
          <div class="stat-sub">Currently checked in</div>
        </div>
      </div>

      <!-- Report Tabs -->
      <div class="tabs">
        <button class="tab" [class.active]="activeTab === 'occupancy'" (click)="activeTab = 'occupancy'">
          Occupancy Report
        </button>
        <button class="tab" [class.active]="activeTab === 'revenue'" (click)="activeTab = 'revenue'">
          Revenue Report
        </button>
      </div>

      <!-- Date Range Filter -->
      <div class="card date-filter">
        <div class="filter-row">
          <div class="form-group">
            <label>From Date</label>
            <input type="date" class="form-control" [(ngModel)]="fromDate">
          </div>
          <div class="form-group">
            <label>To Date</label>
            <input type="date" class="form-control" [(ngModel)]="toDate">
          </div>
          <div class="form-group" style="align-self:flex-end">
            <button class="btn btn-primary" (click)="loadReport()" [disabled]="loading">
              {{ loading ? 'Loading...' : 'Generate Report' }}
            </button>
          </div>
        </div>
      </div>

      <div class="alert alert-error" *ngIf="error">{{ error }}</div>

      <!-- Occupancy Report -->
      <div *ngIf="activeTab === 'occupancy' && occupancyData">
        <div class="card" style="margin-top:20px">
          <h3>Occupancy Report</h3>
          <p class="report-period">{{ fromDate | date:'dd MMM yyyy' }} — {{ toDate | date:'dd MMM yyyy' }}</p>
          <div class="report-stats grid-3" style="margin:20px 0">
            <div class="report-stat">
              <div class="rs-label">Total Room-Nights Available</div>
              <div class="rs-value">{{ occupancyData.totalRooms }}</div>
            </div>
            <div class="report-stat">
              <div class="rs-label">Occupied Room-Nights</div>
              <div class="rs-value">{{ occupancyData.occupiedBookings }}</div>
            </div>
            <div class="report-stat">
              <div class="rs-label">Occupancy Rate</div>
              <div class="rs-value accent">{{ occupancyData.occupancyRate }}%</div>
            </div>
          </div>
          <div class="table-container" *ngIf="occupancyData.bookings?.length > 0">
            <table>
              <thead>
                <tr>
                  <th>Booking #</th>
                  <th>Room</th>
                  <th>Hotel</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Nights</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let b of occupancyData.bookings">
                  <td><span class="font-mono">#{{ b.id }}</span></td>
                  <td>{{ b.roomNumber }}</td>
                  <td>{{ b.hotelName }}</td>
                  <td>{{ b.checkInDate | date:'dd MMM' }}</td>
                  <td>{{ b.checkOutDate | date:'dd MMM' }}</td>
                  <td>{{ b.nights }}</td>
                  <td><span class="badge badge-info">{{ b.status }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Revenue Report -->
      <div *ngIf="activeTab === 'revenue' && revenueData">
        <div class="card" style="margin-top:20px">
          <h3>Revenue Report</h3>
          <p class="report-period">{{ fromDate | date:'dd MMM yyyy' }} — {{ toDate | date:'dd MMM yyyy' }}</p>
          <div class="report-stats grid-3" style="margin:20px 0">
            <div class="report-stat">
              <div class="rs-label">Total Revenue</div>
              <div class="rs-value accent">£{{ revenueData.totalRevenue || 0 | number }}</div>
            </div>
            <div class="report-stat">
              <div class="rs-label">Total Bookings</div>
              <div class="rs-value">{{ revenueData.totalBookings || 0 }}</div>
            </div>
            <div class="report-stat">
              <div class="rs-label">Average per Booking</div>
              <div class="rs-value">£{{ revenueData.averageRevenue || 0 | number:'1.0-0' }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tabs { display: flex; gap: 4px; margin-bottom: 20px; border-bottom: 2px solid var(--border); }
    .tab { padding: 10px 20px; background: none; border: none; font-family: var(--font-body); font-size: 14px; font-weight: 500; color: var(--text-secondary); cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -2px; transition: all 0.2s; }
    .tab.active { color: var(--accent); border-bottom-color: var(--accent); }
    .date-filter { margin-bottom: 0; }
    .filter-row { display: flex; gap: 16px; align-items: flex-end; }
    .filter-row .form-group { flex: 1; }
    .report-period { color: var(--text-secondary); font-size: 13px; margin-top: 4px; }
    .report-stats { margin-top: 16px; }
    .report-stat { background: var(--background); border-radius: var(--radius-sm); padding: 16px; }
    .rs-label { font-size: 12px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 6px; }
    .rs-value { font-family: var(--font-heading); font-size: 24px; color: var(--primary); }
    .rs-value.accent { color: var(--accent); }
    .font-mono { font-family: var(--font-mono); color: var(--accent); }
    .accent { color: var(--accent); font-weight: 600; }
  `]
})
export class ManagerDashboardComponent implements OnInit {
  activeTab = 'occupancy';
  stats: DashboardStats | null = null;
  occupancyData: any = null;
  revenueData: any = null;
  loading = false;
  error = '';
  fromDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  toDate = new Date().toISOString().split('T')[0];

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.apiService.getDashboardStats().subscribe(s => { this.stats = s; this.cdr.detectChanges(); });
    this.loadReport();
  }

  loadReport() {
    this.loading = true;
    this.error = '';

    if (this.activeTab === 'occupancy') {
      this.apiService.getOccupancyReport(this.fromDate, this.toDate).subscribe({
        next: (data) => { this.occupancyData = data; this.loading = false; this.cdr.detectChanges(); },
        error: () => { this.error = 'Failed to load occupancy report.'; this.loading = false; this.cdr.detectChanges(); }
      });
    } else {
      this.apiService.getRevenueReport(this.fromDate, this.toDate).subscribe({
        next: (data) => { this.revenueData = data; this.loading = false; this.cdr.detectChanges(); },
        error: () => { this.error = 'Failed to load revenue report.'; this.loading = false; this.cdr.detectChanges(); }
      });
    }
  }
}
