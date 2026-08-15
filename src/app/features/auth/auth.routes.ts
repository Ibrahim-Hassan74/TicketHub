import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { guestGuard } from '../../core/guards/guest.guard';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [guestGuard],
    title: 'Login — TicketHub'
  }
];
