import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Product } from '../../models/product';

export interface ProductCreate {
  name: string;
  price: number;
  description: string;
  image: string;
  likes?: number;
  bestSeller?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly apiUrl = 'http://localhost:3030/data/products';
  private readonly likesUrl = 'http://localhost:3030/data/likes';

  private headersForWrite() {
    return this.auth.isAdmin
      ? this.auth.getAdminHeaders()
      : this.auth.getAuthHeaders();
  }

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  create(product: ProductCreate): Observable<any> {
    return this.http.post<any>(this.apiUrl, product, {
      headers: this.headersForWrite(),
    });
  }

  update(id: string, changes: Partial<ProductCreate>): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, changes, {
      headers: this.headersForWrite(),
    });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.headersForWrite(),
    });
  }

  getLikesCount(productId: string) {
    const where = encodeURIComponent(`productId="${productId}"`);
    return this.http.get<number>(
      `${this.likesUrl}?where=${where}&distinct=_ownerId&count=true`
    );
  }
}
