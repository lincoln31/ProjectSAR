import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; // RouterModule para routerLink
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

// Angular Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon'; // Para el icono de mostrar/ocultar contraseña
import { MatCheckboxModule } from '@angular/material/checkbox'; // Si usas checkboxes para roles

import { AuthService } from '../../../../core/services/auth.service';
import { RegisterRequest } from '../../../../core/models/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule, // Necesario para routerLink en el template
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatIconModule,
    MatCheckboxModule // Añadir si usas checkboxes para roles
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm!: FormGroup;
  isLoading: boolean = false;
  hidePassword = true;
  private authSubscription: Subscription | undefined;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
      firstName: ['', [Validators.required, Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.maxLength(100)]],
      phone: ['', [Validators.maxLength(20)]], // Opcional
      // roles: this.fb.group({ // Ejemplo si usaras checkboxes para roles
      //   roleAdmin: [false],
      //   roleResidente: [true] // Por defecto marcado
      // })
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    
    // Preparar los datos para enviar, incluyendo el manejo de roles si es necesario
    const formValues = this.registerForm.value;
    const userData: RegisterRequest = {
      username: formValues.username,
      email: formValues.email,
      password: formValues.password,
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      phone: formValues.phone || undefined, // Enviar undefined si está vacío para que no se mande ""
      // roles: this.mapRoles(formValues.roles) // Lógica para mapear roles si los tienes
    };
    
    // Si no manejas roles explícitamente en el formulario, puedes omitir el campo 'roles'
    // o enviar un array vacío/rol por defecto si tu backend lo espera.
    // Tu DTO tiene `private Set<String> roles;` así que espera un array de strings.
    // Podrías añadir un campo de selección o checkboxes para esto.
    // Por ahora, lo omito para simplificar. Si tu backend lo requiere, hay que añadirlo.
    // Ejemplo si quisieras enviar un rol por defecto:
    // userData.roles = ['RESIDENTE'];


    this.authSubscription = this.authService.register(userData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.snackBar.open(response.message || '¡Registro exitoso!', 'Cerrar', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/auth/login']); // Redirigir a login después del registro
      },
      error: (error) => {
        this.isLoading = false;
        // El ErrorInterceptor ya debería mostrar el error principal.
        // Aquí podrías loguear o manejar errores específicos del formulario de registro si es necesario.
        console.error('Error en el componente de registro:', error);
        if (error.error && error.error.message) {
             // Si el error interceptor no lo muestra como quieres, puedes mostrarlo aquí
            // this.snackBar.open(error.error.message, 'Cerrar', { duration: 7000, panelClass: ['error-snackbar'] });
        }
      }
    });
  }

  // mapRoles(rolesFormValue: any): string[] { // Ejemplo si tuvieras checkboxes para roles
  //   const selectedRoles: string[] = [];
  //   if (rolesFormValue.roleAdmin) selectedRoles.push('ADMIN'); // O el nombre exacto de tu rol
  //   if (rolesFormValue.roleResidente) selectedRoles.push('RESIDENTE');
  //   return selectedRoles;
  // }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}