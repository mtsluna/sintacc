import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter, withRouterConfig} from '@angular/router';

import {routes} from './app.routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {spinnerInterceptor} from './interceptor/spinner.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes, withRouterConfig({
      onSameUrlNavigation: 'reload'   // 👈 forces reload on same URL
    })),
    provideHttpClient(
      withInterceptors([
        spinnerInterceptor
      ])),
  ]
};
