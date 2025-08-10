import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../models/product';
import { PricePipe } from '../../../shared/pipes/price-pipe';

@Component({
  selector: 'app-details',
  imports: [CommonModule, RouterModule, PricePipe],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);

  readonly product = signal<Product | null>(null);
  readonly likesCount = signal<number>(0);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.productService.getById(id).subscribe({
      next: (prod) => this.product.set(prod),
      error: () => {},
    });

    this.productService.getLikesCount(id).subscribe({
      next: (count) => this.likesCount.set(count),
      error: () => this.likesCount.set(0),
    });
  }

  getImageSrc(product: Product | null): string {
    if (!product?.image) return '';
    return product.image.startsWith('data:')
      ? product.image
      : '/assets/images/' + product.image;
  }
}
