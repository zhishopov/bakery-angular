import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

interface Booking {
  name: string;
  email: string;
  date: string;
  time: string;
  guests: number;
}

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private readonly apiUrl = 'http://localhost:3030/data/bookings';
  private readonly authService = inject(AuthService);

  constructor(private http: HttpClient) {}

  bookTable(booking: Booking): Observable<void> {
    const token = this.authService.token();

    const headers = new HttpHeaders({
      'X-Authorization': token ?? '',
    });

    return this.http.post<void>(this.apiUrl, booking, { headers });
  }
}
