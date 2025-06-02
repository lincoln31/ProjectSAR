// src/app/features/vehicles/components/vehicle-form/vehicle-form.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { Subscription } from 'rxjs';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Asegúrate que esté
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';

import { VehicleData, VehicleTypeOption } from '../vehicle-list/vehicle-list.component'; // Reutilizar interfaces
// import { VehicleService } from '../../services/vehicle.service';
// import { UserService } from '../../../users/services/user.service'; // Para buscar residente



// Definición de la interfaz ANTES de la clase
interface ResidentSearchResult {
  id: string;
  firstName: string;
  lastName: string;
  idCard: string; // Cambiado de ownerIdCard para coincidir con el uso en findResidentByCedula
  tower: string;
  apartment?: string;
  email?: string;
}

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatSelectModule,
    MatProgressSpinnerModule, // Asegúrate que esté en imports
    MatSnackBarModule,
    MatDividerModule
  ],
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.scss']
})
export class VehicleFormComponent implements OnInit, OnDestroy {
  // --- DECLARACIÓN DE PROPIEDADES DE LA CLASE ---
  vehicleForm!: FormGroup;
  isEditMode = false;
  vehicleId: string | null = null;
  isLoading = false; // Propiedad general de carga para el formulario
  isLoadingResident = false;
  residentFound = false;
  residentSearched = false;
  private routeSubscription: Subscription | undefined;
  private residentSearchSubscription: Subscription | undefined;
  // private vehicleDataSubscription: Subscription | undefined; // Si la necesitas

  availableVehicleTypes: VehicleTypeOption[] = [
    { value: 'automovil', viewValue: 'Automóvil', icon: 'directions_car' },
    { value: 'motocicleta', viewValue: 'Motocicleta', icon: 'two_wheeler' },
    
    { value: 'otro', viewValue: 'Otro', icon: 'commute' }
  ];
  // --- FIN DECLARACIÓN DE PROPIEDADES ---


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private snackBar: MatSnackBar,
    // private vehicleService: VehicleService,
    // private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initForm(); // Llama a initForm para crear el FormGroup
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.vehicleId = id;
        this.residentFound = true;
        // Deshabilitar campos del residente, pero permitir ver la cédula
        // this.vehicleForm.get('ownerIdCard')?.disable(); // Se deshabilita en disableResidentFields
        this.loadVehicleData(id);
      } else {
        this.enableResidentFields();
      }
    });
  }

  initForm(): void {
    this.vehicleForm = this.fb.group({
      ownerId: [null],
      ownerFirstName: [{ value: '', disabled: false }, Validators.required],
      ownerLastName: [{ value: '', disabled: false }, Validators.required],
      ownerIdCard: [{ value: '', disabled: false }, Validators.required], // Asegúrate que este control exista
      tower: [{ value: '', disabled: false }, Validators.required],
      apartment: [{ value: '', disabled: false }],
      ownerEmail: [{ value: '', disabled: false }, [Validators.email]],
      plate: ['', [Validators.required, Validators.pattern(/^[A-Z]{3}-\d{3,4}$|^[A-Z]{2}\d{3}[A-Z]{1}$/i)]],
      type: ['', Validators.required],
      brand: [''],
      model: [''],
      color: [''],
      status: ['activo', Validators.required]
    });
  }

  // --- COMIENZO DE findResidentByCedula (adaptado) ---
  findResidentByCedula(cedula: string): void {
    if (!cedula.trim()) {
      this.snackBar.open('Por favor, ingrese una cédula.', 'Cerrar', { duration: 3000 });
      return;
    }
    this.isLoadingResident = true;
    this.residentSearched = true;
    this.residentFound = false; // Resetear antes de buscar
    console.log(`Buscando residente con cédula: ${cedula}`);

    setTimeout(() => {
      let foundResidentData: ResidentSearchResult | null = null;
      if (cedula === "12345") {
        foundResidentData = { id: 'user1', firstName: "Ana", lastName: "Gomez", idCard: "12345", tower: "C", apartment: "101", email: "ana@g.com" };
      } else if (cedula === "67890") {
        foundResidentData = { id: 'user2', firstName: "Luis", lastName: "Paz", idCard: "67890", tower: "A", apartment: "202", email: "luis@p.com" };
      }

      if (foundResidentData) {
        this.vehicleForm.patchValue({
          ownerId: foundResidentData.id,
          ownerFirstName: foundResidentData.firstName,
          ownerLastName: foundResidentData.lastName,
          ownerIdCard: foundResidentData.idCard, // Usar idCard de la interfaz
          tower: foundResidentData.tower,
          apartment: foundResidentData.apartment,
          ownerEmail: foundResidentData.email
        });
        this.disableResidentFields();
        this.residentFound = true;
        this.snackBar.open('Residente encontrado.', 'Cerrar', { duration: 2000 });
      } else {
        this.snackBar.open('Residente no encontrado. Puede ingresar los datos manualmente.', 'Cerrar', { duration: 4000 });
        this.enableResidentFields(); // Habilitar campos para ingreso manual
        this.vehicleForm.patchValue({ // Limpiar campos del residente excepto la cédula buscada
            ownerId: null, ownerFirstName: '', ownerLastName: '',
            tower: '', apartment: '', ownerEmail: ''
            // Mantener ownerIdCard con la cédula buscada si se desea
        });
        this.vehicleForm.get('ownerIdCard')?.setValue(cedula); // Rellenar la cédula buscada
      }
      this.isLoadingResident = false;
    }, 1500);
  }
  // --- FIN DE findResidentByCedula ---


  disableResidentFields(): void {
    this.vehicleForm.get('ownerFirstName')?.disable();
    this.vehicleForm.get('ownerLastName')?.disable();
    this.vehicleForm.get('ownerIdCard')?.disable();
    this.vehicleForm.get('tower')?.disable();
    this.vehicleForm.get('apartment')?.disable();
    this.vehicleForm.get('ownerEmail')?.disable();
  }

  enableResidentFields(): void {
    // Solo habilitar si no estamos en modo edición de un vehículo existente
    // o si explícitamente se quiere cambiar el residente.
    if (!this.isEditMode || !this.residentFound) {
        this.vehicleForm.get('ownerFirstName')?.enable();
        this.vehicleForm.get('ownerLastName')?.enable();
        this.vehicleForm.get('ownerIdCard')?.enable();
        this.vehicleForm.get('tower')?.enable();
        this.vehicleForm.get('apartment')?.enable();
        this.vehicleForm.get('ownerEmail')?.enable();
    }
  }

  resetResidentSearch(): void {
    this.residentFound = false;
    this.residentSearched = false;
    this.enableResidentFields();
    this.vehicleForm.patchValue({
        ownerId: null, ownerFirstName: '', ownerLastName: '', ownerIdCard: '',
        tower: '', apartment: '', ownerEmail: ''
    });
    // Opcional: Limpiar también el campo de búsqueda de cédula en el HTML si tienes una referencia a él.
  }

  // --- COMIENZO DE onSubmit (adaptado) ---
  onSubmit(): void {
    if (!this.isEditMode && !this.residentFound) {
        this.snackBar.open('Por favor, busque y seleccione un residente antes de guardar el vehículo.', 'Cerrar', { duration: 4000 });
        return;
    }

    if (this.vehicleForm.invalid) { // Si residentFound, los campos del dueño están disabled, así que getRawValue() podría ser necesario si quieres sus valores
      this.vehicleForm.markAllAsTouched();
      this.snackBar.open('Por favor, complete todos los campos requeridos correctamente.', 'Cerrar', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    // Usar getRawValue() para obtener todos los valores, incluyendo los deshabilitados (datos del residente)
    const vehicleDataToSend = this.vehicleForm.getRawValue();

    if (this.isEditMode && this.vehicleId) {
      console.log('Actualizando vehículo:', this.vehicleId, vehicleDataToSend);
      setTimeout(() => {
        this.isLoading = false;
        this.snackBar.open('Vehículo actualizado exitosamente (simulado).', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/app/vehicles']);
      }, 1500);
    } else {
      console.log('Creando nuevo vehículo:', vehicleDataToSend);
      setTimeout(() => {
        this.isLoading = false;
        this.snackBar.open('Vehículo creado exitosamente (simulado).', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/app/vehicles']);
      }, 1500);
    }
  }
  // --- FIN DE onSubmit ---

  // --- COMIENZO DE loadVehicleData (adaptado) ---
  loadVehicleData(id: string): void {
    this.isLoading = true;
    console.log(`Cargando datos para el vehículo ID: ${id}`);
    setTimeout(() => {
      const MOCK_VEHICLES_FORM: (VehicleData & {ownerIdCard?: string, ownerEmail?: string, ownerId?: string})[] = [
        { id: 'v1', ownerId: 'user1', ownerFirstName: 'Juan', ownerLastName: 'Pérez', ownerIdCard: '123', tower: 'A', apartment: '301', ownerEmail: 'j@p.com', plate: 'ABD-123', type: 'automovil', status: 'activo', brand: 'Toyota', model: 'Corolla', color: 'Rojo' },
        { id: 'v2', ownerId: 'user2', ownerFirstName: 'María', ownerLastName: 'González', ownerIdCard: '456', tower: 'B', apartment: '205', ownerEmail: 'm@g.com', plate: 'XYZ-789', type: 'camioneta', status: 'activo', brand: 'Ford', model: 'Explorer', color: 'Azul' },
      ];
      const vehicle = MOCK_VEHICLES_FORM.find(v => v.id === id);
      if (vehicle) {
        this.vehicleForm.patchValue(vehicle); // patchValue no actualiza controles deshabilitados
        // Por lo tanto, si los campos del dueño están deshabilitados por defecto en modo edición,
        // necesitas habilitarlos temporalmente, aplicar patchValue, y luego deshabilitarlos de nuevo,
        // o asegurarte de que se inicializan con { value: '', disabled: true } en initForm si es editMode.
        // La lógica actual en ngOnInit ya maneja esto al llamar a disableResidentFields.
        if(this.isEditMode) {
            this.disableResidentFields();
        }
      } else {
        this.snackBar.open('Vehículo no encontrado (simulado).', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/app/vehicles']);
      }
      this.isLoading = false;
    }, 1000);
  }
  // --- FIN DE loadVehicleData ---

  toUpperCase(event: Event, controlName: string): void {
    const inputElement = event.target as HTMLInputElement;
    const upperValue = inputElement.value.toUpperCase();
    this.vehicleForm.get(controlName)?.setValue(upperValue, { emitEvent: false });
    inputElement.value = upperValue;
  }

  onCancel(): void {
    this.router.navigate(['/app/vehicles']);
  }

  goBack(): void {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
    this.residentSearchSubscription?.unsubscribe();
    // this.vehicleDataSubscription?.unsubscribe();
  }
  
}