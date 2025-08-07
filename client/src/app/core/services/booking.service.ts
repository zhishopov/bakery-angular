import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  constructor(private http: HttpClient) {}

  bookTable(booking: Booking): Observable<void> {
    return this.http.post<void>(this.apiUrl, booking, {
      withCredentials: true,
    });
  }
}
