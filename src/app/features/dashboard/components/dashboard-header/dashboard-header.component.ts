import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './dashboard-header.component.html'
})
export class DashboardHeaderComponent {
  isLoading = input.required<boolean>();
  refresh = output<void>();

  onRefresh() {
    this.refresh.emit();
  }
}
