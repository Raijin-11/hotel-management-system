// Author: Abdulla Mumin Mohamed | S2401551
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { AuditLog } from '../../models/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-content">
      <div class="page-header">
        <h1>Admin Dashboard</h1>
        <p>System audit logs and user management</p>
      </div>

      <div class="tabs">
        <button class="tab" [class.active]="activeTab === 'audit'" (click)="activeTab = 'audit'">
          Audit Logs
        </button>
      </div>

      <div *ngIf="activeTab === 'audit'">
        <div class="alert alert-error" *ngIf="error">{{ error }}</div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Action</th>
                <th>User</th>
                <th>Details</th>
                <th>IP Address</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let log of auditLogs">
                <td><span class="font-mono">{{ log.id }}</span></td>
                <td>
                  <span class="badge" [ngClass]="getActionClass(log.action)">{{ log.action }}</span>
                </td>
                <td>{{ log.userEmail || 'System' }}</td>
                <td class="details-cell">{{ log.details }}</td>
                <td><span class="font-mono ip">{{ log.ipAddress }}</span></td>
                <td>{{ log.timestamp | date:'dd MMM yyyy HH:mm' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="empty-state" *ngIf="!loading && auditLogs.length === 0">
          <h3>No audit logs</h3>
          <p>System events will appear here</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tabs { display: flex; gap: 4px; margin-bottom: 20px; border-bottom: 2px solid var(--border); }
    .tab { padding: 10px 20px; background: none; border: none; font-family: var(--font-body); font-size: 14px; font-weight: 500; color: var(--text-secondary); cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -2px; }
    .tab.active { color: var(--accent); border-bottom-color: var(--accent); }
    .font-mono { font-family: var(--font-mono); }
    .ip { font-size: 12px; color: var(--text-secondary); }
    .details-cell { max-width: 300px; font-size: 13px; color: var(--text-secondary); }
  `]
})
export class AdminDashboardComponent implements OnInit {
  activeTab = 'audit';
  auditLogs: AuditLog[] = [];
  loading = false;
  error = '';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadAuditLogs();
  }

  loadAuditLogs() {
    this.loading = true;
    this.apiService.getAuditLogs().subscribe({
      next: (logs) => { this.auditLogs = logs; this.loading = false; },
      error: () => { this.error = 'Failed to load audit logs.'; this.loading = false; }
    });
  }

  getActionClass(action: string): string {
    const map: any = {
      'Login': 'badge-success', 'Register': 'badge-info',
      'Booking': 'badge-info', 'Cancellation': 'badge-warning',
      'CheckIn': 'badge-success', 'CheckOut': 'badge-neutral',
      'Payment': 'badge-success', 'FailedLogin': 'badge-error',
      'AccountLocked': 'badge-error'
    };
    return map[action] || 'badge-neutral';
  }
}
