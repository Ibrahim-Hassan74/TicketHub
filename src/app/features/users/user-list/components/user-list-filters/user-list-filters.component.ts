import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserQueryRequest, UserRole } from '../../../../../shared/models/user';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-user-list-filters',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './user-list-filters.component.html'
})
export class UserListFiltersComponent {
  query = input.required<UserQueryRequest>();
  roleOptions = input.required<{ value: UserRole | '', label: string }[]>();

  searchChange = output<string>();
  filterChange = output<{ key: 'role', value: any }>();
  resetFilters = output<void>();

  onSearchChange(searchTerm: string) {
    this.searchChange.emit(searchTerm);
  }

  onFilterChange(key: 'role', value: any) {
    this.filterChange.emit({ key, value });
  }
}
