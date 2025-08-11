import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.css',
  imports: [RouterLink],
})
export class Home {
  private readonly authService = inject(AuthService);
  private readonly productService = inject(ProductService);

  readonly featuredProducts = signal<Product[]>([]);

  constructor() {
    this.productService.getAll().subscribe((all) => {
      const bestSellers = all.filter((p) => (p as any).bestSeller === true);
      const list =
        bestSellers.length > 0 ? bestSellers.slice(0, 7) : all.slice(0, 3);
      this.featuredProducts.set(list);
    });
  }

  get isLoggedIn() {
    return this.authService.isLoggedIn;
  }

  getImageSrc(product: Product): string {
    const img = product?.image || '';
    return img.startsWith('data:') ? img : `/assets/images/${img}`;
  }
}
