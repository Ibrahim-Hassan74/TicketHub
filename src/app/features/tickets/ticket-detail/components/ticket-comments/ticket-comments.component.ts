import { Component, input, output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentResponse } from '../../../../../shared/models/comment';
import { RelativeTimePipe } from '../../../../../shared/pipes/relative-time.pipe';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-ticket-comments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RelativeTimePipe, LucideAngularModule],
  templateUrl: './ticket-comments.component.html'
})
export class TicketCommentsComponent {
  comments = input.required<CommentResponse[]>();
  isSubmitting = input<boolean>(false);
  visibleCount = signal(5);
  
  addComment = output<string>();

  showMore() {
    this.visibleCount.update(c => c + 5);
  }

  showLess() {
    this.visibleCount.update(c => Math.max(5, c - 5));
  }

  private fb = inject(FormBuilder);
  commentForm = this.fb.group({ content: ['', Validators.required] });

  submit() {
    if (this.commentForm.invalid) return;
    this.addComment.emit(this.commentForm.value.content!);
    this.commentForm.reset();
  }
}
