import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { UserService } from '../../../core/services/user.service';
import { UiFeedbackService } from '../../../core/services/ui-feedback.service';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LucideAngularModule],
  templateUrl: './user-create.component.html'
})
export class UserCreateComponent {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);
  private feedback = inject(UiFeedbackService);

  isSubmitting = signal(false);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    displayName: ['', [Validators.required, Validators.maxLength(100)]],
    role: ['SupportAgent', [Validators.required]]
  });

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const req = this.form.getRawValue();

    this.userService.create(req).subscribe({
      next: () => {
        this.feedback.success('User created successfully');
        this.router.navigate(['/users']);
      },
      error: (err) => {
        this.feedback.error(err.error?.message || 'Failed to create user');
        this.isSubmitting.set(false);
      }
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
