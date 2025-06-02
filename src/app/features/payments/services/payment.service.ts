import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
// import { ApiService } from '../../../core/services/api.service';

@Injectable({
  providedIn: 'root' // O provisto en el módulo de 'payments'
})
export class PaymentService {
  // private apiService: ApiService

  constructor(/* private apiService: ApiService */) {}

  // Mock para savePayment
  savePayment(paymentData: any): Observable<any> {
    console.log('PaymentService (MOCK): Guardando pago:', paymentData);

    // Simular un error si el monto es, por ejemplo, 13
    if (paymentData.monto === 13) {
        return throwError(() => new Error('Error simulado al guardar el pago (monto 13)')).pipe(delay(1000));
    }

    // Simular respuesta exitosa
    return of({ success: true, message: 'Pago registrado exitosamente (MOCK)', paymentId: Date.now() }).pipe(
      delay(2000) // Simular latencia
    );
  }

  // Otros métodos del servicio...
}