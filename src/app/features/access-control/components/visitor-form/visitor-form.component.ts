import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

// Angular Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core'; // O MAT_DATE_LOCALE si necesitas i18n
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// import { AccessControlService } from '../../services/access-control.service'; // Necesitarás este servicio

@Component({
  selector: 'app-visitor-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  providers: [
    provideNativeDateAdapter() // Necesario para MatDatepicker
  ],
  templateUrl: './visitor-form.component.html',
  styleUrls: ['./visitor-form.component.scss']
})
export class VisitorFormComponent implements OnInit, OnDestroy {
  visitorForm!: FormGroup;
  isLoading = false;
  private serviceSubscription: Subscription | undefined;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    // private accessControlService: AccessControlService // Descomentar cuando el servicio esté listo
  ) {}

  ngOnInit(): void {
    this.visitorForm = this.fb.group({
      fullName: ['', Validators.required],
      phone: ['', Validators.required], // Podrías añadir Validators.pattern para el formato del teléfono
      residentToVisit: [''],
      tower: ['', Validators.required],
      apartment: [''],
      entryDate: [null, Validators.required], // MatDatepicker devuelve un objeto Date
      entryHour: ['', [Validators.required, Validators.min(0), Validators.max(23)]],
      entryMinute: ['', [Validators.required, Validators.min(0), Validators.max(59)]]
    });
  }

  onSubmit(): void {
    if (this.visitorForm.invalid) {
      this.visitorForm.markAllAsTouched(); // Mostrar errores de validación
      this.snackBar.open('Por favor, complete todos los campos requeridos.', 'Cerrar', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    const formValue = this.visitorForm.value;

    // Combinar fecha y hora para enviar al backend (si es necesario)
    const entryDate = new Date(formValue.entryDate);
    entryDate.setHours(parseInt(formValue.entryHour, 10));
    entryDate.setMinutes(parseInt(formValue.entryMinute, 10));

    const visitorData = {
      fullName: formValue.fullName,
      phone: formValue.phone,
      residentToVisit: formValue.residentToVisit,
      tower: formValue.tower,
      apartment: formValue.apartment,
      entryDateTime: entryDate.toISOString() // Enviar como ISO string o como prefiera tu backend
    };

    console.log('Datos del visitante a enviar:', visitorData);

    // Simulación de llamada al servicio (reemplazar con la real)
    // this.serviceSubscription = this.accessControlService.registerVisitor(visitorData).subscribe({
    //   next: () => {
    //     this.isLoading = false;
    //     this.snackBar.open('Visitante registrado exitosamente!', 'Cerrar', { duration: 3000, panelClass: ['success-snackbar'] });
    //     this.visitorForm.reset();
    //     // Considera redirigir o limpiar el formulario más a fondo
    //   },
    //   error: (err) => {
    //     this.isLoading = false;
    //     console.error('Error al registrar visitante:', err);
    //     this.snackBar.open('Error al registrar visitante. Intente nuevamente.', 'Cerrar', { duration: 5000, panelClass: ['error-snackbar'] });
    //   }
    // });

    // Por ahora, solo simulamos y reseteamos
    setTimeout(() => {
      this.isLoading = false;
      this.snackBar.open('Visitante registrado (simulación)!', 'Cerrar', { duration: 3000, panelClass: ['success-snackbar'] });
      this.visitorForm.reset();
      // Object.keys(this.visitorForm.controls).forEach(key => { // Para limpiar errores también
      //   this.visitorForm.get(key)?.setErrors(null) ;
      // });
    }, 1500);
  }

  ngOnDestroy(): void {
    if (this.serviceSubscription) {
      this.serviceSubscription.unsubscribe();
    }
  }
}
