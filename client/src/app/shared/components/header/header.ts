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

  get isLoggedIn() {
    return this.authService.isLoggedIn;
  }

  get userEmail(): string | null {
    return this.authService.currentUser?.email ?? null;
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      window.location.href = '/';
    });
  }
}
