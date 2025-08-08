import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  private readonly authService = inject(AuthService);

  private readonly apiUrl = 'http://localhost:3030/data/bookings';

  private authHeaders(): HttpHeaders | undefined {
    const token = this.authService.token();
    return token ? new HttpHeaders({ 'X-Authorization': token }) : undefined;
  }

  bookTable(booking: Booking): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, booking, {
      headers: this.authHeaders(),
    });
  }

  getMyBookings(userId: string): Observable<Booking[]> {
    const where = encodeURIComponent(`_ownerId="${userId}"`);
    const url = `${this.apiUrl}?where=${where}`;

    return this.http.get<Booking[]>(url, {
      headers: this.authHeaders(),
    });
  }

  deleteBooking(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.authHeaders(),
    });
  }
}
