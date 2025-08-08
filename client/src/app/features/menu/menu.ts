import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../models/product';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  private readonly productService = inject(ProductService);
  private readonly authService = inject(AuthService);

  readonly products = signal<Product[]>([]);

  constructor() {
    effect(() => {
      this.productService.getAll().subscribe((data) => this.products.set(data));
    });
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }

  removeProduct(id: string) {
    if (!this.isAdmin) return;
    this.productService.delete(id).subscribe({
      next: () => {
        this.products.set(this.products().filter((p) => p._id !== id));
      },
      error: (err) => {
        console.warn('Failed to delete product:', err);
      },
    });
  }

  getImageSrc(product: Product): string {
    const value = product.image || '';
    return value.startsWith('data:') ? value : '/assets/images/' + value;
  }
}
