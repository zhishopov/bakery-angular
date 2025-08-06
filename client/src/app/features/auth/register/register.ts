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
  private readonly router = inject(Router);

  readonly registerForm: FormGroup = this.registerFormService.createForm();

  onSubmit(): void {
    if (this.registerFormService.isFormValid(this.registerForm)) {
      const { username, email, phone, password } =
        this.registerFormService.getFormValue(this.registerForm);

      this.authService.register(username, email, phone, password).subscribe({
        next: () => {
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.log('Registration failed:', err);
          this.registerFormService.markFormTouched(this.registerForm);
        },
      });
    } else {
      this.registerFormService.markFormTouched(this.registerForm);
    }
  }
}
