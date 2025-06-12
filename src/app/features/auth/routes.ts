import { Routes } from '@angular/router';
                                                                                                                                
export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(c => c.LoginComponent),
    title: 'Iniciar Sesión'
  },
  { // AÑADIR ESTA RUTA
    path: 'register',
    loadComponent: () => import('./components/register/register.component').then(c => c.RegisterComponent),
    title: 'Registro de Usuario'
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];