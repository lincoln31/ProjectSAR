// src/app/features/properties/services/property.service.ts
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
// import { ApiService } from '../../../core/services/api.service';
// import { Tower, Apartment } from '../models'; // Tus modelos

interface Tower { id: string | number; name: string; identifier?: string; address?: string; numberOfApartments?: number; } // Temporal
interface Apartment { id: string | number; apartmentNumber: string; towerId: string | number; floor?: number; } // Temporal

@Injectable({
  providedIn: 'root' // O específico del feature si prefieres
})
export class PropertyService {
  private mockTowers: Tower[] = [
    { id: 't1', name: 'Torre del Sol', identifier: 'A', address: 'Calle Falsa 123', numberOfApartments: 50 },
    { id: 't2', name: 'Torre Luna', identifier: 'B', address: 'Avenida Siempre Viva 742', numberOfApartments: 30 },
  ];
  private mockApartments: Apartment[] = [
    { id: 'a1', apartmentNumber: '101', towerId: 't1', floor: 1 },
    { id: 'a2', apartmentNumber: '102', towerId: 't1', floor: 1 },
    { id: 'a3', apartmentNumber: 'A-201', towerId: 't2', floor: 2 },
  ];

  constructor(/*private apiService: ApiService*/) {}

  getTowers(): Observable<Tower[]> {
    // return this.apiService.get<Tower[]>('/towers');
    return of(this.mockTowers).pipe(delay(500));
  }

  getTowerById(id: string | number): Observable<Tower | undefined> {
    // return this.apiService.get<Tower>(`/towers/${id}`);
    const tower = this.mockTowers.find(t => t.id === id);
    return of(tower).pipe(delay(300));
  }

  createTower(towerData: Omit<Tower, 'id'>): Observable<Tower> {
    // return this.apiService.post<Tower>('/towers', towerData);
    const newTower: Tower = { ...towerData, id: `t${Date.now()}`, numberOfApartments: 0 };
    this.mockTowers.push(newTower);
    return of(newTower).pipe(delay(500));
  }

  updateTower(id: string | number, towerData: Partial<Tower>): Observable<Tower | undefined> {
    // return this.apiService.put<Tower>(`/towers/${id}`, towerData);
    const index = this.mockTowers.findIndex(t => t.id === id);
    if (index > -1) {
      this.mockTowers[index] = { ...this.mockTowers[index], ...towerData };
      return of(this.mockTowers[index]).pipe(delay(500));
    }
    return throwError(() => new Error('Torre no encontrada para actualizar'));
  }

  deleteTower(id: string | number): Observable<void> {
    // return this.apiService.delete<void>(`/towers/${id}`);
    this.mockTowers = this.mockTowers.filter(t => t.id !== id);
    return of(undefined).pipe(delay(500));
  }

  // Métodos para apartamentos (similares)
  getApartmentsByTower(towerId: string | number): Observable<Apartment[]> {
    const apartments = this.mockApartments.filter(a => a.towerId === towerId);
    return of(apartments).pipe(delay(300));
  }
  // createApartment, updateApartment, getApartmentById, deleteApartment
}