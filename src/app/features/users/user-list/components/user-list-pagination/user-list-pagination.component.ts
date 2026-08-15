import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserQueryRequest } from '../../../../../shared/models/user';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-user-list-pagination',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './user-list-pagination.component.html'
})
export class UserListPaginationComponent {
  query = input.required<UserQueryRequest>();
  totalPages = input.required<number>();
  totalCount = input.required<number>();
  isLoading = input.required<boolean>();

  pageChange = output<number>();
  Math = Math;

  getPageNumbers(): number[] {
    const current = this.query().page || 1;
    const total = this.totalPages();
    const pages: number[] = [];
    
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      if (current <= 3) {
        pages.push(1, 2, 3, 4, -1, total);
      } else if (current >= total - 2) {
        pages.push(1, -1, total - 3, total - 2, total - 1, total);
      } else {
        pages.push(1, -1, current - 1, current, current + 1, -1, total);
      }
    }
    return pages;
  }
}
