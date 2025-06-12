import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service'; // Asegúrate que la ruta sea correcta
import { MatSnackBar } from '@angular/material/snack-bar'; // Para mostrar notificaciones

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Ocurrió un error desconocido.';

        if (error.error instanceof ErrorEvent) {
          // Error del lado del cliente o de red
          errorMessage = `Error del cliente: ${error.error.message}`;
        } else {
          // El backend devolvió un código de error
          switch (error.status) {
            case 400: // Bad Request
              // Intenta obtener el mensaje del cuerpo del error si está disponible
              errorMessage = error.error?.message || 'Petición incorrecta. Por favor, verifica los datos enviados.';
              break;
            case 401: // Unauthorized
              errorMessage = 'Tu sesión ha expirado o no estás autorizado. Por favor, inicia sesión de nuevo.';
              this.authService.logout(); // Desloguear al usuario y redirigir
              break;
            case 403: // Forbidden
              errorMessage = 'No tienes permiso para realizar esta acción.';
              // Podrías redirigir a una página de "acceso denegado"
              // this.router.navigate(['/unauthorized']);
              break;
            case 404: // Not Found
              errorMessage = 'El recurso solicitado no fue encontrado.';
              break;
            case 500: // Internal Server Error
              errorMessage = 'Error interno del servidor. Por favor, inténtalo más tarde.';
              break;
            case 0: // Error de conexión (CORS, red caída, etc.)
               errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión o inténtalo más tarde.';
               break;
            default:
              // Intenta obtener un mensaje más específico del backend
              errorMessage = error.error?.message || `Error ${error.status}: ${error.message}`;
          }
        }

        // Mostrar el mensaje de error usando MatSnackBar
        this.snackBar.open(errorMessage, 'CERRAR', {
          duration: 7000, // Duración en milisegundos
          panelClass: ['error-snackbar'], // Clase CSS para estilizar el snackbar de error
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });

        return throwError(() => new Error(errorMessage)); // Propagar un error para que el suscriptor también lo maneje si es necesario
      })
    );
  }
}