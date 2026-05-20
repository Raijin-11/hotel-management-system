// Author: Abdulla Mumin Mohamed | S2401551
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-left">
        <div class="auth-brand">
          <h1>HMS</h1>
          <p>Hotel Management System</p>
        </div>
        <div class="auth-features">
          <div class="feature-item">✦ Search & book premium rooms</div>
          <div class="feature-item">✦ Manage your reservations</div>
          <div class="feature-item">✦ Access exclusive services</div>
          <div class="feature-item">✦ View invoices & payments</div>
        </div>
      </div>

      <div class="auth-right">
        <div class="auth-card">
          <div class="auth-header">
            <h2>Create Account</h2>
            <p>Join HMS as a guest</p>
          </div>

          <div class="alert alert-error" *ngIf="error">{{ error }}</div>
          <div class="alert alert-success" *ngIf="success">{{ success }}</div>

          <form (ngSubmit)="onRegister()">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" class="form-control" [(ngModel)]="fullName"
                     name="fullName" placeholder="John Smith" required>
            </div>
            <div class="form-group">
              <label>Email Address</label>
              <input type="email" class="form-control" [(ngModel)]="email"
                     name="email" placeholder="you@example.com" required>
            </div>
            <div class="form-group">
              <label>Password</label>
              <input type="password" class="form-control" [(ngModel)]="password"
                     name="password" placeholder="Min 8 chars, include uppercase & special char" required>
            </div>

            <button type="submit" class="btn btn-accent btn-lg full-width" [disabled]="loading">
              <span class="spinner" *ngIf="loading"></span>
              {{ loading ? 'Creating account...' : 'Create Account' }}
            </button>
          </form>

          <div class="auth-footer">
            <p>Already have an account? <a routerLink="/login">Sign in</a></p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { min-height: 100vh; display: flex; }
    .auth-left {
      flex: 1;
      background: var(--primary);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 60px;
    }
    .auth-brand { color: white; }
    .brand-icon { font-size: 48px; }
    .auth-brand h1 { font-family: var(--font-heading); font-size: 48px; color: var(--accent); margin: 8px 0 4px; }
    .auth-brand p { color: rgba(255,255,255,0.6); font-size: 16px; }
    .auth-features { display: flex; flex-direction: column; gap: 16px; }
    .feature-item { color: rgba(255,255,255,0.8); font-size: 15px; }
    .auth-right { width: 480px; display: flex; align-items: center; justify-content: center; padding: 40px; background: var(--background); }
    .auth-card { width: 100%; }
    .auth-header { margin-bottom: 28px; }
    .auth-header h2 { font-size: 28px; margin-bottom: 6px; }
    .auth-header p { color: var(--text-secondary); }
    .full-width { width: 100%; justify-content: center; margin-top: 8px; }
    .auth-footer { text-align: center; margin-top: 20px; color: var(--text-secondary); font-size: 14px; }
    @media (max-width: 768px) { .auth-left { display: none; } .auth-right { width: 100%; } }
  `]
})
export class RegisterComponent {
  fullName = '';
  email = '';
  password = '';
  loading = false;
  error = '';
  success = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    if (!this.fullName || !this.email || !this.password) return;
    this.loading = true;
    this.error = '';

    this.authService.register(this.fullName, this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}
