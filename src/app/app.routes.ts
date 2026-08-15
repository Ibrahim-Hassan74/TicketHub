import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { inject } from '@angular/core';
import { AccountService } from './core/services/account.service';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: () => {
      const accountService = inject(AccountService);
      const user = accountService.currentUser();
      if (user?.role === 'Admin') {
        return '/dashboard';
      }
      return '/tickets';
    }
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./core/layout/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      {
        path: 'dashboard',
        canActivate: [roleGuard('Admin')],
        loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
      },
      {
        path: 'tickets',
        loadChildren: () => import('./features/tickets/tickets.routes').then(m => m.TICKETS_ROUTES)
      },
      {
        path: 'tickets/new',
        loadChildren: () => import('./features/tickets/ticket-create/ticket-create.routes').then(m => m.TICKET_CREATE_ROUTES)
      },
      {
        path: 'tickets/:id',
        loadChildren: () => import('./features/tickets/ticket-detail/ticket-detail.routes').then(m => m.TICKET_DETAIL_ROUTES)
      },
      {
        path: 'users',
        canActivate: [roleGuard('Admin')],
        loadChildren: () => import('./features/users/users.routes').then(m => m.USERS_ROUTES)
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/tickets'
  }
];

