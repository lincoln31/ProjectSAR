import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
// import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // Para confirmación de borrado

import { PropertyService } from '../../services/property.service'; // Asumiendo que tienes este servicio
// import { Tower } from '../../models/tower.model'; // Modelo para Torre
// import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component'; // Si tienes un diálogo de confirmación

interface Tower { // Modelo temporal
  id: string | number;
  name: string;
  identifier?: string;
  address?: string;
  numberOfApartments?: number;
}

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSnackBarModule,
    // MatDialogModule
  ],
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.scss']
})
export class PropertyListComponent implements OnInit, OnDestroy {
  towers: Tower[] = [];
  isLoading = false;
  private propertySubscription: Subscription | undefined;

  constructor(
    private propertyService: PropertyService,
    private router: Router,
    private snackBar: MatSnackBar,
    // private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadTowers();
  }

  loadTowers(): void {
    this.isLoading = true;
    // Simulación, reemplaza con la llamada real al servicio
    this.propertySubscription = this.propertyService.getTowers().subscribe({
      next: (data) => {
        this.towers = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando torres:', err);
        this.isLoading = false;
        this.snackBar.open('Error al cargar las torres.', 'Cerrar', { duration: 3000 });
      }
    });
  }

  goToAddTower(): void {
    this.router.navigate(['/app/properties/towers/new']);
  }

  editTower(towerId: string | number): void {
    this.router.navigate(['/app/properties/towers/edit', towerId]);
  }

  viewApartments(towerId: string | number): void {
    // Aquí decides cómo manejar esto:
    // 1. Navegar a una nueva ruta que liste apartamentos para esta torre (ej. /app/properties/towers/:id/apartments)
    // 2. Mostrar los apartamentos en esta misma página (más complejo de gestionar el estado)
    this.snackBar.open(`Navegando a apartamentos de la torre ${towerId} (implementar)`, 'OK', { duration: 2000 });
    // Ejemplo de navegación: this.router.navigate(['/app/properties/towers', towerId, 'apartments']);
  }

  deleteTower(towerId: string | number, towerName: string): void {
    // Implementar diálogo de confirmación antes de borrar
    // const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    //   data: { message: `¿Está seguro de que desea eliminar la torre "${towerName}"? Esta acción no se puede deshacer.` }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.isLoading = true; // Podrías tener un spinner específico para la tarjeta
    //     this.propertyService.deleteTower(towerId).subscribe({
    //       next: () => {
    //         this.snackBar.open(`Torre "${towerName}" eliminada correctamente.`, 'Cerrar', { duration: 3000 });
    //         this.loadTowers(); // Recargar la lista
    //       },
    //       error: (err) => {
    //         this.isLoading = false;
    //         console.error('Error eliminando torre:', err);
    //         this.snackBar.open('Error al eliminar la torre.', 'Cerrar', { duration: 3000 });
    //       }
    //     });
    //   }
    // });
     this.snackBar.open(`Confirmar eliminación de "${towerName}" (implementar diálogo)`, 'OK', { duration: 3000 });
     // Simulación de borrado para prueba
     // this.towers = this.towers.filter(t => t.id !== towerId);
  }

  ngOnDestroy(): void {
    if (this.propertySubscription) {
      this.propertySubscription.unsubscribe();
    }
  }
}