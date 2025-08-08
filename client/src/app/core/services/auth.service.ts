import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';

interface ApiUser {
  _id: string;
  email: string;
  username: string;
  accessToken: string;
  role?: 'admin' | 'user';
}

interface User {
  id: string;
  email: string;
  username: string;
  accessToken: string;
  role?: 'admin' | 'user';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = 'http://localhost:3030/users';
  private readonly _currentUser = signal<User | null>(null);
  private readonly _isLoggedIn = signal<boolean>(false);
  readonly token = signal<string | null>(null);

  constructor(private http: HttpClient) {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user: User = JSON.parse(savedUser);
      this._currentUser.set(user);
      this._isLoggedIn.set(true);
      this.token.set(user.accessToken);
    }
  }

  login(email: string, password: string): Observable<User> {
    return this.http
      .post<ApiUser>(
        `${this.apiUrl}/login`,
        { email, password },
        { withCredentials: true }
      )
      .pipe(
        map((apiUser) => this.mapApiUserToUser(apiUser)),
        map((user) => {
          this._currentUser.set(user);
          this._isLoggedIn.set(true);
          this.token.set(user.accessToken);
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('accessToken', user.accessToken);
          return user;
        })
      );
  }

  register(
    username: string,
    email: string,
    password: string,
    rePassword: string
  ): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/register`,
      { username, email, password, rePassword },
      { withCredentials: true }
    );
  }

  logout(): Observable<void> {
    return this.http
      .post<void>(`${this.apiUrl}/logout`, {}, { withCredentials: true })
      .pipe(
        tap(() => {
          this._currentUser.set(null);
          this._isLoggedIn.set(false);
          this.token.set(null);
          localStorage.removeItem('currentUser');
          localStorage.removeItem('accessToken');
        })
      );
  }

  get currentUser(): User | null {
    return this._currentUser();
  }

  get isLoggedIn(): boolean {
    return this._isLoggedIn();
  }

  get isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  getAuthHeaders(): HttpHeaders | undefined {
    const accessToken = this.token();
    return accessToken
      ? new HttpHeaders({ 'X-Authorization': accessToken })
      : undefined;
  }

  getAdminHeaders(): HttpHeaders | undefined {
    const token = this.token();
    return token
      ? new HttpHeaders({ 'X-Authorization': token, 'X-Admin': 'true' })
      : undefined;
  }

  private mapApiUserToUser(apiUser: ApiUser): User {
    const role: 'admin' | 'user' =
      apiUser.role ?? (apiUser.email === 'admin@abv.bg' ? 'admin' : 'user');

    return {
      id: apiUser._id,
      username: apiUser.username,
      email: apiUser.email,
      accessToken: apiUser.accessToken,
      role: role,
    };
  }
}
