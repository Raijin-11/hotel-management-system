// Author: Abdulla Mumin Mohamed | S2401551
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="home-page">
      <!-- Hero -->
      <section class="hero">
        <div class="hero-content">
          <div class="hero-badge">Premium Hospitality</div>
          <h1 class="hero-title">Experience Luxury<br>Like Never Before</h1>
          <p class="hero-subtitle">Discover and book exceptional rooms across our world-class hotels in London and Paris.</p>
          <div class="hero-actions">
            <a routerLink="/rooms" class="btn btn-accent btn-lg">Browse Rooms</a>
            <a routerLink="/register" class="btn btn-outline-white btn-lg" *ngIf="!isLoggedIn">Join Now</a>
          </div>
        </div>
        <div class="hero-stats">
          <div class="hero-stat">
            <span class="stat-num">2</span>
            <span class="stat-label">Hotels</span>
          </div>
          <div class="hero-stat">
            <span class="stat-num">20</span>
            <span class="stat-label">Rooms</span>
          </div>
          <div class="hero-stat">
            <span class="stat-num">4</span>
            <span class="stat-label">Room Types</span>
          </div>
        </div>
      </section>

      <!-- Hotels -->
      <section class="section">
        <div class="section-header">
          <h2>Our Hotels</h2>
          <p>Two iconic destinations, one exceptional experience</p>
        </div>
        <div class="hotels-grid">
          <div class="hotel-card">
            <div class="hotel-image london">
              <div class="hotel-badge">London</div>
            </div>
            <div class="hotel-info">
              <h3>The Grand London</h3>
              <p class="hotel-location">📍 London, UK</p>
              <p class="hotel-desc">A luxury hotel in the heart of London, offering unparalleled elegance and service.</p>
              <a routerLink="/rooms" class="btn btn-primary btn-sm" [queryParams]="{hotelId: 1}">View Rooms</a>
            </div>
          </div>
          <div class="hotel-card">
            <div class="hotel-image paris">
              <div class="hotel-badge">Paris</div>
            </div>
            <div class="hotel-info">
              <h3>Paris Élite</h3>
              <p class="hotel-location">📍 Paris, France</p>
              <p class="hotel-desc">Experience Parisian elegance and luxury in the most romantic city in the world.</p>
              <a routerLink="/rooms" class="btn btn-primary btn-sm" [queryParams]="{hotelId: 2}">View Rooms</a>
            </div>
          </div>
        </div>
      </section>

      <!-- Room Types -->
      <section class="section section-dark">
        <div class="section-header light">
          <h2>Room Types</h2>
          <p>From cosy standard rooms to spectacular penthouses</p>
        </div>
        <div class="room-types-grid">
          <div class="room-type-card" *ngFor="let type of roomTypes">
            <div class="room-type-icon">{{ type.label }}</div>
            <h3>{{ type.name }}</h3>
            <p>{{ type.desc }}</p>
            <div class="room-type-price">From £{{ type.price }}/night</div>
          </div>
        </div>
      </section>

      <!-- Services -->
      <section class="section">
        <div class="section-header">
          <h2>Ancillary Services</h2>
          <p>Enhance your stay with our premium add-ons</p>
        </div>
        <div class="services-grid">
          <div class="service-card" *ngFor="let service of services">
            <div class="service-icon">{{ service.label }}</div>
            <h4>{{ service.name }}</h4>
            <p>{{ service.desc }}</p>
            <div class="service-price">£{{ service.price }}</div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="cta-section" *ngIf="!isLoggedIn">
        <h2>Ready to Book?</h2>
        <p>Create your account and start your luxury journey today</p>
        <div class="cta-actions">
          <a routerLink="/register" class="btn btn-accent btn-lg">Get Started</a>
          <a routerLink="/login" class="btn btn-outline btn-lg">Sign In</a>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-page { }
    .hero {
      background: linear-gradient(135deg, var(--primary) 0%, #2D3F5F 100%);
      padding: 80px 32px 60px;
      position: relative;
      overflow: hidden;
    }
    .hero::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -10%;
      width: 600px;
      height: 600px;
      background: rgba(200,169,107,0.06);
      border-radius: 50%;
    }
    .hero-content { max-width: 700px; margin: 0 auto; text-align: center; position: relative; z-index: 1; }
    .hero-badge {
      display: inline-block;
      background: rgba(200,169,107,0.2);
      color: var(--accent);
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.06em;
      margin-bottom: 20px;
      border: 1px solid rgba(200,169,107,0.3);
    }
    .hero-title {
      font-family: var(--font-heading);
      font-size: 52px;
      color: white;
      line-height: 1.2;
      margin-bottom: 16px;
    }
    .hero-subtitle { color: rgba(255,255,255,0.7); font-size: 17px; margin-bottom: 32px; line-height: 1.7; }
    .hero-actions { display: flex; gap: 12px; justify-content: center; margin-bottom: 48px; }
    .btn-outline-white {
      background: transparent;
      color: white;
      border: 1.5px solid rgba(255,255,255,0.4);
      display: inline-flex;
      align-items: center;
      padding: 14px 28px;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.2s;
    }
    .btn-outline-white:hover { background: rgba(255,255,255,0.1); border-color: white; }
    .hero-stats {
      display: flex;
      justify-content: center;
      gap: 48px;
      position: relative;
      z-index: 1;
    }
    .hero-stat { text-align: center; }
    .stat-num { display: block; font-family: var(--font-heading); font-size: 36px; color: var(--accent); font-weight: 700; }
    .stat-label { color: rgba(255,255,255,0.6); font-size: 13px; text-transform: uppercase; letter-spacing: 0.06em; }
    .section { padding: 64px 32px; max-width: 1200px; margin: 0 auto; }
    .section-dark { background: var(--primary); max-width: 100%; padding: 64px 32px; }
    .section-dark .section-header h2 { color: white; }
    .section-dark .section-header p { color: rgba(255,255,255,0.6); }
    .section-header { text-align: center; margin-bottom: 40px; }
    .section-header h2 { font-size: 32px; margin-bottom: 8px; }
    .section-header p { color: var(--text-secondary); font-size: 16px; }
    .section-header.light h2 { color: white; }
    .hotels-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
    .hotel-card { background: white; border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow-md); }
    .hotel-image {
      height: 200px;
      position: relative;
      display: flex;
      align-items: flex-end;
      padding: 16px;
    }
    .london { background: linear-gradient(135deg, #1E293B 0%, #334155 100%); }
    .paris { background: linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%); }
    .hotel-badge {
      background: var(--accent);
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }
    .hotel-info { padding: 20px; }
    .hotel-info h3 { font-size: 20px; margin-bottom: 4px; }
    .hotel-location { color: var(--text-secondary); font-size: 13px; margin-bottom: 10px; }
    .hotel-desc { color: var(--text-secondary); font-size: 14px; margin-bottom: 16px; line-height: 1.6; }
    .room-types-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; max-width: 1200px; margin: 0 auto; }
    .room-type-card {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: var(--radius);
      padding: 24px;
      text-align: center;
    }
    .room-type-icon {
      display: inline-block;
      background: rgba(200,169,107,0.2);
      color: var(--accent);
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      margin-bottom: 12px;
    }
    .room-type-card h3 { color: white; font-size: 16px; margin-bottom: 8px; font-family: var(--font-body); }
    .room-type-card p { color: rgba(255,255,255,0.5); font-size: 13px; margin-bottom: 12px; }
    .room-type-price { color: var(--accent); font-size: 14px; font-weight: 600; }
    .services-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
    .service-card {
      background: white;
      border-radius: var(--radius);
      padding: 24px;
      text-align: center;
      border: 1px solid var(--border);
      box-shadow: var(--shadow-sm);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .service-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); }
    .service-icon {
      display: inline-block;
      background: var(--background);
      color: var(--accent);
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      margin-bottom: 12px;
      border: 1px solid var(--border);
    }
    .service-card h4 { font-size: 15px; margin-bottom: 8px; color: var(--primary); }
    .service-card p { color: var(--text-secondary); font-size: 13px; margin-bottom: 12px; }
    .service-price { color: var(--accent); font-weight: 600; font-size: 15px; }
    .cta-section {
      background: linear-gradient(135deg, var(--accent) 0%, #A8893B 100%);
      padding: 64px 32px;
      text-align: center;
    }
    .cta-section h2 { font-size: 36px; color: white; margin-bottom: 12px; }
    .cta-section p { color: rgba(255,255,255,0.8); font-size: 16px; margin-bottom: 32px; }
    .cta-actions { display: flex; gap: 12px; justify-content: center; }
    @media (max-width: 768px) {
      .hero-title { font-size: 32px; }
      .hotels-grid, .room-types-grid, .services-grid { grid-template-columns: 1fr; }
      .hero-stats { gap: 24px; }
    }
  `]
})
export class HomeComponent {
  isLoggedIn = false;

  roomTypes = [
    { label: 'Standard', name: 'Standard Double', desc: 'Comfortable rooms for a relaxing stay', price: 120 },
    { label: 'Deluxe', name: 'Deluxe King', desc: 'Spacious rooms with premium amenities', price: 180 },
    { label: 'Suite', name: 'Family Suite', desc: 'Perfect for families with extra space', price: 240 },
    { label: 'Premium', name: 'Penthouse', desc: 'The ultimate luxury experience', price: 500 },
  ];

  services = [
    { label: 'Transfer', name: 'Airport Transfer', desc: 'One-way airport transfer service', price: 50 },
    { label: 'Dining', name: 'Full Breakfast', desc: 'Full English breakfast per person', price: 20 },
    { label: 'Wellness', name: 'Spa Access', desc: 'Full spa access per person per day', price: 35 },
    { label: 'Flexibility', name: 'Late Check-out', desc: 'Late check-out until 2 PM', price: 40 },
  ];

  constructor(private authService: AuthService) {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }
}
