import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router'; // ActivatedRoute para leer parámetros de ruta
import { CommonModule, Location } from '@angular/common'; // Location para "goBack"
import { Subscription } from 'rxjs';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'; // Necesario para MatDatepicker
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { UserData } from '../user-list/user-list.component'; // Reutilizar la interfaz
// import { UserService } from '../../services/user.service'; // Asumiendo que tendrás un servicio

interface Role {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-user-form',
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
    MatDatepickerModule,
    MatNativeDateModule, // Importante para el Datepicker
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit, OnDestroy {
  userForm!: FormGroup;
  isEditMode = false;
  userId: string | null = null;
  isLoading = false;
  private routeSubscription: Subscription | undefined;
  // private userSubscription: Subscription | undefined; // Para cargar datos del usuario en modo edición

  availableRoles: Role[] = [
    { value: 'RESIDENTE', viewValue: 'Residente' },
    { value: 'PROPIETARIO', viewValue: 'Propietario' },
    { value: 'ADMINISTRADOR', viewValue: 'Administrador' },
    // Añadir más roles según sea necesario
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location, // Para el botón de "Volver"
    private snackBar: MatSnackBar,
    // private userService: UserService // Descomentar cuando tengas el servicio
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.userId = id;
        this.loadUserData(id); // Cargar datos si estamos en modo edición
      }
    });
  }

  initForm(): void {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      idCard: ['', Validators.required],
      tower: ['', Validators.required],
      apartment: [''],
      email: ['', [Validators.email]],
      gender: [''], // Valor por defecto o el primero de las opciones
      birthDate: [null], // MatDatepicker funciona bien con null o Date
      role: ['', Validators.required] // Añadido campo de rol
    });
  }

  loadUserData(id: string): void {
    this.isLoading = true;
    // Simulación de carga de datos del usuario (reemplazar con llamada al servicio)
    console.log(`Cargando datos para el usuario ID: ${id}`);
    // this.userSubscription = this.userService.getUserById(id).subscribe({
    //   next: (user) => {
    //     if (user) {
    //       this.userForm.patchValue({
    //         ...user,
    //         birthDate: user.birthDate ? new Date(user.birthDate) : null // Asegurar que sea un objeto Date
    //       });
    //     } else {
    //       this.snackBar.open('Usuario no encontrado.', 'Cerrar', { duration: 3000 });
    //       this.router.navigate(['/app/users']);
    //     }
    //     this.isLoading = false;
    //   },
    //   error: (err) => {
    //     console.error('Error al cargar datos del usuario:', err);
    //     this.snackBar.open('Error al cargar datos del usuario.', 'Cerrar', { duration: 3000 });
    //     this.isLoading = false;
    //     this.router.navigate(['/app/users']);
    //   }
    // });

    // ---- INICIO SIMULACIÓN ----
    setTimeout(() => {
      const mockUser: (UserData & { birthDate?: string | Date, gender?: string }) | undefined = MOCK_USERS_FORM.find(u => u.id === id);
    
      if (mockUser) { // <--- VERIFICAR SI mockUser FUE ENCONTRADO
        this.userForm.patchValue({
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          idCard: mockUser.idCard,
          tower: mockUser.tower,
          apartment: mockUser.apartment,
          email: mockUser.email,
          gender: mockUser.gender,
          // Aseguramos que birthDate existe en mockUser antes de intentar convertirlo
          birthDate: mockUser.birthDate ? new Date(mockUser.birthDate as string | Date) : null, // <--- Cast explícito
          role: mockUser.role
        });
      } else {
        this.snackBar.open('Usuario no encontrado (simulado).', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/app/users']);
      }
      this.isLoading = false;
    }, 1000);
    // ---- FIN SIMULACIÓN ----
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched(); // Mostrar errores si los hay
      this.snackBar.open('Por favor, complete todos los campos requeridos.', 'Cerrar', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    const userData = this.userForm.value;
    // Formatear fecha si es necesario antes de enviar al backend
    // if (userData.birthDate) {
    //   userData.birthDate = (userData.birthDate as Date).toISOString().split('T')[0]; // Formato YYYY-MM-DD
    // }

    if (this.isEditMode && this.userId) {
      console.log('Actualizando usuario:', this.userId, userData);
      // Lógica para actualizar usuario (llamada al servicio)
      // this.userService.updateUser(this.userId, userData).subscribe({ ... });
      // ---- INICIO SIMULACIÓN ----
      setTimeout(() => {
        this.isLoading = false;
        this.snackBar.open('Usuario actualizado exitosamente (simulado).', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/app/users']);
      }, 1500);
      // ---- FIN SIMULACIÓN ----
    } else {
      console.log('Creando nuevo usuario:', userData);
      // Lógica para crear nuevo usuario (llamada al servicio)
      // this.userService.createUser(userData).subscribe({ ... });
      // ---- INICIO SIMULACIÓN ----
      setTimeout(() => {
        this.isLoading = false;
        this.snackBar.open('Usuario creado exitosamente (simulado).', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/app/users']);
      }, 1500);
      // ---- FIN SIMULACIÓN ----
    }
  }

  onCancel(): void {
    this.router.navigate(['/app/users']); // O usar this.location.back();
  }

  goBack(): void {
    this.location.back();
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    // if (this.userSubscription) {
    //   this.userSubscription.unsubscribe();
    // }
  }
}

// Mock de datos para el formulario (puede incluir más campos que la lista)
const MOCK_USERS_FORM: (UserData & { birthDate?: string | Date, gender?: string })[] = [
  { id: '1', firstName: 'Juan', lastName: 'Pérez', idCard: '8-123-456', email: 'juan.perez@gmail.com', tower: 'A', apartment: '301', role: 'RESIDENTE', birthDate: '1990-05-15', gender: 'masculino' },
  { id: '2', firstName: 'María', lastName: 'González', idCard: '9-876-543', email: 'maria.gonzalez@hotmail.com', tower: 'B', apartment: '205', role: 'PROPIETARIO', birthDate: '1985-11-20', gender: 'femenino' },
];