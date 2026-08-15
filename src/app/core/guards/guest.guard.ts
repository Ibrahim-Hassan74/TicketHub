import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../services/account.service';

export const guestGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const router = inject(Router);
  
  const user = accountService.currentUser();
  
  if (user) {
    if (user.role === 'Admin') {
      return router.createUrlTree(['/dashboard']);
    }
    return router.createUrlTree(['/tickets']);
  }
  
  return true;
};
