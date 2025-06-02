// src/app/shared/layouts/admin-layout/admin-layout.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu'; // <--- AÑADE ESTA LÍNEA
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule // <--- AÑADE MatMenuModule AQUÍ
  ],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent {
  isSidenavOpen = true;

  navItems = [
    { label: 'Dashboard', icon: 'dashboard', route: '/app/dashboard' },
    { label: 'Usuarios', icon: 'people', route: '/app/users' },
    { label: 'Propiedades', icon: 'home_work', route: '/app/properties' },
    { label: 'Pagos', icon: 'payment', route: '/app/payments' },
    { label: 'Vehículos', icon: 'directions_car', route: '/app/vehicles' },
    { label: 'Control de Acceso', icon: 'security', route: '/app/access-control' },
  ];

  constructor(private authService: AuthService, private router: Router) {} // Inyecta Router
  goToDashboard(): void {
    this.router.navigate(['/app/dashboard']);
  }

  toggleSidenav(): void {
    this.isSidenavOpen = !this.isSidenavOpen;
  }

  logout(): void {
    this.authService.logout();
  }
}