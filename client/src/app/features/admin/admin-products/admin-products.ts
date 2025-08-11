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
  private readonly formBuilder = inject(FormBuilder);
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);

  serverError = signal<string | null>(null);
  clientErrorMessage = signal<string | null>(null);
  imageDataUrl = signal<string | null>(null);

  form: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    price: [null, [Validators.required, Validators.min(0)]],
    description: ['', [Validators.required, Validators.minLength(5)]],
    image: [''],
    bestSeller: [false],
  });

  get formControls() {
    return this.form.controls;
  }

  onFileSelected(event: Event) {
    this.serverError.set(null);
    this.clientErrorMessage.set(null);
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      this.imageDataUrl.set(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.imageDataUrl.set(reader.result as string);
      if (!this.formControls['image'].value) {
        this.formControls['image'].setErrors(null);
      }
    };
    reader.onerror = () => {
      this.serverError.set(
        'Could not read the selected file. Please try another image.'
      );
      this.imageDataUrl.set(null);
    };
    reader.readAsDataURL(file);
  }

  handleCreateClick(): void {
    this.serverError.set(null);
    this.clientErrorMessage.set(null);

    if (!this.imageDataUrl() && !this.formControls['image'].value) {
      this.clientErrorMessage.set('All fields are required.');
      this.form.markAllAsTouched();
      return;
    }

    if (this.form.invalid) {
      this.clientErrorMessage.set('All fields are required.');
      this.form.markAllAsTouched();
      return;
    }

    this.onSubmit();
  }

  onSubmit(): void {
    this.serverError.set(null);
    this.clientErrorMessage.set(null);

    const payload: ProductCreate = {
      name: this.formControls['name'].value,
      price: Number(this.formControls['price'].value),
      description: this.formControls['description'].value,
      image: this.imageDataUrl() || this.formControls['image'].value,
      likes: 0,
      bestSeller: !!this.formControls['bestSeller'].value,
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
