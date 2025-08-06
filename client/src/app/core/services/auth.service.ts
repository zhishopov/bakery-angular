import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:3030/users';
  readonly token = signal<string | null>(null);

  constructor(private http: HttpClient) {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      this.token.set(storedToken);
    }
  }

  login(email: string, password: string) {
    return this.http
      .post<{ accessToken: string }>(`${this.apiUrl}/login`, {
        email,
        password,
      })
      .pipe(
        tap((response) => {
          this.token.set(response.accessToken);
          localStorage.setItem('accessToken', response.accessToken);
        })
      );
  }

  logout() {
    this.token.set(null);
    localStorage.removeItem('accessToken');
  }

  getToken() {
    return this.token();
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
