import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations'; // O BrowserAnimationsModule

import { routes } from './app.routes';

// Si algunos módulos de Material son necesarios globalmente o para componentes no standalone
// import { MatNativeDateModule } from '@angular/material/core';
// import { MatSnackBarModule } from '@angular/material/snack-bar';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()), // Habilita binding de inputs desde rutas
    provideHttpClient(withInterceptorsFromDi()),       // Para usar HttpClient e interceptores
    provideAnimations(),                               // Para animaciones de Angular Material

    // Ejemplo si necesitaras MatNativeDateModule globalmente (para date pickers)
    // importProvidersFrom(MatNativeDateModule),
    // Ejemplo para MatSnackBar si no lo importas en cada componente/servicio que lo usa
    // importProvidersFrom(MatSnackBarModule)
  ]
};