// Author: Abdulla Mumin Mohamed | S2401551
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent) },
  { path: 'home', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'rooms', loadComponent: () => import('./pages/rooms/rooms.component').then(m => m.RoomsComponent) },
  { path: 'booking/:roomId', canActivate: [authGuard], loadComponent: () => import('./pages/booking/booking.component').then(m => m.BookingComponent) },
  { path: 'my-bookings', canActivate: [authGuard], loadComponent: () => import('./pages/my-bookings/my-bookings.component').then(m => m.MyBookingsComponent) },
  { path: 'profile', canActivate: [authGuard], loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent) },
  { path: 'staff', canActivate: [authGuard], data: { role: 'Staff' }, loadComponent: () => import('./pages/staff-dashboard/staff-dashboard.component').then(m => m.StaffDashboardComponent) },
  { path: 'manager', canActivate: [authGuard], data: { role: 'Manager' }, loadComponent: () => import('./pages/manager-dashboard/manager-dashboard.component').then(m => m.ManagerDashboardComponent) },
  { path: 'admin', canActivate: [authGuard], data: { role: 'Admin' }, loadComponent: () => import('./pages/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
  { path: '**', redirectTo: '/home' }
];
