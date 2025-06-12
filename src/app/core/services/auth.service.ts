import { Injectable, Inject, PLATFORM_ID } from '@angular/core'; // Importa Inject y PLATFORM_ID
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { ApiService } from './api.service';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  MessageResponse,
  AppUser
} from '../models/auth.model'; // Importamos todas las interfaces necesarias
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly JWT_TOKEN = 'authToken';
  private readonly CURRENT_USER = 'currentUser';

  private isBrowser: boolean; // Para saber si estamos en el navegador

  // BehaviorSubject para el estado de autenticación
  private isAuthenticatedSubject: BehaviorSubject<boolean>;
  public isAuthenticated$: Observable<boolean>;

  // BehaviorSubject para la información del usuario actual
  private currentUserSubject: BehaviorSubject<AppUser | null>;
  public currentUser$: Observable<AppUser | null>;

  constructor(
    private router: Router,
    private apiService: ApiService,
    @Inject(PLATFORM_ID) platformId: object // Inyecta PLATFORM_ID
  ) {
    this.isBrowser = isPlatformBrowser(platformId); // Determina si es navegador

    // Inicializa los BehaviorSubjects después de saber si es navegador
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
    this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    this.currentUserSubject = new BehaviorSubject<AppUser | null>(this.getUserFromStorage());
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  private hasToken(): boolean {
    if (this.isBrowser) { // Solo accede a localStorage si es navegador
      return !!localStorage.getItem(this.JWT_TOKEN);
    }
    return false; // Por defecto, no hay token en el servidor
  }

  private getUserFromStorage(): AppUser | null {
    if (this.isBrowser) { // Solo accede a localStorage si es navegador
      const userString = localStorage.getItem(this.CURRENT_USER);
      return userString ? JSON.parse(userString) as AppUser : null;
    }
    return null; // Por defecto, no hay usuario en el servidor
  }
  /**
   * Procesa la respuesta de autenticación exitosa.
   */
  private handleAuthentication(authResponse: AuthResponse): void {
    if (this.isBrowser) { // Solo escribe en localStorage si es navegador
      localStorage.setItem(this.JWT_TOKEN, authResponse.accessToken);
      const userToStore: AppUser = {
        id: authResponse.userId,
        username: authResponse.username,
        email: authResponse.email,
        roles: authResponse.roles
      };
      localStorage.setItem(this.CURRENT_USER, JSON.stringify(userToStore));
    }

    this.isAuthenticatedSubject.next(true);
    this.currentUserSubject.next({ // Actualiza el currentUserSubject con los datos del usuario
        id: authResponse.userId,
        username: authResponse.username,
        email: authResponse.email,
        roles: authResponse.roles
    });
    this.router.navigate(['/app/dashboard']);
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('/api/v1/auth/login', credentials)
      .pipe(
        tap(response => {
          this.handleAuthentication(response);
        }),
        catchError((error: HttpErrorResponse) => {
          this.clearAuthData(); // Limpia datos incluso si falla, por si acaso
          return throwError(() => error);
        })
      );
  }

  register(userData: RegisterRequest): Observable<MessageResponse> {
    return this.apiService.post<MessageResponse>('/api/v1/auth/register', userData)
      .pipe(
        tap(response => {
          console.log('Registro exitoso:', response.message);
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    this.clearAuthData();
    this.router.navigate(['/auth/login']);
  }

  private clearAuthData(): void {
    if (this.isBrowser) { // Solo accede a localStorage si es navegador
      localStorage.removeItem(this.JWT_TOKEN);
      localStorage.removeItem(this.CURRENT_USER);
    }
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    if (this.isBrowser) { // Solo accede a localStorage si es navegador
      return localStorage.getItem(this.JWT_TOKEN);
    }
    return null;
  }

  getCurrentUser(): AppUser | null {
    // Devuelve el valor actual del BehaviorSubject, que ya considera si es browser o no en su inicialización
    return this.currentUserSubject.value;
  }
}