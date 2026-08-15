import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration',
  standalone: true
})
export class DurationPipe implements PipeTransform {
  transform(value: number | string | null | undefined): string {
    if (value == null || value === '') return '0m';
    
    let minutes = Number(value);
    if (isNaN(minutes)) return '0m';
    
    if (minutes < 0) minutes = 0;

    const h = Math.floor(minutes / 60);
    const m = Math.floor(minutes % 60);

    if (h > 0 && m > 0) {
      return `${h}h ${m}m`;
    } else if (h > 0) {
      return `${h}h`;
    } else {
      return `${m}m`;
    }
  }
}
