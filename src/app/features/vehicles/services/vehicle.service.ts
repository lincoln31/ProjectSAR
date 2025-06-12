import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiService } from '../../../core/services/api.service';
import { VehicleRequest, VehicleResponse, VehicleFilterParams, Page } from '../../../core/models/vehicle.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private basePath = '/api/v1/vehicles';

  constructor(private apiService: ApiService) {}

  createVehicle(vehicleData: VehicleRequest): Observable<VehicleResponse> {
    return this.apiService.post<VehicleResponse>(this.basePath, vehicleData);
  }

  getVehicleById(id: number): Observable<VehicleResponse> {
    return this.apiService.get<VehicleResponse>(`${this.basePath}/${id}`);
  }

  getVehicleByPlate(plate: string): Observable<VehicleResponse> {
    return this.apiService.get<VehicleResponse>(`${this.basePath}/plate/${plate}`);
  }

  /**
   * Obtiene una lista paginada y filtrada de vehículos.
   */
  getAllVehiclesFiltered(filters: VehicleFilterParams): Observable<Page<VehicleResponse>> {
    let params = new HttpParams();
    if (filters.plate) params = params.set('plate', filters.plate);
    if (filters.towerId !== undefined) params = params.set('towerId', filters.towerId.toString());
    if (filters.apartmentId !== undefined) params = params.set('apartmentId', filters.apartmentId.toString());
    if (filters.type) params = params.set('type', filters.type);
    if (filters.status) params = params.set('status', filters.status);
    if (filters.residentNameOrDocument) params = params.set('residentNameOrDocument', filters.residentNameOrDocument);
    if (filters.page !== undefined) params = params.set('page', filters.page.toString());
    if (filters.size !== undefined) params = params.set('size', filters.size.toString());
    if (filters.sort) params = params.set('sort', filters.sort);
    // Añade más filtros si es necesario

    return this.apiService.get<Page<VehicleResponse>>(this.basePath, params);
  }

  updateVehicle(id: number, vehicleData: VehicleRequest): Observable<VehicleResponse> {
    return this.apiService.put<VehicleResponse>(`${this.basePath}/${id}`, vehicleData);
  }

  deleteVehicle(id: number): Observable<void> { // Devuelve void porque el backend da 204 No Content
    return this.apiService.delete<void>(`${this.basePath}/${id}`);
  }
}