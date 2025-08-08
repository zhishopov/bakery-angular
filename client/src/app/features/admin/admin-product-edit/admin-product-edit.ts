import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-admin-product-edit',
  templateUrl: './admin-product-edit.html',
  styleUrl: './admin-product-edit.css',
  imports: [ReactiveFormsModule, RouterModule],
})
export class AdminProductEdit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  serverError = signal<string | null>(null);
  loading = signal<boolean>(true);
  imageDataUrl = signal<string | null>(null);
  productId = signal<string | null>(null);
  currentImage: string | null = null;

  form: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    price: [null, [Validators.required, Validators.min(0)]],
    description: ['', [Validators.required, Validators.minLength(5)]],
    bestSeller: [false],
  });

  get formControls() {
    return this.form.controls;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/admin/dashboard']);
      return;
    }
    this.productId.set(id);

    this.productService.getById(id).subscribe({
      next: (product) => {
        this.form.patchValue({
          name: product.name,
          price: product.price,
          description: product.description,
          bestSeller: !!product.bestSeller,
        });

        if (
          typeof product.image === 'string' &&
          product.image.startsWith('data:')
        ) {
          this.imageDataUrl.set(product.image);
        } else {
          this.imageDataUrl.set(null);
        }

        this.currentImage = product.image ?? null;
        this.loading.set(false);
      },
      error: (err) => {
        this.serverError.set(err?.error?.message || 'Failed to load product.');
        this.loading.set(false);
      },
    });
  }

  onFileSelected(event: Event) {
    this.serverError.set(null);
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      this.imageDataUrl.set(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.imageDataUrl.set(reader.result as string);
    };
    reader.onerror = () => {
      this.serverError.set(
        'Could not read the selected file. Please try another image.'
      );
      this.imageDataUrl.set(null);
    };
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    this.serverError.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const id = this.productId();
    if (!id) return;

    const basePayload = {
      name: this.formControls['name'].value,
      price: Number(this.formControls['price'].value),
      description: this.formControls['description'].value,
      bestSeller: !!this.formControls['bestSeller'].value,
    };

    const image = this.imageDataUrl() ?? this.currentImage ?? undefined;

    const payload: Partial<{
      name: string;
      price: number;
      description: string;
      bestSeller: boolean;
      image?: string;
    }> = image ? { ...basePayload, image } : basePayload;

    this.productService.update(id, payload).subscribe({
      next: () => this.router.navigate(['/menu']),
      error: (err) => {
        const msg =
          err?.error?.message ||
          err?.error?.error?.message ||
          'Failed to update product. Please try again.';
        this.serverError.set(msg);
      },
    });
  }
}
