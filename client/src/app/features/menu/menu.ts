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
}
