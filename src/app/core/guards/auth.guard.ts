import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Crearemos este servicio
import { map, take } from 'rxjs/operators';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Usaremos un BehaviorSubject en AuthService para el estado de autenticación
  return authService.isAuthenticated$.pipe(
    take(1), // Tomar solo el primer valor y completar
    map(isAuthenticated => {
      if (isAuthenticated) {
        // Aquí podrías añadir lógica de roles si es necesario para esta ruta base
        // const userRole = authService.getUserRole();
        // if (route.data?.['role'] && route.data?.['role'].indexOf(userRole) === -1) {
        //   router.navigate(['/unauthorized']); // O a una página de acceso denegado
        //   return false;
        // }
        return true;
      } else {
        router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
        return false;
      }
    })
  );
};
