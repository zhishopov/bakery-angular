import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

export interface Booking {
  _id?: string;
  name: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  _ownerId?: string;
}

@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly apiUrl = 'http://localhost:3030/data/bookings';

  private headersForWrite() {
    return this.auth.isAdmin
      ? this.auth.getAdminHeaders()
      : this.auth.getAuthHeaders();
  }

  bookTable(booking: Booking): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, booking, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  getMyBookings(userId: string): Observable<Booking[]> {
    const where = encodeURIComponent(`_ownerId="${userId}"`);
    return this.http.get<Booking[]>(`${this.apiUrl}?where=${where}`, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  getAllBookings(): Observable<Booking[]> {
    const headers = this.auth.isAdmin
      ? this.auth.getAdminHeaders()
      : this.auth.getAuthHeaders();
    return this.http.get<Booking[]>(this.apiUrl, { headers });
  }

  updateBooking(id: string, changes: Partial<Booking>): Observable<Booking> {
    return this.http.patch<Booking>(`${this.apiUrl}/${id}`, changes, {
      headers: this.headersForWrite(),
    });
  }

  deleteBooking(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.headersForWrite(),
    });
  }
}
