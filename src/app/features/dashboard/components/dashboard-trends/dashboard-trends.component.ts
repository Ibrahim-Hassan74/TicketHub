import { Component, input, output, effect, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketTrendResponse } from '../../../../shared/models/dashboard';
import { LucideAngularModule } from 'lucide-angular';
import ApexCharts, { ApexOptions } from 'apexcharts';

@Component({
  selector: 'app-dashboard-trends',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './dashboard-trends.component.html'
})
export class DashboardTrendsComponent {
  trends = input.required<TicketTrendResponse[]>();
  isLoading = input.required<boolean>();
  selectedDays = input.required<number>();
  daysChange = output<number>();
  
  @ViewChild('chartElement') chartElement!: ElementRef;
  private chartInstance: ApexCharts | null = null;

  constructor() {
    effect(() => {
      const data = this.trends();
      if (data && data.length > 0) {
        this.initChart(data);
      }
    });
  }

  onDaysChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.daysChange.emit(Number(select.value));
  }

  private initChart(data: TicketTrendResponse[]) {
    const dates = data.map(d => new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }));
    const openCounts = data.map(d => d.openCount);
    const closedCounts = data.map(d => d.closedCount);

    const options: ApexOptions = {
      series: [
        {
          name: 'Opened Tickets',
          data: openCounts
        },
        {
          name: 'Closed Tickets',
          data: closedCounts
        }
      ],
      chart: {
        type: 'area',
        height: 350,
        toolbar: {
          show: false
        },
        fontFamily: 'Inter, sans-serif'
      },
      colors: ['#3b82f6', '#10b981'],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      xaxis: {
        categories: dates,
        labels: {
          style: {
            colors: '#9ca3af',
            fontSize: '12px'
          }
        },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#9ca3af',
            fontSize: '12px'
          }
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.4,
          opacityTo: 0.05,
          stops: [0, 100]
        }
      },
      tooltip: {
        theme: 'dark'
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        labels: {
          colors: '#9ca3af'
        }
      }
    };

    setTimeout(() => {
      if (this.chartElement?.nativeElement) {
        if (this.chartInstance) {
          this.chartInstance.destroy();
        }
        this.chartInstance = new ApexCharts(this.chartElement.nativeElement, options);
        this.chartInstance.render();
      }
    }, 0);
  }
}
