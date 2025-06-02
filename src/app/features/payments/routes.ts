// src/app/features/payments/routes.ts
import { Routes } from '@angular/router';

export const PAYMENT_ROUTES: Routes = [
  {
    path: '', // Lista de pagos o dashboard de pagos (ej. /app/payments)
    loadComponent: () => import('./components/payment-list/payment-list.component').then(c => c.PaymentListComponent),
    title: 'Gestión de Pagos'
  },
  {
    path: 'new', // Registrar un nuevo pago
    loadComponent: () => import('./components/payment-form/payment-form.component').then(c => c.PaymentFormComponent),
    title: 'Registrar Pago'
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