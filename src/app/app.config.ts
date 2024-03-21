import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), provideAnimationsAsync('noop'),
    provideAnimations(), provideToastr(), provideHttpClient(withFetch()), provideAnimationsAsync(),
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }
  ]
};
