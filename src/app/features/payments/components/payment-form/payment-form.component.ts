import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

// Angular Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'; // Necesario para MatDatepicker
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';



// Servicios (Asegúrate de crearlos o adaptarlos)
import { UserService } from '../../../users/services/user.service'; // O un servicio de Residentes
import { PaymentService } from '../../services/payment.service';
// import { User } from '../../../users/models/user.model'; // Define tu modelo de usuario/residente

interface ResidentData { // Define una interfaz simple para los datos del residente
  nombres: string;
  apellidos: string;
  cedula: string;
  torre?: string;
  apartamento?: string;
  correoElectronico?: string;
  // ... otros campos que puedas necesitar
}


@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatProgressBarModule,
    MatDividerModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.scss']
})
export class PaymentFormComponent implements OnInit, OnDestroy {
  paymentForm!: FormGroup;
  isSaving = false;
  isSearchingResident = false;
  private residentData: ResidentData | null = null; // Para guardar datos del residente encontrado
  private subscriptions: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private userService: UserService, // Inyecta tu servicio de usuarios/residentes
    private paymentService: PaymentService, // Inyecta tu servicio de pagos
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.paymentForm = this.fb.group({
      // Campos del residente (se llenarán después de la búsqueda)
      residentId: [null], // Guardaremos el ID del residente aquí
      nombres: [{ value: '', disabled: true }, Validators.required],
      apellidos: [{ value: '', disabled: true }, Validators.required],
      cedula: [{ value: '', disabled: true }, Validators.required],
      torre: [{ value: '', disabled: true }],
      apartamento: [{ value: '', disabled: true }],
      correoElectronico: [{ value: '', disabled: true }, Validators.email],

      // Campos del pago
      monto: ['', [Validators.required, Validators.min(0.01)]],
      fechaPago: [new Date(), Validators.required], // Por defecto hoy
      metodoPago: ['', Validators.required],
      referenciaPago: [''],
      observaciones: ['']
    });
  }

  searchResidentByCedula(cedula: string): void {
    if (!cedula?.trim()) {
      this.snackBar.open('Por favor, ingrese un número de cédula.', 'Cerrar', { duration: 3000 });
      return;
    }
    this.isSearchingResident = true;
    this.resetResidentFields(); // Limpiar campos antes de nueva búsqueda

    // Simulación de llamada al servicio (reemplaza con tu lógica real)
    const searchSub = this.userService.findUserByCedula(cedula.trim()) // Asume que tienes este método
      .pipe(finalize(() => this.isSearchingResident = false))
      .subscribe({
        next: (user) => { // Asume que 'user' tiene la estructura de ResidentData o similar
          if (user) {
            this.residentData = user; // Guardar datos completos si es necesario
            this.paymentForm.patchValue({
              residentId: user.id, // Asume que el usuario tiene un 'id'
              nombres: user.nombres,
              apellidos: user.apellidos,
              cedula: user.cedula,
              torre: user.torre,
              apartamento: user.apartamento,
              correoElectronico: user.correoElectronico
            });
            this.snackBar.open(`Residente ${user.nombres} ${user.apellidos} encontrado.`, 'OK', { duration: 3000 });
          } else {
            this.snackBar.open('No se encontró ningún residente con esa cédula.', 'Cerrar', { duration: 4000 });
          }
        },
        error: (err) => {
          console.error('Error buscando residente:', err);
          this.snackBar.open('Error al buscar residente. Intente de nuevo.', 'Cerrar', { duration: 4000 });
        }
      });
    this.subscriptions.add(searchSub);
  }

  private resetResidentFields(): void {
    this.residentData = null;
    this.paymentForm.patchValue({
      residentId: null,
      nombres: '',
      apellidos: '',
      cedula: '',
      torre: '',
      apartamento: '',
      correoElectronico: ''
    });
  }

  onSubmit(): void {
    if (!this.paymentForm.get('residentId')?.value) {
      this.snackBar.open('Por favor, busque y seleccione un residente primero.', 'Cerrar', { duration: 4000 });
      return;
    }

    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched(); // Mostrar errores de validación
      this.snackBar.open('Por favor, complete todos los campos requeridos.', 'Cerrar', { duration: 3000 });
      return;
    }

    this.isSaving = true;
    const paymentData = {
      ...this.paymentForm.getRawValue(), // getRawValue() para incluir campos deshabilitados si es necesario, o solo .value
      // Si los campos de residente no deben ir en el payload de pago, omítelos
      // y usa solo this.paymentForm.get('residentId').value
    };

    // Eliminar campos de residente si no son parte del DTO de pago, solo se necesita el ID
    const payload = {
        residentId: paymentData.residentId,
        monto: paymentData.monto,
        fechaPago: paymentData.fechaPago,
        metodoPago: paymentData.metodoPago,
        referenciaPago: paymentData.referenciaPago,
        observaciones: paymentData.observaciones,
    };


    const saveSub = this.paymentService.savePayment(payload) // Asume que tienes este método
      .pipe(finalize(() => this.isSaving = false))
      .subscribe({
        next: () => {
          this.snackBar.open('Pago registrado exitosamente!', 'OK', { duration: 3000, panelClass: ['success-snackbar'] });
          this.paymentForm.reset({ fechaPago: new Date() }); // Resetear formulario, mantener fecha de hoy
          this.resetResidentFields(); // Limpiar datos del residente
          // Considera navegar a otra página, ej. historial de pagos
          // this.router.navigate(['/app/payments/history']);
        },
        error: (err) => {
          console.error('Error guardando pago:', err);
          this.snackBar.open('Error al registrar el pago. Verifique los datos o intente más tarde.', 'Cerrar', { duration: 5000, panelClass: ['error-snackbar'] });
        }
      });
    this.subscriptions.add(saveSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}