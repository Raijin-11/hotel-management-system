// Author: Abdulla Mumin Mohamed | S2401551
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { AuthResponse } from '../../models/models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="navbar">
      <div class="navbar-brand">
        <a routerLink="/home" class="brand-link">
          <span class="brand-name">HMS</span>
        </a>
      </div>

      <div class="navbar-links" [class.open]="menuOpen">
        <a routerLink="/home" routerLinkActive="active" class="nav-link">Home</a>
        <a routerLink="/rooms" routerLinkActive="active" class="nav-link">Rooms</a>

        <ng-container *ngIf="currentUser">
          <a routerLink="/my-bookings" routerLinkActive="active" class="nav-link"
             *ngIf="currentUser.role === 'Guest'">My Bookings</a>
          <a routerLink="/staff" routerLinkActive="active" class="nav-link"
             *ngIf="isStaffOrAbove()">Staff Dashboard</a>
          <a routerLink="/manager" routerLinkActive="active" class="nav-link"
             *ngIf="isManagerOrAbove()">Reports</a>
          <a routerLink="/admin" routerLinkActive="active" class="nav-link"
             *ngIf="currentUser.role === 'Admin'">Admin</a>
        </ng-container>
      </div>

      <div class="navbar-actions">
        <ng-container *ngIf="!currentUser">
          <a routerLink="/login" class="btn btn-outline btn-sm">Login</a>
          <a routerLink="/register" class="btn btn-accent btn-sm">Register</a>
        </ng-container>

        <ng-container *ngIf="currentUser">
          <div class="user-menu" (click)="toggleUserMenu()">
            <div class="user-avatar">{{ currentUser.fullName[0] }}</div>
            <span class="user-name">{{ currentUser.fullName }}</span>
            <span class="user-role badge badge-neutral">{{ currentUser.role }}</span>

            <div class="dropdown" *ngIf="userMenuOpen">
              <a routerLink="/profile" class="dropdown-item">My Profile</a>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item danger" (click)="logout()">Logout</button>
            </div>
          </div>
        </ng-container>

        <button class="menu-toggle" (click)="toggleMenu()">☰</button>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 32px;
      height: 64px;
      background: var(--primary);
      box-shadow: 0 2px 12px rgba(0,0,0,0.15);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .brand-link {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
    }
    .brand-name {
      font-family: var(--font-heading);
      font-size: 20px;
      font-weight: 700;
      color: var(--accent);
      letter-spacing: 0.05em;
    }
    .navbar-links {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .nav-link {
      padding: 8px 14px;
      color: rgba(255,255,255,0.75);
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      border-radius: 6px;
      transition: all 0.2s ease;
    }
    .nav-link:hover, .nav-link.active {
      color: white;
      background: rgba(255,255,255,0.1);
    }
    .navbar-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .btn-outline {
      color: white;
      border-color: rgba(255,255,255,0.3);
    }
    .btn-outline:hover {
      background: rgba(255,255,255,0.1);
      border-color: white;
      color: white;
    }
    .user-menu {
      position: relative;
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      padding: 6px 12px;
      border-radius: 8px;
      transition: background 0.2s;
    }
    .user-menu:hover { background: rgba(255,255,255,0.1); }
    .user-avatar {
      width: 32px;
      height: 32px;
      background: var(--accent);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 14px;
      color: white;
    }
    .user-name { color: white; font-size: 14px; font-weight: 500; }
    .dropdown {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      background: white;
      border-radius: 10px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.15);
      min-width: 180px;
      overflow: hidden;
      border: 1px solid var(--border);
    }
    .dropdown-item {
      display: block;
      width: 100%;
      padding: 11px 16px;
      font-size: 14px;
      color: var(--text);
      text-decoration: none;
      background: none;
      border: none;
      cursor: pointer;
      font-family: var(--font-body);
      text-align: left;
      transition: background 0.15s;
    }
    .dropdown-item:hover { background: var(--background); }
    .dropdown-item.danger { color: var(--error); }
    .dropdown-divider { height: 1px; background: var(--border); }
    .menu-toggle {
      display: none;
      background: none;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
    }
    @media (max-width: 768px) {
      .navbar-links { display: none; }
      .navbar-links.open {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 64px;
        left: 0;
        right: 0;
        background: var(--primary);
        padding: 16px;
      }
      .menu-toggle { display: block; }
    }
  `]
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentUser: AuthResponse | null = null;
  menuOpen = false;
  userMenuOpen = false;
  private authSub: Subscription = Subscription.EMPTY;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authSub = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }

  isStaffOrAbove(): boolean {
    return this.authService.hasRole('Staff');
  }

  isManagerOrAbove(): boolean {
    return this.authService.hasRole('Manager');
  }

  toggleMenu() { this.menuOpen = !this.menuOpen; }
  toggleUserMenu() { this.userMenuOpen = !this.userMenuOpen; }

  logout() {
    this.authService.logout();
    this.userMenuOpen = false;
  }
}