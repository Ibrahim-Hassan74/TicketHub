import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardStatsResponse } from '../../../../shared/models/dashboard';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-dashboard-stats',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './dashboard-stats.component.html'
})
export class DashboardStatsComponent {
  stats = input.required<DashboardStatsResponse>();
}
