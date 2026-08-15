import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityResponse } from '../../../../../shared/models/activity';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-ticket-timeline',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './ticket-timeline.component.html'
})
export class TicketTimelineComponent {
  activities = input.required<ActivityResponse[]>();
  visibleCount = signal(5);

  showMore() {
    this.visibleCount.update(c => c + 5);
  }

  showLess() {
    this.visibleCount.update(c => Math.max(5, c - 5));
  }
}
