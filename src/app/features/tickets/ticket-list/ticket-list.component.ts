import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { TicketService } from '../../../core/services/ticket.service';
import { AccountService } from '../../../core/services/account.service';
import { TicketListHeaderComponent } from './components/ticket-list-header/ticket-list-header.component';
import { TicketListFiltersComponent } from './components/ticket-list-filters/ticket-list-filters.component';
import { TicketListTableComponent } from './components/ticket-list-table/ticket-list-table.component';
import { TicketListPaginationComponent } from './components/ticket-list-pagination/ticket-list-pagination.component';
import { TicketResponse, TicketQueryRequest, TicketStatus, TicketPriority, SortBy, SortOrder } from '../../../shared/models/ticket';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule, 
    LucideAngularModule,
    TicketListHeaderComponent,
    TicketListFiltersComponent,
    TicketListTableComponent,
    TicketListPaginationComponent
  ],
  templateUrl: './ticket-list.component.html'
})
export class TicketListComponent implements OnInit {
  private ticketService = inject(TicketService);
  private accountService = inject(AccountService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  currentUser = this.accountService.currentUser;
  
  tickets = signal<TicketResponse[]>([]);
  totalCount = signal<number>(0);
  totalPages = signal<number>(0);
  isLoading = signal<boolean>(true);
  isInitialLoad = signal<boolean>(true);

  query = signal<TicketQueryRequest>({
    page: 1,
    pageSize: 10,
    sortBy: 'CreatedAt',
    sortOrder: 'Descending'
  });

  statusOptions: { value: TicketStatus | '', label: string }[] = [
    { value: '', label: 'All Statuses' },
    { value: 'Open', label: 'Open' },
    { value: 'InProgress', label: 'In Progress' },
    { value: 'Resolved', label: 'Resolved' },
    { value: 'Closed', label: 'Closed' }
  ];

  priorityOptions: { value: TicketPriority | '', label: string }[] = [
    { value: '', label: 'All Priorities' },
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' },
    { value: 'Critical', label: 'Critical' }
  ];

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const q: TicketQueryRequest = {
        page: params['page'] ? Number(params['page']) : 1,
        pageSize: params['pageSize'] ? Number(params['pageSize']) : 10,
        sortBy: (params['sortBy'] as SortBy) || 'CreatedAt',
        sortOrder: (params['sortOrder'] as SortOrder) || 'Descending',
        status: params['status'] as TicketStatus || undefined,
        priority: params['priority'] as TicketPriority || undefined,
        search: params['search'] || undefined,
      };
      
      if (!q.status) delete q.status;
      if (!q.priority) delete q.priority;
      if (!q.search) delete q.search;

      this.query.set(q);
      this.loadTickets();
    });
  }

  loadTickets() {
    this.isLoading.set(true);
    this.ticketService.getTickets(this.query()).subscribe({
      next: (res) => {
        this.tickets.set(res.items);
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

  onFilterChange(key: 'status' | 'priority', value: any) {
    this.updateQuery({ [key]: value || undefined, page: 1 });
  }

  onSort(column: SortBy) {
    const current = this.query();
    if (current.sortBy === column) {
      this.updateQuery({ sortOrder: current.sortOrder === 'Ascending' ? 'Descending' : 'Ascending' });
    } else {
      this.updateQuery({ sortBy: column, sortOrder: 'Descending' });
    }
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.updateQuery({ page });
    }
  }

  private updateQuery(changes: Partial<TicketQueryRequest>) {
    const current = this.query();
    const newParams = { ...current, ...changes };
    
    // Convert undefined to null so router removes the param from URL
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
        sortBy: null,
        sortOrder: null,
        status: null,
        priority: null,
        search: null
      }
    });
  }

  goToDetail(id: string) {
    this.router.navigate(['/tickets', id]);
  }
}
