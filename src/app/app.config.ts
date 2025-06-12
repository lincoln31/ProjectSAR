import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations'; // O BrowserAnimationsModule

import { routes } from './app.routes';
import { AuthInterceptor } from './core/interceptors/auth.interceptor'; // Ahora existe
import { ErrorInterceptor } from './core/interceptors/error.interceptor'; // Ahora existe

// Si algunos módulos de Material son necesarios globalmente o para componentes no standalone
// import { MatNativeDateModule } from '@angular/material/core';
// import { MatSnackBarModule } from '@angular/material/snack-bar';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideAnimations(),
    provideHttpClient(
      withInterceptorsFromDi(),
      withFetch()
    ),
    // Proveedores para los interceptors
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    // ... otros providers que puedas tener
  ]
};