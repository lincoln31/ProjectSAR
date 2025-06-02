import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    // Asumiendo que ya generaste el LoginComponent standalone
    loadComponent: () => import('./components/login/login.component').then(c => c.LoginComponent),
    title: 'Iniciar Sesión' // Título para la pestaña del navegador (opcional)
  },
  // {
  //   path: 'register',
  //   loadComponent: () => import('./components/register/register.component').then(c => c.RegisterComponent),
  //   title: 'Registro'
  // },
  // {
  //   path: 'forgot-password',
  //   loadComponent: () => import('./components/forgot-password/forgot-password.component').then(c => c.ForgotPasswordComponent),
  //   title: 'Recuperar Contraseña'
  // },
  {
    path: '', // Ruta por defecto dentro de 'auth', redirige a login
    redirectTo: 'login',
    pathMatch: 'full'
  }
];