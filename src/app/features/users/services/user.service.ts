import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
// import { ApiService } from '../../../core/services/api.service'; // Cuando integres API real

// Define una interfaz simple para los datos del residente si no la tienes
export interface ResidentData {
  id: string; // o number
  nombres: string;
  apellidos: string;
  cedula: string;
  torre?: string;
  apartamento?: string;
  correoElectronico?: string;
}

@Injectable({
  providedIn: 'root' // O provisto en el módulo de 'users' si no es global
})
export class UserService {
  // private apiService: ApiService // Descomentar para API real

  constructor(/* private apiService: ApiService */) {}

  // Mock para findUserByCedula
  findUserByCedula(cedula: string): Observable<ResidentData | null> {
    console.log(`UserService (MOCK): Buscando cédula ${cedula}`);
    // Simular una base de datos mock
    const mockResidents: ResidentData[] = [
      { id: '1', nombres: 'Juan Alberto', apellidos: 'Pérez Gómez', cedula: '123456789', torre: 'A', apartamento: '101', correoElectronico: 'juan.perez@email.com' },
      { id: '2', nombres: 'Maria Fernanda', apellidos: 'López Días', cedula: '987654321', torre: 'B', apartamento: '202', correoElectronico: 'maria.lopez@email.com' },
    ];

    const foundResident = mockResidents.find(r => r.cedula === cedula);

    if (cedula === '000000000') { // Simular un error
        return throwError(() => new Error('Error simulado en la búsqueda de cédula')).pipe(delay(1000));
    }

    return of(foundResident || null).pipe(delay(1500)); // Simular latencia
  }

  // Otros métodos del servicio...
}