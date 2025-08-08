import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.css',
  imports: [RouterLink],
})
export class Header {
  private readonly authService = inject(AuthService);

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }

  get userEmail(): string {
    return this.authService.currentUser?.email ?? '';
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      window.location.href = '/';
    });
  }
}
