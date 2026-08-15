import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../core/services/dashboard.service';
import { AgentWorkloadResponse, DashboardStatsResponse, TicketTrendResponse } from '../../shared/models/dashboard';
import { DashboardHeaderComponent } from './components/dashboard-header/dashboard-header.component';
import { DashboardStatsComponent } from './components/dashboard-stats/dashboard-stats.component';
import { DashboardWorkloadComponent } from './components/dashboard-workload/dashboard-workload.component';
import { DashboardTrendsComponent } from './components/dashboard-trends/dashboard-trends.component';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    LucideAngularModule,
    DashboardHeaderComponent, 
    DashboardStatsComponent, 
    DashboardWorkloadComponent, 
    DashboardTrendsComponent
  ],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  
  stats = signal<DashboardStatsResponse | null>(null);
  agentWorkload = signal<AgentWorkloadResponse[]>([]);
  ticketTrends = signal<TicketTrendResponse[]>([]);
  isLoading = signal(true);
  isLoadingTrends = signal(true);
  selectedDays = signal(30);

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadTrends(this.selectedDays());
  }

  loadDashboardData() {
    this.isLoading.set(true);

    this.dashboardService.getStats().subscribe({
      next: (data) => this.stats.set(data),
      error: () => console.error('Failed to load stats')
    });

    this.dashboardService.getAgentWorkload().subscribe({
      next: (data) => {
        this.agentWorkload.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        console.error('Failed to load agent workload');
        this.isLoading.set(false);
      }
    });
  }

  loadTrends(days: number) {
    this.selectedDays.set(days);
    this.isLoadingTrends.set(true);
    
    this.dashboardService.getTicketTrends(days).subscribe({
      next: (data) => {
        this.ticketTrends.set(data);
        this.isLoadingTrends.set(false);
      },
      error: () => {
        console.error('Failed to load ticket trends');
        this.isLoadingTrends.set(false);
      }
    });
  }
}
