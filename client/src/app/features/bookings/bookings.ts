import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService, Booking } from '../../core/services/booking.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.html',
  styleUrl: './bookings.css',
  imports: [CommonModule],
})
export class Bookings {
  private readonly bookingService = inject(BookingService);
  private readonly authService = inject(AuthService);

  readonly bookings = signal<Booking[]>([]);
  readonly loading = signal<boolean>(true);
  readonly error = signal<string | null>(null);

  constructor() {
    effect(() => {
      const user = this.authService.currentUser;
      const userId = user?.id;

      if (!userId) {
        this.loading.set(false);
        this.error.set('You must be logged in to view your bookings.');
        return;
      }

      this.loading.set(true);
      this.error.set(null);

      this.bookingService.getMyBookings(userId).subscribe({
        next: (data) => {
          this.bookings.set(data);
          this.loading.set(false);
        },
        error: (err) => {
          this.loading.set(false);
          const msg =
            err?.error?.message ||
            err?.error?.error?.message ||
            'Failed to load bookings.';
          this.error.set(msg);
        },
      });
    });
  }

  delete(id: string | undefined) {
    if (!id) return;
    if (!confirm('Delete this booking?')) return;

    this.bookingService.deleteBooking(id).subscribe({
      next: () => {
        this.bookings.set(this.bookings().filter((b) => b._id !== id));
      },
      error: (err) => {
        const msg =
          err?.error?.message ||
          err?.error?.error?.message ||
          'Failed to delete booking.';
        this.error.set(msg);
      },
    });
  }
}
