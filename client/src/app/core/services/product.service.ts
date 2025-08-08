import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

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

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  create(product: ProductCreate): Observable<any> {
    return this.http.post<any>(this.apiUrl, product, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  update(id: string, changes: Partial<ProductCreate>): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, changes, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.auth.getAuthHeaders(),
    });
  }
}
