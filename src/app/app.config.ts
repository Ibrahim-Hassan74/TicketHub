import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { lucideIconsConfig } from './core/configs/lucide-icons.config';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { AccountService } from './core/services/account.service';

export function initializeApp(accountService: AccountService) {
  return () => accountService.initializeUser();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom(lucideIconsConfig),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AccountService],
      multi: true,
    }
  ],
};
