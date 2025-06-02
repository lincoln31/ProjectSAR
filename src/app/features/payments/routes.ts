// src/app/features/payments/routes.ts
import { Routes } from '@angular/router';

export const PAYMENT_ROUTES: Routes = [
  {
    path: '', // <-- Ruta base para la sección de pagos
    redirectTo: 'history', // Redirige a la sub-ruta del historial
    pathMatch: 'full'
  },
  {
    path: 'history', // <-- Esta será la vista principal de historial
    loadComponent: () => import('./components/transaction-history/transaction-history.component').then(c => c.TransactionHistoryComponent),
    title: 'Historial de Pagos' // Cambiado para ser más general
  },
  {
    path: 'list', // Si aún quieres una "lista de pagos" separada del historial
    loadComponent: () => import('./components/payment-list/payment-list.component').then(c => c.PaymentListComponent),
    title: 'Lista de Pagos'
  },
  {
    path: 'new',
    loadComponent: () => import('./components/payment-form/payment-form.component').then(c => c.PaymentFormComponent),
    title: 'Registrar Nuevo Pago'
  },
  {
    path: 'edit/:id', // Editar un pago (si aplica)
    loadComponent: () => import('./components/payment-form/payment-form.component').then(c => c.PaymentFormComponent),
    title: 'Editar Pago'
  },
  {
    path: 'history', // Historial de transacciones
    loadComponent: () => import('./components/transaction-history/transaction-history.component').then(c => c.TransactionHistoryComponent),
    title: 'Historial de Transacciones'
  },
  {
    path: 'user/:userId', // Pagos de un usuario específico
    loadComponent: () => import('./components/user-payments/user-payments.component').then(c => c.UserPaymentsComponent), // Necesitarías crear este componente
    title: 'Pagos de Usuario'
  }
];