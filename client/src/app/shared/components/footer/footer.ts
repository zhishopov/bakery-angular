import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  styleUrl: './footer.css',
  imports: [],
})
export class Footer {
  private readonly authService = inject(AuthService);

  get isLoggedIn() {
    return this.authService.isLoggedIn;
  }

  currentYear = new Date().getFullYear();
}
