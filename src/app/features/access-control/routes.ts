// src/app/features/access-control/routes.ts
import { Routes } from '@angular/router';

export const ACCESS_CONTROL_ROUTES: Routes = [
  {
    path: '', // Dashboard o log de acceso (ej. /app/access-control)
    loadComponent: () => import('./components/visitor-log/visitor-log.component').then(c => c.VisitorLogComponent),
    title: 'Control de Acceso'
  },
  {
    path: 'visitors/register', // Registrar un nuevo visitante
    loadComponent: () => import('./components/visitor-form/visitor-form.component').then(c => c.VisitorFormComponent), // Necesitarías crear este componente
    title: 'Registrar Visitante'
  },
  {
    path: 'family-members/manage/:userId', // Gestionar familiares de un residente específico
    loadComponent: () => import('./components/family-member-form/family-member-form.component').then(c => c.FamilyMemberFormComponent),
    title: 'Gestionar Familiares'
  }
  // Podrías tener una lista de visitantes frecuentes, etc.
];