import { Routes } from '@angular/router';
import { TicketListComponent } from './ticket-list/ticket-list.component';

export const TICKETS_ROUTES: Routes = [
  {
    path: '',
    component: TicketListComponent
  }
];
