import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:3030/users/login';

  readonly token = signal<string | null>(null);
  readonly user = signal<any | null>(null); // Can be typed more strictly later

  constructor(private http: HttpClient) {
    const storedToken = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');

    if (storedToken) this.token.set(storedToken);
    if (storedUser) this.user.set(JSON.parse(storedUser));
  }

  login(email: string, password: string) {
    return this.http
      .post<{ accessToken: string; _id: string; email: string }>(this.apiUrl, {
        email,
        password,
      })
      .pipe(
        tap((response) => {
          this.token.set(response.accessToken);
          this.user.set({ _id: response._id, email: response.email });

          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem(
            'user',
            JSON.stringify({ _id: response._id, email: response.email })
          );
        })
      );
  }

  logout() {
    this.token.set(null);
    this.user.set(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  }

  getToken() {
    return this.token();
  }

  getUser() {
    return this.user();
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
