// src/app/features/access-control/routes.ts
import { Routes } from '@angular/router';

export const ACCESS_CONTROL_ROUTES: Routes = [
  {
    path: '', // Esta es la ruta que se carga con /app/access-control
    loadComponent: () => import('./components/visitor-form/visitor-form.component').then(c => c.VisitorFormComponent),
    title: 'Registrar Visita' // Cambia el título si es necesario
  },
  {
    path: 'log', // Una sub-ruta para el log de visitas
    loadComponent: () => import('./components/visitor-log/visitor-log.component').then(c => c.VisitorLogComponent),
    title: 'Log de Visitas'
  },
  {
    path: 'family-members/manage/:userId', // Gestionar familiares de un residente específico
    loadComponent: () => import('./components/family-member-form/family-member-form.component').then(c => c.FamilyMemberFormComponent),
    title: 'Gestionar Familiares'
  },
  {
    path: 'log', // Una sub-ruta para el log de visitas
    loadComponent: () => import('./components/visitor-log/visitor-log.component').then(c => c.VisitorLogComponent),
    title: 'Log de Visitas'
  },
  // Podrías tener una lista de visitantes frecuentes, etc.
];