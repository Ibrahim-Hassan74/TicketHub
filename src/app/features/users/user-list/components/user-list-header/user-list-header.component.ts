import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-user-list-header',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './user-list-header.component.html'
})
export class UserListHeaderComponent {
  isLoading = input.required<boolean>();
  refresh = output<void>();
}
