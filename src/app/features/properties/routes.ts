// src/app/features/properties/routes.ts
import { Routes } from '@angular/router';

export const PROPERTY_ROUTES: Routes = [
  {
    path: '', // Lista de propiedades/torres (ej. /app/properties)
    loadComponent: () => import('./components/property-list/property-list.component').then(c => c.PropertyListComponent),
    title: 'Gestión de Propiedades'
  },
  {
    path: 'towers/new', // Formulario para crear nueva torre
    loadComponent: () => import('./components/tower-form/tower-form.component').then(c => c.TowerFormComponent), // Necesitarías crear este componente
    title: 'Nueva Torre'
  },
  {
    path: 'towers/edit/:id', // Formulario para editar torre
    loadComponent: () => import('./components/tower-form/tower-form.component').then(c => c.TowerFormComponent),
    title: 'Editar Torre'
  },
  {
    path: 'apartments/new/:towerId', // Formulario para crear nuevo apartamento, asociado a una torre
    loadComponent: () => import('./components/apartment-form/apartment-form.component').then(c => c.ApartmentFormComponent), // Necesitarías crear este componente
    title: 'Nuevo Apartamento'
  },
  {
    path: 'apartments/edit/:id', // Formulario para editar apartamento
    loadComponent: () => import('./components/apartment-form/apartment-form.component').then(c => c.ApartmentFormComponent),
    title: 'Editar Apartamento'
  }
  // Podrías tener una vista de detalle para torres o apartamentos también.
];