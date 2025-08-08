import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AuthService } from '../services/auth.service';

export interface Like {
  _id?: string;
  productId: string;
  _ownerId?: string;
}

@Injectable({ providedIn: 'root' })
export class LikesService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly apiUrl = 'http://localhost:3030/data/likes';

  getCount(productId: string): Observable<number> {
    const where = encodeURIComponent(`productId="${productId}"`);
    return this.http
      .get<Like[]>(`${this.apiUrl}?where=${where}`)
      .pipe(map((list) => list.length));
  }

  getUserLike(productId: string, userId: string): Observable<Like | null> {
    const where = encodeURIComponent(
      `productId="${productId}" AND _ownerId="${userId}"`
    );
    return this.http
      .get<Like[]>(`${this.apiUrl}?where=${where}`)
      .pipe(map((list) => list[0] ?? null));
  }

  like(productId: string): Observable<Like> {
    return this.http.post<Like>(
      this.apiUrl,
      { productId },
      {
        headers: this.auth.getAuthHeaders(),
      }
    );
  }

  unlike(likeId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${likeId}`, {
      headers: this.auth.getAuthHeaders(),
    });
  }
}
