import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// Angular Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter, MatNativeDateModule } from '@angular/material/core'; // Para el Datepicker
import { TextFieldModule } from '@angular/cdk/text-field'; // Para cdkTextareaAutosize

import { UserProfileService } from '../../services/user-profile.service';
import { UserProfileResponse, UserProfileRequest } from '../../../../core/models/user-profile.model';
import { AuthService } from '../../../../core/services/auth.service'; // Para obtener info del usuario actual si es necesario

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule, // Necesario para MatDatepicker
    TextFieldModule,     // Necesario para cdkTextareaAutosize
    MatSnackBarModule
  ],
  providers: [
    provideNativeDateAdapter() // Proveedor para MatNativeDateModule
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  profileForm!: FormGroup;
  userProfile: UserProfileResponse | null = null;
  isLoading: boolean = true;
  isSaving: boolean = false;
  loadError: string | null = null;

  private profileSubscription: Subscription | undefined;
  private updateSubscription: Subscription | undefined;

  constructor(
    private fb: FormBuilder,
    private userProfileService: UserProfileService,
    private snackBar: MatSnackBar,
    private authService: AuthService // Opcional, si necesitas el ID del usuario desde aquí
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadProfile();
  }

  initForm(profile?: UserProfileResponse | null): void {
    // Formatear la fecha para el datepicker si existe
    let birthDateFormatted: Date | null = null;
    if (profile?.birthDate) {
      // Asumimos que birthDate es 'YYYY-MM-DD'
      const parts = profile.birthDate.split('-');
      if (parts.length === 3) {
        birthDateFormatted = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      }
    }

    this.profileForm = this.fb.group({
      firstName: [profile?.firstName || '', Validators.required],
      lastName: [profile?.lastName || '', Validators.required],
      phoneNumber: [profile?.phoneNumber || ''],
      documentId: [profile?.documentId || ''],
      address: [profile?.address || ''],
      birthDate: [birthDateFormatted || null] // Usar el objeto Date o null
    });
  }

  loadProfile(): void {
    this.isLoading = true;
    this.loadError = null;
    this.profileSubscription = this.userProfileService.getMyProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
        this.initForm(profile); // Reinicializar el formulario con los datos cargados
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.loadError = err.message || 'No se pudo cargar el perfil.';
        this.isLoading = false;
        this.userProfile = null; // Asegurar que no hay perfil si hay error
        this.snackBar.open(this.loadError || 'Error desconocido.', 'Cerrar', { duration: 5000, panelClass: ['error-snackbar'] });
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid || !this.profileForm.dirty) {
      if (!this.profileForm.dirty) {
        this.snackBar.open('No hay cambios para guardar.', 'Cerrar', { duration: 3000 });
      }
      return;
    }

    this.isSaving = true;
    const formValues = this.profileForm.value;

    // Formatear la fecha de vuelta a 'YYYY-MM-DD' si se seleccionó una
    let birthDateString: string | undefined = undefined;
    if (formValues.birthDate && formValues.birthDate instanceof Date) {
      const date = formValues.birthDate as Date;
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2); // Meses son 0-indexados
      const day = ('0' + date.getDate()).slice(-2);
      birthDateString = `${year}-${month}-${day}`;
    }


    const profileData: UserProfileRequest = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      phoneNumber: formValues.phoneNumber || undefined,
      documentId: formValues.documentId || undefined,
      address: formValues.address || undefined,
      birthDate: birthDateString
    };

    this.updateSubscription = this.userProfileService.updateMyProfile(profileData).subscribe({
      next: (updatedProfile) => {
        this.userProfile = updatedProfile;
        this.initForm(updatedProfile); // Actualizar formulario con datos guardados
        this.profileForm.markAsPristine(); // Marcar como no modificado
        this.isSaving = false;
        this.snackBar.open('Perfil actualizado exitosamente.', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      },
      error: (err) => {
        console.error('Error updating profile:', err);
        this.isSaving = false;
        const errorMessage = err.error?.message || err.message || 'No se pudo actualizar el perfil.';
        this.snackBar.open(errorMessage, 'Cerrar', { duration: 5000, panelClass: ['error-snackbar'] });
      }
    });
  }

  ngOnDestroy(): void {
    this.profileSubscription?.unsubscribe();
    this.updateSubscription?.unsubscribe();
  }
}