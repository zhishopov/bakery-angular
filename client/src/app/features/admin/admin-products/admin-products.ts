import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  ProductService,
  ProductCreate,
} from '../../../core/services/product.service';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.html',
  styleUrl: './admin-products.css',
  imports: [ReactiveFormsModule, RouterModule],
})
export class AdminProducts {
  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);

  serverError = signal<string | null>(null);

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    price: [null, [Validators.required, Validators.min(0)]],
    description: ['', [Validators.required, Validators.minLength(5)]],
    image: ['', [Validators.required]],
    bestSeller: [false],
  });

  get f() {
    return this.form.controls;
  }

  onSubmit(): void {
    this.serverError.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: ProductCreate = {
      name: this.f['name'].value,
      price: Number(this.f['price'].value),
      description: this.f['description'].value,
      image: this.f['image'].value,
      likes: 0,
      bestSeller: !!this.f['bestSeller'].value,
    };

    this.productService.create(payload).subscribe({
      next: () => this.router.navigate(['/menu']),
      error: (err) => {
        const msg =
          err?.error?.message ||
          err?.error?.error?.message ||
          'Failed to create product. Please try again.';
        this.serverError.set(msg);
      },
    });
  }
}
