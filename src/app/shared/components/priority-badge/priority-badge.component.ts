import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-priority-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="badgeClasses()">
      <span [class]="dotClasses()"></span>
      {{ priorityText() }}
    </span>
  `
})
export class PriorityBadgeComponent {
  priority = input<string>('Low');

  priorityText = computed(() => {
    const p = this.priority();
    if (!p) return 'Unknown';
    return p.charAt(0).toUpperCase() + p.slice(1);
  });

  badgeClasses = computed(() => {
    const base = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border shadow-sm transition-all duration-300';
    const p = this.priority().toLowerCase();

    switch (p) {
      case 'low':
        return `${base} bg-slate-50/80 text-slate-600 border-slate-200/60 dark:bg-slate-500/10 dark:text-slate-300 dark:border-slate-500/20`;
      case 'medium':
        return `${base} bg-sky-50/80 text-sky-700 border-sky-200/60 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20 hover:shadow-sky-500/10 hover:border-sky-300`;
      case 'high':
        return `${base} bg-orange-50/80 text-orange-700 border-orange-200/60 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20 hover:shadow-orange-500/10 hover:border-orange-300`;
      case 'critical':
        return `${base} bg-rose-50/80 text-rose-700 border-rose-200/60 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20 hover:shadow-rose-500/10 hover:border-rose-300 animate-pulse`;
      default:
        return `${base} bg-gray-50/80 text-gray-600 border-gray-200/60 dark:bg-gray-500/10 dark:text-gray-300 dark:border-gray-500/20`;
    }
  });

  dotClasses = computed(() => {
    const base = 'w-1.5 h-1.5 rounded-full';
    const p = this.priority().toLowerCase();
    switch (p) {
      case 'low': return `${base} bg-slate-400`;
      case 'medium': return `${base} bg-sky-500 shadow-[0_0_4px_rgba(14,165,233,0.8)]`;
      case 'high': return `${base} bg-orange-500 shadow-[0_0_4px_rgba(249,115,22,0.8)]`;
      case 'critical': return `${base} bg-rose-600 shadow-[0_0_6px_rgba(225,29,72,0.9)]`;
      default: return `${base} bg-slate-400`;
    }
  });
}
