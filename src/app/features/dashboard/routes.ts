// src/app/features/dashboard/routes.ts
import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '', // La ruta base de 'dashboard' (ej. /app/dashboard)
    // Asumiendo que generaste DashboardMainComponent
    loadComponent: () => import('./components/dashboard-main/dashboard-main.component').then(c => c.DashboardMainComponent),
    title: 'Dashboard Principal'
  }
  // Puedes añadir más sub-rutas al dashboard si es necesario
  // {
  //   path: 'summary',
  //   loadComponent: () => import('./components/dashboard-summary/dashboard-summary.component').then(c => c.DashboardSummaryComponent),
  //   title: 'Resumen del Dashboard'
  // }
];