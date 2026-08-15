import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

import { TicketService } from '../../../core/services/ticket.service';
import { AccountService } from '../../../core/services/account.service';
import { UserService } from '../../../core/services/user.service';
import { UiFeedbackService } from '../../../core/services/ui-feedback.service';

import { TicketHeaderComponent } from './components/ticket-header/ticket-header.component';
import { TicketCommentsComponent } from './components/ticket-comments/ticket-comments.component';
import { TicketTimelineComponent } from './components/ticket-timeline/ticket-timeline.component';
import { TicketTimeLogsComponent } from './components/ticket-time-logs/ticket-time-logs.component';
import { TicketSidebarComponent } from './components/ticket-sidebar/ticket-sidebar.component';
import { TicketResponse, TicketStatus, TicketPriority } from '../../../shared/models/ticket';
import { CommentResponse } from '../../../shared/models/comment';
import { ActivityResponse } from '../../../shared/models/activity';
import { TimeEntryResponse } from '../../../shared/models/time-entry';
import { AgentSummary } from '../../../shared/models/user';

type Tab = 'comments' | 'timeline' | 'time';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    LucideAngularModule,
    TicketHeaderComponent,
    TicketCommentsComponent,
    TicketTimelineComponent,
    TicketTimeLogsComponent,
    TicketSidebarComponent
  ],
  templateUrl: './ticket-detail.component.html'
})
export class TicketDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ticketService = inject(TicketService);
  private accountService = inject(AccountService);
  private userService = inject(UserService);
  private uiFeedback = inject(UiFeedbackService);


  currentUser = this.accountService.currentUser;

  ticketId = signal<string>('');
  ticket = signal<TicketResponse | null>(null);
  isLoading = signal<boolean>(true);

  // Tabs Data
  activeTab = signal<Tab>('comments');
  comments = signal<CommentResponse[]>([]);
  activities = signal<ActivityResponse[]>([]);
  timeEntries = signal<TimeEntryResponse[]>([]);
  totalTimeMinutes = signal<number>(0);

  // Agents for assignment
  agents = signal<AgentSummary[]>([]);

  // UI States
  isSubmittingComment = signal(false);
  isSubmittingTime = signal(false);
  isChangingStatus = signal(false);
  isChangingPriority = signal(false);
  isAssigning = signal(false);

  priorityOptions: TicketPriority[] = ['Low', 'Medium', 'High', 'Critical'];

  availableStatusOptions = computed(() => {
    const role = this.currentUser()?.role;
    if (role === 'SupportAgent') {
      return ['Open', 'InProgress', 'Resolved'] as TicketStatus[];
    }
    return ['Open', 'InProgress', 'Resolved', 'Closed'] as TicketStatus[];
  });

  canViewTimeEntries = computed(() => {
    const role = this.currentUser()?.role;
    return role === 'Admin' || role === 'SupportAgent';
  });

  canLogTime = computed(() => {
    const user = this.currentUser();
    const t = this.ticket();
    return user?.role === 'SupportAgent' && t?.assignedAgentId === user.id;
  });

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.ticketId.set(id);
        this.loadTicketData();
      }
    });

    if (this.currentUser()?.role === 'Admin') {
      this.loadAgents();
    }
  }

  loadTicketData() {
    if (!this.ticket()) {
      this.isLoading.set(true);
    }
    const id = this.ticketId();
    this.ticketService.getTicket(id).subscribe({
      next: (t) => {
        this.ticket.set(t);
        this.loadComments();
        this.loadActivities();
        if (this.canViewTimeEntries()) {
          this.loadTimeEntries();
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.uiFeedback.error('Failed to load ticket details.');
        this.router.navigate(['/tickets']);
      }
    });
  }

  loadAgents() {
    this.userService.getAgents().subscribe({
      next: (agents) => this.agents.set(agents)
    });
  }

  loadComments() {
    this.ticketService.getComments(this.ticketId()).subscribe({
      next: (res) => this.comments.set(res)
    });
  }

  loadActivities() {
    this.ticketService.getActivities(this.ticketId()).subscribe({
      next: (res) => this.activities.set(res)
    });
  }

  loadTimeEntries() {
    this.ticketService.getTimeEntries(this.ticketId()).subscribe({
      next: (res) => {
        this.timeEntries.set(res.entries);
        this.totalTimeMinutes.set(res.totalDurationMinutes);
      }
    });
  }

  setTab(tab: Tab) {
    this.activeTab.set(tab);
  }

  submitComment(content: string) {
    this.isSubmittingComment.set(true);
    this.ticketService.addComment(this.ticketId(), { content }).subscribe({
      next: () => {
        this.loadComments();
        this.loadActivities(); // Reload activities too, since a comment might appear in the timeline
        this.isSubmittingComment.set(false);
      },
      error: () => {
        this.uiFeedback.error('Failed to add comment.');
        this.isSubmittingComment.set(false);
      }
    });
  }

  submitTimeEntry(val: { durationMinutes: number, description: string }) {
    this.isSubmittingTime.set(true);
    
    const req = {
      workDate: new Date().toISOString().split('T')[0],
      durationMinutes: val.durationMinutes,
      description: val.description
    };

    this.ticketService.addTimeEntry(this.ticketId(), req).subscribe({
      next: () => {
        this.loadTimeEntries();
        this.isSubmittingTime.set(false);
        this.uiFeedback.success('Time entry logged.');
      },
      error: () => {
        this.uiFeedback.error('Failed to log time.');
        this.isSubmittingTime.set(false);
      }
    });
  }

  changeStatus(status: TicketStatus) {
    const t = this.ticket();
    if (!t || t.status === status) return;

    this.uiFeedback.confirm(`Are you sure you want to change status to ${status}?`, 'Change Status').then(confirmed => {
      if (confirmed) {
        this.isChangingStatus.set(true);
        this.ticketService.changeStatus(t.id, { status }).subscribe({
          next: () => {
            this.uiFeedback.success('Status updated.');
            this.loadTicketData();
            this.isChangingStatus.set(false);
          },
          error: () => {
            this.uiFeedback.error('Failed to change status.');
            this.isChangingStatus.set(false);
          }
        });
      }
    });
  }

  changePriority(priority: TicketPriority) {
    const t = this.ticket();
    if (!t || t.priority === priority) return;

    this.isChangingPriority.set(true);
    this.ticketService.changePriority(t.id, { priority }).subscribe({
      next: () => {
        this.uiFeedback.success('Priority updated.');
        this.loadTicketData();
        this.isChangingPriority.set(false);
      },
      error: () => {
        this.uiFeedback.error('Failed to change priority.');
        this.isChangingPriority.set(false);
      }
    });
  }

  assignAgent(agentId: string) {
    if (!agentId || agentId === this.ticket()?.assignedAgentId) return;

    this.isAssigning.set(true);
    this.ticketService.assignAgent(this.ticketId(), { agentId }).subscribe({
      next: () => {
        this.uiFeedback.success('Agent assigned.');
        this.loadTicketData();
        this.isAssigning.set(false);
      },
      error: () => {
        this.uiFeedback.error('Failed to assign agent.');
        this.isAssigning.set(false);
      }
    });
  }

  closeTicketCustomer() {
    const t = this.ticket();
    if (!t) return;
    this.uiFeedback.confirm('Are you sure you want to close this ticket?', 'Close Ticket').then(confirmed => {
      if (confirmed) {
        this.ticketService.changeStatus(t.id, { status: 'Closed' }).subscribe({
          next: () => {
            this.uiFeedback.success('Ticket closed.');
            this.loadTicketData();
          },
          error: () => this.uiFeedback.error('Failed to close ticket.')
        });
      }
    });
  }

  reopenTicketCustomer() {
    const t = this.ticket();
    if (!t) return;
    this.uiFeedback.confirm('Are you sure you want to reopen this ticket?', 'Reopen Ticket').then(confirmed => {
      if (confirmed) {
        this.ticketService.changeStatus(t.id, { status: 'Open' }).subscribe({
          next: () => {
            this.uiFeedback.success('Ticket reopened.');
            this.loadTicketData();
          },
          error: () => this.uiFeedback.error('Failed to reopen ticket.')
        });
      }
    });
  }
}
