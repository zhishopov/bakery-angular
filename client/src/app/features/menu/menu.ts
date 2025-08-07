import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, RouterModule],
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

  likeProduct(id: string) {
    const updatedProducts = this.products().map((product) => {
      if (product._id === id) {
        const updatedLikes = product.likes + 1;

        this.productService
          .likeProduct(id, updatedLikes)
          .subscribe((updatedProduct) => {
            this.products.set(
              this.products().map((p) => (p._id === id ? updatedProduct : p))
            );
          });

        return { ...product, likes: updatedLikes };
      }
      return product;
    });

    this.products.set(updatedProducts);
  }
}
