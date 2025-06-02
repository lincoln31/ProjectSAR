// src/app/features/vehicles/routes.ts
import { Routes } from '@angular/router';

export const VEHICLE_ROUTES: Routes = [
  {
    path: '', // Lista de vehículos registrados (ej. /app/vehicles)
    loadComponent: () => import('./components/vehicle-list/vehicle-list.component').then(c => c.VehicleListComponent),
    title: 'Gestión de Vehículos'
  },
  {
    path: 'new', // Registrar un nuevo vehículo
    loadComponent: () => import('./components/vehicle-form/vehicle-form.component').then(c => c.VehicleFormComponent),
    title: 'Registrar Vehículo'
  },
  {
    path: 'edit/:id', // Editar información de un vehículo
    loadComponent: () => import('./components/vehicle-form/vehicle-form.component').then(c => c.VehicleFormComponent),
    title: 'Editar Vehículo'
  }
];