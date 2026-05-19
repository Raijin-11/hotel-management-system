// Author: Abdulla Mumin Mohamed | S2401551
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room, Booking, CreateBookingRequest, DashboardStats, AuditLog, Hotel, AncillaryService, RoomSearchParams } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'https://localhost:7172/api';

  constructor(private http: HttpClient) {}

  // Hotels
  getHotels(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(`${this.baseUrl}/Room/hotels`);
  }

  // Rooms
  searchRooms(params: RoomSearchParams): Observable<Room[]> {
    let httpParams = new HttpParams();
    if (params.hotelId) httpParams = httpParams.set('hotelId', params.hotelId);
    if (params.checkInDate) httpParams = httpParams.set('checkInDate', params.checkInDate);
    if (params.checkOutDate) httpParams = httpParams.set('checkOutDate', params.checkOutDate);
    if (params.roomType) httpParams = httpParams.set('roomType', params.roomType);
    if (params.capacity) httpParams = httpParams.set('capacity', params.capacity);
    return this.http.get<Room[]>(`${this.baseUrl}/Room/search`, { params: httpParams });
  }

  getAllRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.baseUrl}/Room`);
  }

  getRoomById(id: number): Observable<Room> {
    return this.http.get<Room>(`${this.baseUrl}/Room/${id}`);
  }

  updateRoomStatus(id: number, status: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/Room/${id}/status`, { status });
  }

  // Bookings
  createBooking(booking: CreateBookingRequest): Observable<Booking> {
    return this.http.post<Booking>(`${this.baseUrl}/Booking`, booking);
  }

  getMyBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.baseUrl}/Booking/my`);
  }

  getAllBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.baseUrl}/Booking`);
  }

  getBookingById(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.baseUrl}/Booking/${id}`);
  }

  cancelBooking(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/Booking/${id}`);
  }

  checkIn(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/Booking/${id}/checkin`, {});
  }

  checkOut(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/Booking/${id}/checkout`, {});
  }

  getTodayArrivals(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.baseUrl}/Booking/arrivals/today`);
  }

  getTodayDepartures(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.baseUrl}/Booking/departures/today`);
  }

  processPayment(bookingId: number, amount: number, paymentMethod: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/Booking/payment`, { bookingId, amount, paymentMethod });
  }

  // Reports
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/Report/dashboard`);
  }

  getOccupancyReport(from: string, to: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/Report/occupancy?from=${from}&to=${to}`);
  }

  getRevenueReport(from: string, to: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/Report/revenue?from=${from}&to=${to}`);
  }

  // Audit
  getAuditLogs(): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>(`${this.baseUrl}/Audit`);
  }

  // Ancillary Services
  getServices(): Observable<AncillaryService[]> {
    return this.http.get<AncillaryService[]>(`${this.baseUrl}/Room/services`);
  }
}
