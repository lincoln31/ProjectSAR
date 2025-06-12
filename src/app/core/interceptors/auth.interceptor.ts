import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service'; // Asegúrate que la ruta sea correcta

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const authToken = this.authService.getToken();

    // No añadir token a las rutas de autenticación o si no hay token
    if (request.url.includes('/api/v1/auth/') || !authToken) {
      return next.handle(request);
    }

    // Clonar la solicitud para añadir la nueva cabecera de autorización
    const authReq = request.clone({
      headers: request.headers.set('Authorization', `Bearer ${authToken}`)
    });

    // Enviar la solicitud clonada con la cabecera de autorización al siguiente manejador
    return next.handle(authReq);
  }
}