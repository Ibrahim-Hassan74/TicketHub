import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketResponse } from '../../../../../shared/models/ticket';
import { StatusBadgeComponent } from '../../../../../shared/components/status-badge/status-badge.component';
import { PriorityBadgeComponent } from '../../../../../shared/components/priority-badge/priority-badge.component';
import { RelativeTimePipe } from '../../../../../shared/pipes/relative-time.pipe';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-ticket-header',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent, PriorityBadgeComponent, RelativeTimePipe, LucideAngularModule],
  templateUrl: './ticket-header.component.html'
})
export class TicketHeaderComponent {
  ticket = input.required<TicketResponse>();
}
