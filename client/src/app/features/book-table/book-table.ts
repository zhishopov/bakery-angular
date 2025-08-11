import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookingService } from '../../core/services/booking.service';

@Component({
  selector: 'app-book-table',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, RouterModule, CommonModule],
  templateUrl: './book-table.html',
  styleUrl: './book-table.css',
})
export class BookTable {
  private readonly fb = inject(FormBuilder);
  private readonly bookingService = inject(BookingService);

  bookingForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    date: ['', Validators.required],
    time: ['', Validators.required],
    guests: [1, [Validators.required, Validators.min(1)]],
  });

  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  onSubmit(): void {
    this.successMessage.set(null);
    this.errorMessage.set(null);

    if (this.bookingForm.valid) {
      const bookingData = this.bookingForm.value;

      this.bookingService.bookTable(bookingData).subscribe({
        next: () => {
          this.successMessage.set('Table booked successfully!');
          this.bookingForm.reset({
            name: '',
            email: '',
            date: '',
            time: '',
            guests: 1,
          });
        },
        error: (err) => {
          const msg =
            err?.error?.message ||
            err?.error?.error?.message ||
            'Booking failed. Please try again.';
          this.errorMessage.set(msg);
        },
      });
    } else {
      this.errorMessage.set('All fields are required.');
      this.bookingForm.markAllAsTouched();
    }
  }
}
