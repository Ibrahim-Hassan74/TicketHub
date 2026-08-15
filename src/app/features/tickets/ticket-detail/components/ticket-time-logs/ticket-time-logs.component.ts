import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TimeEntryResponse } from '../../../../../shared/models/time-entry';
import { DurationPipe } from '../../../../../shared/pipes/duration.pipe';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-ticket-time-logs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DurationPipe, LucideAngularModule],
  templateUrl: './ticket-time-logs.component.html'
})
export class TicketTimeLogsComponent {
  timeEntries = input.required<TimeEntryResponse[]>();
  totalTimeMinutes = input.required<number>();
  canLogTime = input.required<boolean>();
  isSubmitting = input<boolean>(false);
  
  addTimeEntry = output<{ durationMinutes: number, description: string }>();

  private fb = inject(FormBuilder);
  timeForm = this.fb.group({ 
    durationMinutes: [0, [Validators.required, Validators.min(1)]],
    description: ['', Validators.required]
  });

  submit() {
    if (this.timeForm.invalid) return;
    const val = this.timeForm.value;
    this.addTimeEntry.emit({
      durationMinutes: val.durationMinutes!,
      description: val.description!
    });
  }

  resetForm() {
    this.timeForm.reset({ durationMinutes: 0 });
  }
}
