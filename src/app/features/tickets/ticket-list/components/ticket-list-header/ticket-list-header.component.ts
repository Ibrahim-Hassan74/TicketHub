import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { User } from '../../../../../shared/models/user';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-ticket-list-header',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './ticket-list-header.component.html'
})
export class TicketListHeaderComponent {
  currentUser = input.required<User | null>();
}
