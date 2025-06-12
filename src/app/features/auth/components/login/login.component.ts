// src/app/features/auth/components/login/login.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { Router, RouterModule } from '@angular/router'; // RouterModule no se usa aquí directamente, Router tampoco si AuthService maneja la redirección
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

// Angular Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../../../core/services/auth.service';
import { LoginRequest } from '../../../../core/models/auth.model'; // Asegúrate de importar LoginRequest

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    // RouterModule, // No es necesario aquí si no hay routerLink directos en el template
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
  loginForm!: FormGroup; // Declarar la propiedad
  isLoading: boolean = false; // Declarar e inicializar la propiedad
  private authSubscription: Subscription | undefined;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      usernameOrEmail: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const credentials = this.loginForm.value as LoginRequest;

    this.authSubscription = this.authService.login(credentials).subscribe({
      next: () => {
        this.isLoading = false;
        // El AuthService maneja la redirección y el estado.
        // Podrías mostrar un snackbar de éxito aquí si lo deseas, aunque AuthService podría hacerlo.
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error en el componente de login:', error);
        // El ErrorInterceptor ya debería mostrar el snackbar de error.
      }
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}