import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'relativeTime',
  standalone: true
})
export class RelativeTimePipe implements PipeTransform {
  transform(value: string | Date | null | undefined): string {
    if (!value) return '';

    const date = new Date(value);
    if (isNaN(date.getTime())) return '';

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60 && diffInSeconds >= 0) return 'Just now';

    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    
    // For future dates, let Intl handle it normally
    const sign = diffInSeconds > 0 ? -1 : 1;
    const absDiff = Math.abs(diffInSeconds);

    const minutes = absDiff / 60;
    if (minutes < 60) return rtf.format(sign * Math.floor(minutes), 'minute');

    const hours = minutes / 60;
    if (hours < 24) return rtf.format(sign * Math.floor(hours), 'hour');

    const days = hours / 24;
    if (days < 30) return rtf.format(sign * Math.floor(days), 'day');

    const months = days / 30;
    if (months < 12) return rtf.format(sign * Math.floor(months), 'month');

    const years = days / 365;
    return rtf.format(sign * Math.floor(years), 'year');
  }
}
