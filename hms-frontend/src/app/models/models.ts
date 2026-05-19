// Author: Abdulla Mumin Mohamed | S2401551

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  fullName: string;
  email: string;
  role: string;
}

export interface Hotel {
  id: number;
  name: string;
  location: string;
  description: string;
  phoneNumber: string;
  email: string;
}

export interface Room {
  id: number;
  hotelId: number;
  hotelName?: string;
  roomNumber: string;
  roomType: string;
  capacity: number;
  pricePerNightOffPeak: number;
  pricePerNightPeak: number;
  status: string;
  description: string;
  imageUrl?: string;
}

export interface Booking {
  id: number;
  userId: number;
  guestName?: string;
  roomId: number;
  roomNumber?: string;
  roomType?: string;
  hotelName?: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalPrice: number;
  cancellationFee: number;
  status: string;
  specialRequests?: string;
  bookedAt?: string;
}

export interface CreateBookingRequest {
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  specialRequests?: string;
}

export interface Payment {
  id: number;
  bookingId: number;
  amount: number;
  paymentMethod: string;
  status: string;
  paidAt: string;
}

export interface AncillaryService {
  id: number;
  serviceName: string;
  fee: number;
  description: string;
  isPerPerson: boolean;
  isPerDay: boolean;
}

export interface DashboardStats {
  totalBookings: number;
  activeBookings: number;
  availableRooms: number;
  totalRooms: number;
  todayArrivals: number;
  todayDepartures: number;
  totalRevenue: number;
  occupancyRate: number;
}

export interface AuditLog {
userName: string;
  id: number;
  userId?: number;
  userEmail?: string;
  action: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface RoomSearchParams {
  hotelId?: number;
  checkInDate?: string;
  checkOutDate?: string;
  roomType?: string;
  capacity?: number;
}
