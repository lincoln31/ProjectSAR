// src/app/features/users/routes.ts
import { Routes } from '@angular/router';

export const USER_ROUTES: Routes = [
  {
    path: '', // Lista de usuarios (ej. /app/users)
    loadComponent: () => import('./components/user-list/user-list.component').then(c => c.UserListComponent),
    title: 'Gestión de Usuarios'
  },
  {
    path: 'new', // Formulario para crear nuevo usuario
    loadComponent: () => import('./components/user-form/user-form.component').then(c => c.UserFormComponent),
    title: 'Nuevo Usuario'
  },
  {
    path: 'edit/:id', // Formulario para editar un usuario existente (el :id es un parámetro de ruta)
    loadComponent: () => import('./components/user-form/user-form.component').then(c => c.UserFormComponent),
    title: 'Editar Usuario'
  },
  {
    path: 'profile/:id', // Vista de perfil de usuario (opcional, si es diferente al formulario de edición)
    loadComponent: () => import('./components/user-profile/user-profile.component').then(c => c.UserProfileComponent), // Necesitarías crear este componente
    title: 'Perfil de Usuario'
  }
  // Podrías tener rutas específicas para 'tenants' o 'owners' si la lógica es muy diferente
  // o manejarlos como parte del 'user-list' y 'user-form' con filtros o tipos.
];