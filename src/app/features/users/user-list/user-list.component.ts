import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { UserResponse, UserQueryRequest, UserRole } from '../../../shared/models/user';
import { UserListHeaderComponent } from './components/user-list-header/user-list-header.component';
import { UserListFiltersComponent } from './components/user-list-filters/user-list-filters.component';
import { UserListTableComponent } from './components/user-list-table/user-list-table.component';
import { UserListPaginationComponent } from './components/user-list-pagination/user-list-pagination.component';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    UserListHeaderComponent,
    UserListFiltersComponent,
    UserListTableComponent,
    UserListPaginationComponent,
    LucideAngularModule
  ],
  templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  users = signal<UserResponse[]>([]);
  totalCount = signal<number>(0);
  totalPages = signal<number>(0);
  isLoading = signal<boolean>(true);
  isInitialLoad = signal<boolean>(true);

  query = signal<UserQueryRequest>({
    page: 1,
    pageSize: 10
  });

  roleOptions: { value: UserRole | '', label: string }[] = [
    { value: '', label: 'All Roles' },
    { value: 'Admin', label: 'Admin' },
    { value: 'SupportAgent', label: 'Support Agent' },
    { value: 'Customer', label: 'Customer' }
  ];

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const q: UserQueryRequest = {
        page: params['page'] ? Number(params['page']) : 1,
        pageSize: params['pageSize'] ? Number(params['pageSize']) : 10,
        role: params['role'] as UserRole || undefined,
        search: params['search'] || undefined,
      };

      if (!q.role) delete q.role;
      if (!q.search) delete q.search;

      this.query.set(q);
      this.loadUsers();
    });
  }

  loadUsers() {
    this.isLoading.set(true);
    this.userService.getUsers(this.query()).subscribe({
      next: (res) => {
        this.users.set(res.items);
        this.totalCount.set(res.totalCount);
        this.totalPages.set(res.totalPages);
        this.isLoading.set(false);
        if (this.isInitialLoad()) this.isInitialLoad.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        if (this.isInitialLoad()) this.isInitialLoad.set(false);
      }
    });
  }

  onSearchChange(searchTerm: string) {
    this.updateQuery({ search: searchTerm || undefined, page: 1 });
  }

  onFilterChange(key: 'role', value: any) {
    this.updateQuery({ [key]: value || undefined, page: 1 });
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.updateQuery({ page });
    }
  }

  private updateQuery(changes: Partial<UserQueryRequest>) {
    const current = this.query();
    const newParams = { ...current, ...changes };

    const queryParams: any = {};
    for (const key of Object.keys(newParams)) {
      queryParams[key] = (newParams as any)[key] === undefined ? null : (newParams as any)[key];
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    });
  }

  resetFilters() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: null,
        pageSize: null,
        role: null,
        search: null
      }
    });
  }
}
