import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../../core/services/account.service';
import { LucideAngularModule } from 'lucide-angular';
import { HttpErrorResponse } from '@angular/common/http';
import { UiFeedbackService } from '../../../core/services/ui-feedback.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private router = inject(Router);
  private uiFeedbackService = inject(UiFeedbackService);

  isLoading = signal(false);

  registerForm = this.fb.nonNullable.group({
    userName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      const confirmCtrl = control.get('confirmPassword');
      if (confirmCtrl?.hasError('passwordMismatch')) {
        delete confirmCtrl.errors?.['passwordMismatch'];
        if (confirmCtrl.errors && Object.keys(confirmCtrl.errors).length === 0) {
          confirmCtrl.setErrors(null);
        }
      }
      return null;
    }
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const formValue = this.registerForm.getRawValue();

    this.accountService.register(formValue).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.uiFeedbackService.success('Registration successful. Please log in.', 'Success');
        this.router.navigate(['/auth/login']);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);

        let message = err.error?.message || 'An unexpected error occurred. Please try again.';
        if (err.error?.errors && Array.isArray(err.error.errors)) {
          message += '\n' + err.error.errors.join('\n');
        }

        this.uiFeedbackService.error(message, 'Registration Failed');
      }
    });
  }
}
