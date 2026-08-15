import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketResponse, TicketStatus, TicketPriority } from '../../../../../shared/models/ticket';
import { AgentSummary, User } from '../../../../../shared/models/user';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-ticket-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './ticket-sidebar.component.html'
})
export class TicketSidebarComponent {
  ticket = input.required<TicketResponse>();
  currentUser = input.required<User | null>();
  agents = input.required<AgentSummary[]>();
  
  availableStatusOptions = input.required<TicketStatus[]>();
  priorityOptions = input.required<TicketPriority[]>();
  
  isChangingStatus = input<boolean>(false);
  isChangingPriority = input<boolean>(false);
  isAssigning = input<boolean>(false);

  changeStatus = output<TicketStatus>();
  changePriority = output<TicketPriority>();
  assignAgent = output<string>();
  closeTicketCustomer = output<void>();
  reopenTicketCustomer = output<void>();

  onStatusChange(status: TicketStatus) {
    this.changeStatus.emit(status);
  }

  onPriorityChange(priority: TicketPriority) {
    this.changePriority.emit(priority);
  }

  onAssignAgent(event: Event) {
    const agentId = (event.target as HTMLSelectElement).value;
    this.assignAgent.emit(agentId);
  }
}
