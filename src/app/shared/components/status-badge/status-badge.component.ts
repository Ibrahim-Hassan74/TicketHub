import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="badgeClasses()">
      <!-- Optional tiny glowing dot -->
      <span [class]="dotClasses()"></span>
      {{ statusText() }}
    </span>
  `
})
export class StatusBadgeComponent {
  status = input<string>('Open');

  statusText = computed(() => {
    const s = this.status();
    if (!s) return 'Unknown';
    if (s.toLowerCase() === 'inprogress') return 'In Progress';
    return s.charAt(0).toUpperCase() + s.slice(1);
  });

  badgeClasses = computed(() => {
    const base = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border shadow-sm transition-all duration-300';
    const s = this.status().toLowerCase();

    switch (s) {
      case 'open':
        return `${base} bg-blue-50/80 text-blue-700 border-blue-200/60 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20 hover:shadow-blue-500/10 hover:border-blue-300`;
      case 'inprogress':
      case 'in progress':
      case 'in-progress':
        return `${base} bg-amber-50/80 text-amber-700 border-amber-200/60 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20 hover:shadow-amber-500/10 hover:border-amber-300`;
      case 'resolved':
        return `${base} bg-emerald-50/80 text-emerald-700 border-emerald-200/60 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 hover:shadow-emerald-500/10 hover:border-emerald-300`;
      case 'closed':
        return `${base} bg-slate-50/80 text-slate-600 border-slate-200/60 dark:bg-slate-500/10 dark:text-slate-300 dark:border-slate-500/20`;
      default:
        return `${base} bg-gray-50/80 text-gray-600 border-gray-200/60 dark:bg-gray-500/10 dark:text-gray-300 dark:border-gray-500/20`;
    }
  });

  dotClasses = computed(() => {
    const base = 'w-1.5 h-1.5 rounded-full';
    const s = this.status().toLowerCase();
    switch (s) {
      case 'open': return `${base} bg-blue-500 shadow-[0_0_4px_rgba(59,130,246,0.8)]`;
      case 'inprogress':
      case 'in progress':
      case 'in-progress': return `${base} bg-amber-500 shadow-[0_0_4px_rgba(245,158,11,0.8)]`;
      case 'resolved': return `${base} bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.8)]`;
      default: return `${base} bg-slate-400`;
    }
  });
}
