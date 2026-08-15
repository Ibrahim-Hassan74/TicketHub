import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketQueryRequest, TicketStatus, TicketPriority } from '../../../../../shared/models/ticket';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-ticket-list-filters',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './ticket-list-filters.component.html'
})
export class TicketListFiltersComponent {
  query = input.required<TicketQueryRequest>();
  statusOptions = input.required<{ value: TicketStatus | '', label: string }[]>();
  priorityOptions = input.required<{ value: TicketPriority | '', label: string }[]>();

  searchChange = output<string>();
  filterChange = output<{ key: 'status' | 'priority', value: any }>();
  resetFilters = output<void>();

  onSearchChange(searchTerm: string) {
    this.searchChange.emit(searchTerm);
  }

  onFilterChange(key: 'status' | 'priority', value: any) {
    this.filterChange.emit({ key, value });
  }
}
