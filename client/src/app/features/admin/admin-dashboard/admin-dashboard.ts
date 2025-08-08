import { Component, inject, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  BookingService,
  Booking,
} from '../../../core/services/booking.service';
import {
  ProductService,
  ProductCreate,
} from '../../../core/services/product.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {
  private readonly bookingService = inject(BookingService);
  private readonly productService = inject(ProductService);
  private readonly fb = inject(FormBuilder);

  readonly bookings = signal<Booking[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  readonly productForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    price: [0, [Validators.required, Validators.min(0)]],
    description: ['', [Validators.required, Validators.minLength(5)]],
    image: ['', [Validators.required]],
    bestSeller: [false],
    likes: [0],
  });

  readonly editingId = signal<string | null>(null);
  editForm: FormGroup | null = null;

  constructor() {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading.set(true);
    this.error.set(null);
    this.bookingService.getAllBookings().subscribe({
      next: (data) => {
        this.bookings.set(data || []);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Failed to load bookings.');
        this.loading.set(false);
      },
    });
  }

  startEdit(booking: Booking): void {
    this.editingId.set(booking._id || null);
    this.editForm = this.fb.group({
      name: [booking.name, [Validators.required, Validators.minLength(2)]],
      email: [booking.email, [Validators.required, Validators.email]],
      date: [booking.date, [Validators.required]],
      time: [booking.time, [Validators.required]],
      guests: [booking.guests, [Validators.required, Validators.min(1)]],
    });
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.editForm = null;
  }

  saveEdit(): void {
    const id = this.editingId();
    if (!id || !this.editForm || this.editForm.invalid) return;

    const changes = this.editForm.value as Partial<Booking>;
    this.bookingService.updateBooking(id, changes).subscribe({
      next: (updated) => {
        this.bookings.set(
          this.bookings().map((booking) =>
            booking._id === id ? { ...booking, ...updated } : booking
          )
        );
        this.cancelEdit();
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Failed to update booking.');
      },
    });
  }

  deleteBooking(id: string): void {
    if (!confirm('Delete this booking?')) return;
    this.bookingService.deleteBooking(id).subscribe({
      next: () => {
        this.bookings.set(
          this.bookings().filter((booking) => booking._id !== id)
        );
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Failed to delete booking.');
      },
    });
  }

  addProduct(): void {
    if (this.productForm.invalid) return;

    const payload = this.productForm.value as ProductCreate;
    this.productService.create(payload).subscribe({
      next: () => {
        this.productForm.reset({
          name: '',
          price: 0,
          description: '',
          image: '',
          bestSeller: false,
          likes: 0,
        });
        alert('Product created.');
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Failed to create product.');
      },
    });
  }
}
