import { Component, input, output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserResponse, UpdateUserRequest } from '../../../../../shared/models/user';
import { LucideAngularModule } from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../../core/services/user.service';
import { UiFeedbackService } from '../../../../../core/services/ui-feedback.service';

@Component({
  selector: 'app-user-list-table',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './user-list-table.component.html'
})
export class UserListTableComponent {
  users = input.required<UserResponse[]>();
  isLoading = input.required<boolean>();

  userUpdated = output<void>();

  private userService = inject(UserService);
  private feedback = inject(UiFeedbackService);

  editingUserId = signal<string | null>(null);
  editForm = signal<{ displayName: string; isActive: boolean }>({ displayName: '', isActive: false });
  isSaving = signal(false);

  startEdit(user: UserResponse) {
    this.editingUserId.set(user.id);
    this.editForm.set({
      displayName: user.displayName,
      isActive: user.isActive
    });
  }

  cancelEdit() {
    this.editingUserId.set(null);
  }

  saveEdit(userId: string) {
    if (!this.editForm().displayName.trim()) {
      this.feedback.error('Display name cannot be empty');
      return;
    }

    this.isSaving.set(true);
    const req: UpdateUserRequest = this.editForm();
    
    this.userService.update(userId, req).subscribe({
      next: () => {
        this.feedback.success('User updated successfully');
        this.editingUserId.set(null);
        this.isSaving.set(false);
        this.userUpdated.emit();
      },
      error: (err) => {
        this.feedback.error(err.error?.message || 'Failed to update user');
        this.isSaving.set(false);
      }
    });
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'Admin': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800';
      case 'SupportAgent': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'Customer': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700';
    }
  }

  updateEditForm(key: 'displayName' | 'isActive', value: any) {
    this.editForm.update(form => ({ ...form, [key]: value }));
  }
}
