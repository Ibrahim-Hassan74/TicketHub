import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../../../shared/models/user';
import { TicketResponse, TicketQueryRequest, SortBy } from '../../../../../shared/models/ticket';
import { StatusBadgeComponent } from '../../../../../shared/components/status-badge/status-badge.component';
import { PriorityBadgeComponent } from '../../../../../shared/components/priority-badge/priority-badge.component';
import { EmptyStateComponent } from '../../../../../shared/components/empty-state/empty-state.component';
import { RelativeTimePipe } from '../../../../../shared/pipes/relative-time.pipe';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-ticket-list-table',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    StatusBadgeComponent,
    PriorityBadgeComponent,
    EmptyStateComponent,
    RelativeTimePipe
  ],
  templateUrl: './ticket-list-table.component.html'
})
export class TicketListTableComponent {
  tickets = input.required<TicketResponse[]>();
  isLoading = input.required<boolean>();
  currentUser = input.required<User | null>();
  query = input.required<TicketQueryRequest>();

  sort = output<SortBy>();
  rowClick = output<string>();

  onSort(column: SortBy) {
    this.sort.emit(column);
  }

  onRowClick(ticketId: string) {
    this.rowClick.emit(ticketId);
  }
}
