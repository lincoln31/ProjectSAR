// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard'; // Crearemos este guardia pronto
import { AdminLayoutComponent } from './shared/layouts/admin-layout/admin-layout.component'; // Crearemos este layout
// import { PublicLayoutComponent } from './shared/layouts/public-layout/public-layout.component'; // Si tienes un layout para páginas públicas

export const routes: Routes = [
  {
    path: 'auth',
    // component: PublicLayoutComponent, // Opcional, si la página de login tiene un layout diferente
    loadChildren: () => import('./features/auth/routes').then(m => m.AUTH_ROUTES)
    // Ejemplo de ruta de login si no es lazy loaded o no tiene su propio layout:
    // { path: 'login', loadComponent: () => import('./features/auth/components/login/login.component').then(c => c.LoginComponent) },
  },
  {
    path: 'app', // Un prefijo común para las rutas protegidas
    component: AdminLayoutComponent, // Todas las rutas hijas usarán este layout
    canActivate: [AuthGuard], // Proteger estas rutas
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/routes').then(m => m.DASHBOARD_ROUTES)
        // O si es un solo componente:
        // loadComponent: () => import('./features/dashboard/components/dashboard-main/dashboard-main.component').then(c => c.DashboardMainComponent)
      },
      {
        path: 'users',
        loadChildren: () => import('./features/users/routes').then(m => m.USER_ROUTES)
      },
      {
        path: 'properties',
        loadChildren: () => import('./features/properties/routes').then(m => m.PROPERTY_ROUTES)
      },
      {
        path: 'payments',
        loadChildren: () => import('./features/payments/routes').then(m => m.PAYMENT_ROUTES)
      },
      {
        path: 'vehicles',
        loadChildren: () => import('./features/vehicles/routes').then(m => m.VEHICLE_ROUTES)
      },
      {
        path: 'access-control',
        loadChildren: () => import('./features/access-control/routes').then(m => m.ACCESS_CONTROL_ROUTES)
      },
      // {
      //   path: 'events',
      //   loadChildren: () => import('./features/events-communication/routes').then(m => m.EVENTS_ROUTES)
      // },
      // ... más rutas de features
    ]
  },
  // Redirecciones por defecto
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' }, // O a 'app/dashboard' si quieres intentar ir directo si ya hay sesión
  { path: '**', redirectTo: 'auth/login' } // O a una página 'NotFoundComponent'
];