import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../../core/services/account.service';
import { LucideAngularModule } from 'lucide-angular';
import { HttpErrorResponse } from '@angular/common/http';
import { UiFeedbackService } from '../../../core/services/ui-feedback.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private uiFeedbackService = inject(UiFeedbackService);

  isLoading = signal(false);
  errorMessage = signal('');

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    rememberMe: [false]
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    // this.errorMessage.set('');

    const { email, password } = this.loginForm.getRawValue();

    this.accountService.login({ email, password }).subscribe({
      next: async () => {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'];
        await this.accountService.initializeUser();
        if (returnUrl) {
          this.router.navigateByUrl(returnUrl);
        } else {
          const role = this.accountService.currentUser()?.role;
          if (role === 'Admin') {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/tickets']);
          }
        }
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);

        let message = err.error?.message || 'An unexpected error occurred. Please try again.';
        if (err.error?.errors && Array.isArray(err.error.errors)) {
          message += '\n' + err.error.errors.join('\n');
        }

        // this.errorMessage.set(message);
        this.uiFeedbackService.error(message, 'Login Failed');
      }
    });
  }
}
