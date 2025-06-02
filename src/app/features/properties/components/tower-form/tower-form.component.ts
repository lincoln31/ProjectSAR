import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { switchMap, filter, tap } from 'rxjs/operators';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TextFieldModule } from '@angular/cdk/text-field'; // Para cdkTextareaAutosize

import { PropertyService } from '../../services/property.service';
// import { Tower } from '../../models/tower.model';

@Component({
  selector: 'app-tower-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    TextFieldModule
  ],
  templateUrl: './tower-form.component.html',
  styleUrls: ['./tower-form.component.scss']
})
export class TowerFormComponent implements OnInit, OnDestroy {
  towerForm!: FormGroup;
  isEditMode = false;
  towerId: string | number | null = null;
  isLoading = false;
  private subscriptions = new Subscription();

  constructor(
    private fb: FormBuilder,
    private propertyService: PropertyService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  initForm(): void {
    this.towerForm = this.fb.group({
      name: ['', Validators.required],
      identifier: [''],
      address: ['']
      // Agrega más campos si es necesario
    });
  }

  checkEditMode(): void {
    this.subscriptions.add(
      this.route.paramMap.pipe(
        filter(params => params.has('id')),
        tap(params => {
          this.isEditMode = true;
          this.towerId = params.get('id');
        }),
        switchMap(params => this.propertyService.getTowerById(params.get('id')!)) // Asegúrate que el servicio tenga este método
      ).subscribe({
        next: (towerData) => {
          if (towerData) {
            this.towerForm.patchValue(towerData);
          } else {
            this.snackBar.open('Torre no encontrada.', 'Cerrar', { duration: 3000 });
            this.router.navigate(['/app/properties']);
          }
        },
        error: (err) => {
          console.error('Error cargando datos de la torre:', err);
          this.snackBar.open('Error al cargar datos de la torre.', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/app/properties']);
        }
      })
    );
  }

  onSubmit(): void {
    if (this.towerForm.invalid) {
      this.towerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const towerData = this.towerForm.value;

    let operation$;
    if (this.isEditMode && this.towerId) {
      operation$ = this.propertyService.updateTower(this.towerId, towerData);
    } else {
      operation$ = this.propertyService.createTower(towerData);
    }

    this.subscriptions.add(
      operation$.subscribe({
        next: () => {
          this.isLoading = false;
          const message = this.isEditMode ? 'Torre actualizada correctamente.' : 'Torre creada correctamente.';
          this.snackBar.open(message, 'Cerrar', { duration: 3000 });
          this.router.navigate(['/app/properties']);
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error guardando torre:', err);
          this.snackBar.open('Error al guardar la torre.', 'Cerrar', { duration: 3000 });
        }
      })
    );
  }

  onCancel(): void {
    this.router.navigate(['/app/properties']);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}