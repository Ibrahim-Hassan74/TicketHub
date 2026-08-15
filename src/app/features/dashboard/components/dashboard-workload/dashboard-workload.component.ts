import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentWorkloadResponse } from '../../../../shared/models/dashboard';
import { LucideAngularModule } from 'lucide-angular';
import { DurationPipe } from '../../../../shared/pipes/duration.pipe';

@Component({
  selector: 'app-dashboard-workload',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, DurationPipe],
  templateUrl: './dashboard-workload.component.html'
})
export class DashboardWorkloadComponent {
  workload = input.required<AgentWorkloadResponse[]>();
}
