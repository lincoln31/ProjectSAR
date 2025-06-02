import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // Para *ngIf, *ngFor
import { Subscription } from 'rxjs';

// Angular Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // Para notificaciones

import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup; // El ! indica que se inicializará en ngOnInit
  isLoading = false;
  private authSubscription: Subscription | undefined;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]], // Ejemplo: añadir validador de email
      password: ['', [Validators.required, Validators.minLength(6)]] // Ejemplo: mínimo 6 caracteres
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      // Marcar todos los campos como tocados para mostrar errores si es necesario
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const credentials = this.loginForm.value;

    // Usamos el mock del AuthService por ahora
    this.authSubscription = this.authService.login(credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        // La navegación ya la maneja el AuthService en su mock
        // this.router.navigate(['/app/dashboard']);
        this.snackBar.open('Login exitoso!', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar'] // Clase para estilizar (opcional)
        });
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error en el login:', error);
        this.snackBar.open('Error en el login: Usuario o contraseña incorrectos.', 'Cerrar', {
          duration: 5000,
          panelClass: ['error-snackbar'] // Clase para estilizar (opcional)
        });
      }
    });
  }

  ngOnDestroy(): void {
    // Desuscribirse para evitar fugas de memoria
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}