// src/app/features/vehicles/routes.ts
import { Routes } from '@angular/router';
import { VehicleListComponent } from './components/vehicle-list/vehicle-list.component';
import { VehicleFormComponent } from './components/vehicle-form/vehicle-form.component';

export const VEHICLE_ROUTES: Routes = [
  {
    path: '', // Lista de vehículos
    component: VehicleListComponent,
    title: 'Gestión de Vehículos'
  },
  {
    path: 'new', // Formulario para crear nuevo vehículo
    component: VehicleFormComponent,
    title: 'Registrar Nuevo Vehículo'
  },
  {
    path: 'edit/:id', // Formulario para editar un vehículo existente
    component: VehicleFormComponent,
    title: 'Editar Vehículo'
  },
  // Podrías tener una ruta para ver detalles si es diferente al formulario
  // {
  //   path: 'view/:id',
  //   component: VehicleDetailComponent, // Necesitarías crear este componente
  //   title: 'Detalle del Vehículo'
  // }
];