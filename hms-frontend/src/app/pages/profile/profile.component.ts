// Author: Abdulla Mumin Mohamed | S2401551
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthResponse } from '../../models/models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-content">
      <div class="page-header">
        <h1>My Profile</h1>
        <p>Your account information</p>
      </div>

      <div class="profile-layout" *ngIf="user">
        <div class="profile-card card">
          <div class="profile-avatar">
            {{ user.fullName[0] }}
          </div>
          <h2 class="profile-name">{{ user.fullName }}</h2>
          <p class="profile-email">{{ user.email }}</p>
          <span class="badge badge-info profile-role">{{ user.role }}</span>
        </div>

        <div class="profile-details card">
          <h3>Account Details</h3>
          <div class="detail-row">
            <span class="detail-label">Full Name</span>
            <span class="detail-value">{{ user.fullName }}</span>
          </div>
          <div class="divider"></div>
          <div class="detail-row">
            <span class="detail-label">Email Address</span>
            <span class="detail-value">{{ user.email }}</span>
          </div>
          <div class="divider"></div>
          <div class="detail-row">
            <span class="detail-label">Role</span>
            <span class="detail-value">{{ user.role }}</span>
          </div>
          <div class="divider"></div>
          <div class="profile-actions">
            <a routerLink="/my-bookings" class="btn btn-primary" *ngIf="user.role === 'Guest'">
              View My Bookings
            </a>
            <button class="btn btn-danger" (click)="logout()">Logout</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-layout { display: grid; grid-template-columns: 300px 1fr; gap: 24px; }
    .profile-card { text-align: center; }
    .profile-avatar {
      width: 80px;
      height: 80px;
      background: var(--primary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-heading);
      font-size: 32px;
      color: var(--accent);
      margin: 0 auto 16px;
    }
    .profile-name { font-size: 22px; margin-bottom: 6px; }
    .profile-email { color: var(--text-secondary); font-size: 14px; margin-bottom: 12px; }
    .profile-role { margin: 0 auto; }
    .profile-details h3 { font-size: 18px; margin-bottom: 20px; }
    .detail-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; }
    .detail-label { font-size: 13px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; }
    .detail-value { font-size: 15px; }
    .profile-actions { display: flex; gap: 12px; padding-top: 20px; }
    @media (max-width: 768px) { .profile-layout { grid-template-columns: 1fr; } }
  `]
})
export class ProfileComponent implements OnInit {
  user: AuthResponse | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
  }

  logout() {
    this.authService.logout();
  }
}
