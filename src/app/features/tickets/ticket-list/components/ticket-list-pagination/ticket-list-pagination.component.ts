import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketQueryRequest } from '../../../../../shared/models/ticket';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-ticket-list-pagination',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './ticket-list-pagination.component.html'
})
export class TicketListPaginationComponent {
  query = input.required<TicketQueryRequest>();
  totalPages = input.required<number>();
  totalCount = input.required<number>();
  isLoading = input.required<boolean>();

  pageChange = output<number>();

  onPageChange(page: number) {
    this.pageChange.emit(page);
  }
}
