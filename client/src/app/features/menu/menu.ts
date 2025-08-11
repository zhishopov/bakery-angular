import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Product } from '../../models/product';
import { ProductService } from '../../core/services/product.service';
import { LikesService, Like } from '../../core/services/likes.service';
import { AuthService } from '../../core/services/auth.service';
import { PricePipe } from '../../shared/pipes/price-pipe';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, RouterModule, PricePipe],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly likesService = inject(LikesService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly products = signal<Product[]>([]);
  readonly likeCounts = signal<Record<string, number>>({});
  readonly userLikes = signal<Record<string, Like | null>>({});
  readonly loading = signal<boolean>(false);

  ngOnInit(): void {
    this.loading.set(true);
    this.productService.getAll().subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
        this.refreshLikesForAll();
      },
      error: () => this.loading.set(false),
    });
  }

  private refreshLikesForAll(): void {
    const ids = this.products().map((p) => p._id);
    ids.forEach((id) => this.refreshLikeData(id));
  }

  private refreshLikeData(productId: string): void {
    this.likesService.getCount(productId).subscribe((count) => {
      this.likeCounts.update((map) => ({ ...map, [productId]: count }));
    });

    const userId = this.authService.currentUser?.id;
    if (userId) {
      this.likesService.getUserLike(productId, userId).subscribe((like) => {
        this.userLikes.update((map) => ({ ...map, [productId]: like }));
      });
    } else {
      this.userLikes.update((map) => ({ ...map, [productId]: null }));
    }
  }

  likeOrUnlike(productId: string): void {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/auth/login']);
      return;
    }

    const existing = this.userLikes()[productId];
    if (existing && existing._id) {
      this.likesService.unlike(existing._id).subscribe(() => {
        this.userLikes.update((map) => ({ ...map, [productId]: null }));
        const current = this.likeCounts()[productId] ?? 0;
        this.likeCounts.update((map) => ({
          ...map,
          [productId]: Math.max(0, current - 1),
        }));
      });
    } else {
      this.likesService.like(productId).subscribe((newLike) => {
        this.userLikes.update((map) => ({ ...map, [productId]: newLike }));
        const current = this.likeCounts()[productId] ?? 0;
        this.likeCounts.update((map) => ({ ...map, [productId]: current + 1 }));
      });
    }
  }

  removeProduct(id: string): void {
    if (!confirm('Remove this product from the menu?')) return;
    this.productService.delete(id).subscribe({
      next: () => {
        this.products.set(this.products().filter((p) => p._id !== id));
      },
      error: () => {},
    });
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }

  getImageSrc(product: Product): string {
    return product.image?.startsWith('data:')
      ? product.image
      : `/assets/images/${product.image}`;
  }

  userHasLiked(productId: string): boolean {
    return !!this.userLikes()[productId];
  }

  countFor(productId: string): number {
    return this.likeCounts()[productId] ?? 0;
  }
}
