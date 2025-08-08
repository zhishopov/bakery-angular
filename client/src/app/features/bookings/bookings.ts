import { Component, inject, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BookingService, Booking } from '../../core/services/booking.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.html',
  styleUrl: './bookings.css',
  imports: [CommonModule, ReactiveFormsModule],
})
export class Bookings {
  private readonly bookingService = inject(BookingService);
  private readonly fb = inject(FormBuilder);

  bookings = signal<Booking[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  editingId = signal<string | null>(null);
  editForm: FormGroup | null = null;

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.error.set(null);
    const userId = this.bookingService['auth'].currentUser?.id || '';
    this.bookingService.getMyBookings(userId).subscribe({
      next: (data) => {
        this.bookings.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Failed to load bookings.');
        this.loading.set(false);
      },
    });
  }

  startEdit(b: Booking) {
    this.editingId.set(b._id!);
    this.editForm = this.fb.group({
      name: [b.name, [Validators.required, Validators.minLength(2)]],
      email: [b.email, [Validators.required, Validators.email]],
      date: [b.date, [Validators.required]],
      time: [b.time, [Validators.required]],
      guests: [b.guests, [Validators.required, Validators.min(1)]],
    });
  }

  cancelEdit() {
    this.editingId.set(null);
    this.editForm = null;
  }

  saveEdit() {
    if (!this.editForm || this.editForm.invalid) {
      this.editForm?.markAllAsTouched();
      return;
    }
    const id = this.editingId();
    if (!id) return;

    const changes: Partial<Booking> = this.editForm.value;
    this.bookingService.updateBooking(id, changes).subscribe({
      next: (updated) => {
        this.bookings.set(
          this.bookings().map((x) => (x._id === id ? { ...x, ...updated } : x))
        );
        this.cancelEdit();
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Failed to save booking.');
      },
    });
  }

  deleteBooking(id: string) {
    if (!confirm('Delete this booking?')) return;
    this.bookingService.deleteBooking(id).subscribe({
      next: () => {
        this.bookings.set(this.bookings().filter((b) => b._id !== id));
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Failed to delete booking.');
      },
    });
  }
}
