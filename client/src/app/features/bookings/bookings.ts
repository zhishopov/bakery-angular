import { Component, inject, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BookingService, Booking } from '../../core/services/booking.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.html',
  styleUrl: './bookings.css',
  imports: [ReactiveFormsModule, RouterModule],
})
export class Bookings {
  private readonly bookingService = inject(BookingService);
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  bookings = signal<Booking[]>([]);
  loading = signal<boolean>(false);
  serverError = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  editingId = signal<string | null>(null);
  editForm: FormGroup | null = null;
  actionLoadingId = signal<string | null>(null);

  ngOnInit(): void {
    this.loadBookings();
  }

  private loadBookings(): void {
    const userId = this.authService.currentUser?.id;
    if (!userId) return;
    this.loading.set(true);
    this.serverError.set(null);
    this.successMessage.set(null);

    this.bookingService.getMyBookings(userId).subscribe({
      next: (data) => {
        this.bookings.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        const msg =
          err?.error?.message || err?.message || 'Failed to load bookings.';
        this.serverError.set(msg);
        this.loading.set(false);
      },
    });
  }

  startEdit(booking: Booking): void {
    this.editingId.set(booking._id!);
    this.editForm = this.fb.group({
      name: [booking.name, [Validators.required, Validators.minLength(2)]],
      email: [booking.email, [Validators.required, Validators.email]],
      date: [booking.date, [Validators.required]],
      time: [booking.time, [Validators.required]],
      guests: [booking.guests, [Validators.required, Validators.min(1)]],
    });
    this.successMessage.set(null);
    this.serverError.set(null);
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.editForm = null;
  }

  saveEdit(): void {
    if (!this.editForm || this.editForm.invalid || !this.editingId()) return;

    const id = this.editingId()!;
    this.actionLoadingId.set(id);
    this.serverError.set(null);
    this.successMessage.set(null);

    this.bookingService.updateBooking(id, this.editForm.value).subscribe({
      next: (updated) => {
        this.bookings.set(
          this.bookings().map((b) => (b._id === id ? updated : b))
        );
        this.actionLoadingId.set(null);
        this.editForm = null;
        this.editingId.set(null);
        this.successMessage.set('Booking updated successfully.');
      },
      error: (err) => {
        const msg = err?.error?.message || err?.message || 'Update failed.';
        this.serverError.set(msg);
        this.actionLoadingId.set(null);
      },
    });
  }

  deleteBooking(id: string): void {
    this.actionLoadingId.set(id);
    this.serverError.set(null);
    this.successMessage.set(null);

    this.bookingService.deleteBooking(id).subscribe({
      next: () => {
        this.bookings.set(this.bookings().filter((b) => b._id !== id));
        this.actionLoadingId.set(null);
        this.successMessage.set('Booking deleted.');
      },
      error: (err) => {
        const msg = err?.error?.message || err?.message || 'Delete failed.';
        this.serverError.set(msg);
        this.actionLoadingId.set(null);
      },
    });
  }
}
