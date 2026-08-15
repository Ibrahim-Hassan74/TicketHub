import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { TicketService } from '../../../core/services/ticket.service';
import { UiFeedbackService } from '../../../core/services/ui-feedback.service';
import { TicketPriority } from '../../../shared/models/ticket';

@Component({
  selector: 'app-ticket-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LucideAngularModule],
  templateUrl: './ticket-create.component.html'
})
export class TicketCreateComponent {
  private fb = inject(FormBuilder);
  private ticketService = inject(TicketService);
  private router = inject(Router);
  private uiFeedback = inject(UiFeedbackService);

  isSubmitting = false;
  isLoading = signal(true);

  ngOnInit() {
    // Fake loading delay to show premium entrance animation
    setTimeout(() => this.isLoading.set(false), 400);
  }

  ticketForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    description: ['', [Validators.required, Validators.maxLength(4000)]],
    priority: ['Medium' as TicketPriority, Validators.required]
  });

  priorityOptions: { value: TicketPriority, label: string }[] = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' },
    { value: 'Critical', label: 'Critical' }
  ];

  onSubmit() {
    if (this.ticketForm.invalid) {
      this.ticketForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formValue = this.ticketForm.value;

    this.ticketService.createTicket({
      title: formValue.title!,
      description: formValue.description!,
      priority: formValue.priority!
    }).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.uiFeedback.success('Ticket created successfully!');
        this.router.navigate(['/tickets', res.id]);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.uiFeedback.error('Failed to create ticket. Please try again.');
      }
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.ticketForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
