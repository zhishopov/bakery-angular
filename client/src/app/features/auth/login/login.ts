import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';
  error = signal('');

  loginUser() {
    if (!this.email || !this.password) {
      this.error.set('Please enter both email and password.');
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigateByUrl('/menu');
      },
      error: () => {
        this.error.set('Invalid login. Please try again.');
      },
    });
  }
}
