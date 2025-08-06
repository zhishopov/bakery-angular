import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterFormService } from '../forms/register.form';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  readonly registerFormService = inject(RegisterFormService);
  private readonly authService = inject(AuthService);
  readonly router = inject(Router);

  public serverError: string | null = null;

  readonly registerForm: FormGroup = this.registerFormService.createForm();

  onSubmit(): void {
    this.serverError = null;

    if (this.registerFormService.isFormValid(this.registerForm)) {
      const { username, email, password, rePassword } =
        this.registerFormService.getFormValue(this.registerForm);

      this.authService
        .register(username, email, password, rePassword)
        .subscribe({
          next: () => {
            this.router.navigate(['/home']);
          },
          error: (err) => {
            this.registerFormService.markFormTouched(this.registerForm);

            const errorMsg =
              err?.error?.message ||
              err?.error?.error?.message ||
              'Registration failed. Please try again.';

            this.serverError = errorMsg;
            console.warn('Backend error:', this.serverError);
          },
        });
    } else {
      this.registerFormService.markFormTouched(this.registerForm);
    }
  }
}
