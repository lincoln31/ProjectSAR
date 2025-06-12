import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router'; // RouterModule para routerLink si es necesario
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// Angular Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select'; // Para los enums
import { MatCardModule } from '@angular/material/card'; // Para enmarcar el formulario
import { MatToolbarModule } from '@angular/material/toolbar'; // Para el título
import { MatIconModule } from '@angular/material/icon'; // Para el botón de volver

import { VehicleService } from '../../services/vehicle.service';
import { VehicleRequest } from '../../../../core/models/vehicle.model';
import { VehicleType, VehicleStatus } from '../../../../core/models/vehicle.enums';
// Necesitaremos un servicio para obtener usuarios si queremos un selector de propietarios
// import { UserService } from '../../../users/services/user.service'; // Asumiendo que existe
// import { AppUser } from '../../../../core/models/auth.model';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule, // Para el botón de "Volver"
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.scss']
})
export class VehicleFormComponent implements OnInit, OnDestroy {
  vehicleForm!: FormGroup;
  isEditMode: boolean = false;
  vehicleId: number | null = null;
  isLoading: boolean = false; // Para carga inicial en modo edición
  isSaving: boolean = false;

  // Para poblar los mat-select
  vehicleTypes = Object.values(VehicleType);
  vehicleStatuses = Object.values(VehicleStatus);
  // owners: AppUser[] = []; // Para el selector de propietarios

  private routeSubscription: Subscription | undefined;
  private vehicleSubscription: Subscription | undefined;
  private saveSubscription: Subscription | undefined;

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    // private userService: UserService, // Descomentar si usas selector de propietarios
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();

    // Por ahora, solo modo creación. La lógica de edición la añadiremos después.
    // this.routeSubscription = this.route.paramMap.subscribe(params => {
    //   const id = params.get('id');
    //   if (id) {
    //     this.isEditMode = true;
    //     this.vehicleId = +id; // Convertir a número
    //     // this.loadVehicleData(); // Lo implementaremos después
    //   } else {
    //     this.isEditMode = false;
    //     // this.loadOwners(); // Cargar propietarios para el selector
    //   }
    // });

    // Si necesitas cargar propietarios para el selector en modo creación:
    // this.loadOwners();
  }

  initForm(vehicle?: VehicleRequest): void { // Usamos VehicleRequest para el formulario
    this.vehicleForm = this.fb.group({
      plate: [vehicle?.plate || '', [Validators.required, Validators.maxLength(10)]],
      type: [vehicle?.type || null, Validators.required],
      brand: [vehicle?.brand || '', Validators.maxLength(50)],
      model: [vehicle?.model || '', Validators.maxLength(50)],
      color: [vehicle?.color || '', Validators.maxLength(30)],
      status: [vehicle?.status || null, Validators.required],
      ownerUserId: [vehicle?.ownerUserId || null, Validators.required] // Por ahora un input numérico
    });
  }

  // loadOwners(): void { // Ejemplo si tuvieras un selector de propietarios
  //   this.isLoading = true;
  //   this.userService.getAllUsersSimpleList().subscribe({ // Asume que tienes este método en UserService
  //     next: (users) => {
  //       this.owners = users;
  //       this.isLoading = false;
  //     },
  //     error: (err) => {
  //       console.error('Error loading owners', err);
  //       this.isLoading = false;
  //       this.snackBar.open('Error al cargar la lista de propietarios.', 'Cerrar', { duration: 3000 });
  //     }
  //   });
  // }

  onSubmit(): void {
    if (this.vehicleForm.invalid) {
      this.vehicleForm.markAllAsTouched();
      this.snackBar.open('Por favor, complete todos los campos requeridos.', 'Cerrar', { duration: 3000 });
      return;
    }

    this.isSaving = true;
    const vehicleData = this.vehicleForm.value as VehicleRequest;

    // Lógica para modo creación (la de edición vendrá después)
    this.saveSubscription = this.vehicleService.createVehicle(vehicleData).subscribe({
      next: (createdVehicle) => {
        this.isSaving = false;
        this.snackBar.open(`Vehículo ${createdVehicle.plate} registrado exitosamente.`, 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/app/vehicles']); // Volver a la lista de vehículos
      },
      error: (err) => {
        this.isSaving = false;
        // El ErrorInterceptor ya debería manejar el mensaje principal
        console.error('Error creating vehicle:', err);
        // Podrías añadir un mensaje específico si el ErrorInterceptor no es suficiente
        // const errorMessage = err.error?.message || 'Error al registrar el vehículo.';
        // this.snackBar.open(errorMessage, 'Cerrar', { duration: 5000, panelClass: ['error-snackbar'] });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/app/vehicles']); // O a donde quieras volver
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
    this.vehicleSubscription?.unsubscribe();
    this.saveSubscription?.unsubscribe();
  }
}