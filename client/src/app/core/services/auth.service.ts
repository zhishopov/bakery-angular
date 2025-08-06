import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';

interface ApiUser {
  _id: string;
  email: string;
  username: string;
  accessToken: string;
}

interface User {
  id: string;
  email: string;
  username: string;
  accessToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:3030/users';
  private readonly _currentUser = signal<User | null>(null);
  private readonly _isLoggedIn = signal<boolean>(false);
  readonly token = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<User> {
    return this.http
      .post<ApiUser>(
        `${this.apiUrl}/login`,
        { email, password },
        { withCredentials: true }
      )
      .pipe(
        map((apiUser) => this.mapApiUserToUser(apiUser)),
        tap((user) => {
          this._currentUser.set(user);
          this._isLoggedIn.set(true);
          this.token.set(user.accessToken);
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('accessToken', user.accessToken);
        })
      );
  }

  register(
    username: string,
    email: string,
    password: string,
    rePassword: string
  ): Observable<User> {
    return this.http
      .post<ApiUser>(
        `${this.apiUrl}/register`,
        { username, email, password, rePassword },
        { withCredentials: true }
      )
      .pipe(
        map((apiUser) => this.mapApiUserToUser(apiUser)),
        tap((user) => {
          this._currentUser.set(user);
          this._isLoggedIn.set(true);
          this.token.set(user.accessToken);
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('accessToken', user.accessToken);
        })
      );
  }

  logout(): Observable<void> {
    return this.http
      .post<void>(
        'http://localhost:3030/users/logout',
        {},
        { withCredentials: true }
      )
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

  private mapApiUserToUser(apiUser: ApiUser): User {
    return {
      id: apiUser._id,
      username: apiUser.username,
      email: apiUser.email,
      accessToken: apiUser.accessToken,
    };
  }
}
