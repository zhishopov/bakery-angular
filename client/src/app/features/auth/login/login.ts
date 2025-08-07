import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);

  loginForm: FormGroup;

  public serverError = signal<string | null>(null);
  public registrationMessage = signal<string | null>(null);

  constructor() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
    });

    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as { message?: string };
    if (state?.message) {
      this.registrationMessage.set(state.message);
    }
  }

  get email(): AbstractControl | null {
    return this.loginForm.get('email');
  }

  get password(): AbstractControl | null {
    return this.loginForm.get('password');
  }

  get isEmailValid(): boolean {
    return !!this.email?.invalid && (this.email?.dirty || this.email?.touched);
  }

  get isPasswordValid(): boolean {
    return (
      !!this.password?.invalid &&
      (this.password?.dirty || this.password?.touched)
    );
  }

  get emailErrorMessage(): string {
    if (this.email?.errors?.['required']) return 'Email is required!';
    if (this.email?.errors?.['email']) return 'Email is not valid!';
    return '';
  }

  get passwordErrorMessage(): string {
    if (this.password?.errors?.['required']) return 'Password is required!';
    if (this.password?.errors?.['minlength']) {
      return 'Password must be at least 5 characters!';
    }
    return '';
  }

  get registrationSuccess() {
    return this.registrationMessage();
  }

  onSubmit(): void {
    this.serverError.set(null);

    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: () => {
          this.router.navigate(['/home']);
        },
        error: (err) => {
          this.markFormGroupTouched();

          const errorMsg =
            err?.error?.message ||
            err?.error?.error?.message ||
            'Login failed. Please try again.';
          this.serverError.set(errorMsg);
        },
      });
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach((key) => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }
}
