import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-menu',
  imports: [CommonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  private readonly productService = inject(ProductService);

  readonly products = signal<Product[]>([]);

  constructor() {
    effect(() => {
      this.productService.getAll().subscribe((data) => this.products.set(data));
    });
  }

  likeProduct(id: string): void {
    const updated = this.products().map((product) =>
      product._id === id ? { ...product, likes: product.likes + 1 } : product
    );
    this.products.set(updated);
  }
}
