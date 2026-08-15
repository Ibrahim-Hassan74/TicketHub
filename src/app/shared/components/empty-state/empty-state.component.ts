import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
        <lucide-icon [name]="icon()" class="w-8 h-8 text-gray-400 dark:text-gray-500"></lucide-icon>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
        {{ title() }}
      </h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">
        {{ message() }}
      </p>
      
      @if (actionLabel()) {
        <button 
          (click)="action.emit()"
          class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900">
          {{ actionLabel() }}
        </button>
      }
    </div>
  `
})
export class EmptyStateComponent {
  icon = input<string>('file-question');
  title = input<string>('No data found');
  message = input<string>('There is no data available to display at this time.');
  actionLabel = input<string | undefined>();
  
  action = output<void>();
}
