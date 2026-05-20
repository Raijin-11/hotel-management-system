// Author: Abdulla Mumin Mohamed | S2401551
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-left">
        <div class="auth-brand">
          <h1>HMS</h1>
          <p>Hotel Management System</p>
        </div>
        <div class="auth-quote">
          <blockquote>"Luxury is in each detail."</blockquote>
          <cite>— Hubert de Givenchy</cite>
        </div>
      </div>

      <div class="auth-right">
        <div class="auth-card">
          <div class="auth-header">
            <h2>Welcome back</h2>
            <p>Sign in to your account</p>
          </div>

          <div class="alert alert-error" *ngIf="error">{{ error }}</div>

          <form (ngSubmit)="onLogin()">
            <div class="form-group">
              <label>Email Address</label>
              <input type="email" class="form-control" [(ngModel)]="email"
                     name="email" placeholder="you@example.com" required>
            </div>

            <div class="form-group">
              <label>Password</label>
              <input type="password" class="form-control" [(ngModel)]="password"
                     name="password" placeholder="••••••••" required>
            </div>

            <button type="submit" class="btn btn-primary btn-lg full-width" [disabled]="loading">
              <span class="spinner" *ngIf="loading"></span>
              {{ loading ? 'Signing in...' : 'Sign In' }}
            </button>
          </form>

          <div class="auth-footer">
            <p>Don't have an account? <a routerLink="/register">Create one</a></p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
    }
    .auth-left {
      flex: 1;
      background: var(--primary);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 60px;
      position: relative;
      overflow: hidden;
    }
    .auth-left::before {
      content: '';
      position: absolute;
      top: -100px;
      right: -100px;
      width: 400px;
      height: 400px;
      background: rgba(200,169,107,0.08);
      border-radius: 50%;
    }
    .auth-brand { color: white; }
    .brand-icon { font-size: 48px; }
    .auth-brand h1 {
      font-family: var(--font-heading);
      font-size: 48px;
      color: var(--accent);
      margin: 8px 0 4px;
    }
    .auth-brand p { color: rgba(255,255,255,0.6); font-size: 16px; }
    .auth-quote blockquote {
      font-family: var(--font-heading);
      font-size: 22px;
      color: rgba(255,255,255,0.85);
      font-style: italic;
      margin-bottom: 12px;
    }
    .auth-quote cite { color: var(--accent); font-size: 14px; }
    .auth-right {
      width: 480px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
      background: var(--background);
    }
    .auth-card { width: 100%; }
    .auth-header { margin-bottom: 28px; }
    .auth-header h2 {
      font-size: 28px;
      margin-bottom: 6px;
    }
    .auth-header p { color: var(--text-secondary); }
    .full-width { width: 100%; justify-content: center; margin-top: 8px; }
    .auth-footer {
      text-align: center;
      margin-top: 20px;
      color: var(--text-secondary);
      font-size: 14px;
    }
    @media (max-width: 768px) {
      .auth-left { display: none; }
      .auth-right { width: 100%; }
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    if (!this.email || !this.password) return;
    this.loading = true;
    this.error = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (user) => {
        this.loading = false;
        if (user.role === 'Admin') this.router.navigate(['/admin']);
        else if (user.role === 'Manager') this.router.navigate(['/manager']);
        else if (user.role === 'Staff') this.router.navigate(['/staff']);
        else this.router.navigate(['/home']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Invalid email or password.';
      }
    });
  }
}
