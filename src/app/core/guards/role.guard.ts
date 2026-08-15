import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AccountService } from '../services/account.service';

export function roleGuard(allowedRoles: string | string[]): CanActivateFn {
  return () => {
    const accountService = inject(AccountService);
    const router = inject(Router);
    const currentUser = accountService.currentUser();
    
    if (!currentUser) {
      return router.createUrlTree(['/auth/login']);
    }

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    if (currentUser.role && roles.includes(currentUser.role)) {
      return true;
    }

    if (currentUser.role === 'Admin') {
      return router.createUrlTree(['/dashboard']);
    }
    
    return router.createUrlTree(['/tickets']);
  };
}
