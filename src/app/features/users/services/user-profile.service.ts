import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service'; // Ajusta la ruta si es necesario
import { UserProfileRequest, UserProfileResponse } from '../../../core/models/user-profile.model';

@Injectable({
  providedIn: 'root' // O proveerlo solo en el módulo/componentes de usuarios si prefieres
})
export class UserProfileService {
  private basePath = '/api/v1/users'; // O la base que uses para perfiles

  constructor(private apiService: ApiService) {}

  /**
   * Obtiene el perfil del usuario autenticado actualmente.
   */
  getMyProfile(): Observable<UserProfileResponse> {
    return this.apiService.get<UserProfileResponse>(`${this.basePath}/me/profile`);
  }

  /**
   * Actualiza el perfil del usuario autenticado actualmente.
   */
  updateMyProfile(profileData: UserProfileRequest): Observable<UserProfileResponse> {
    return this.apiService.put<UserProfileResponse>(`${this.basePath}/me/profile`, profileData);
  }

  // --- Métodos para Administradores ---

  /**
   * (Admin) Crea un perfil para un usuario específico.
   */
  createProfileForUser(userId: number, profileData: UserProfileRequest): Observable<UserProfileResponse> {
    return this.apiService.post<UserProfileResponse>(`${this.basePath}/${userId}/profile`, profileData);
  }

  /**
   * (Admin) Obtiene el perfil de un usuario por su ID.
   */
  getProfileByUserId(userId: number): Observable<UserProfileResponse> {
    return this.apiService.get<UserProfileResponse>(`${this.basePath}/${userId}/profile`);
  }

  /**
   * (Admin) Actualiza el perfil de un usuario por su ID.
   */
  updateProfileByUserId(userId: number, profileData: UserProfileRequest): Observable<UserProfileResponse> {
    return this.apiService.put<UserProfileResponse>(`${this.basePath}/${userId}/profile`, profileData);
  }
}