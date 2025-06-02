import { Injectable, Inject, PLATFORM_ID } from '@angular/core'; // AÑADE Inject, PLATFORM_ID
import { isPlatformBrowser } from '@angular/common'; // AÑADE isPlatformBrowser
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, catchError, delay } from 'rxjs/operators';
// import { ApiService } from './api.service'; // Lo usaremos después
// import { User, LoginCredentials } from '../models'; // Modelos a crear


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject: BehaviorSubject<boolean>;
  public isAuthenticated$: Observable<boolean>;

  // private currentUserSubject: BehaviorSubject<User | null>;
  // public currentUser$: Observable<User | null>;

  constructor(
    private router: Router,
    // private apiService: ApiService
    @Inject(PLATFORM_ID) private platformId: Object // INYECTA PLATFORM_ID
  ) {
    // Inicializa el BehaviorSubject comprobando si estamos en el navegador
    let initialAuthState = false;
    if (isPlatformBrowser(this.platformId)) {
      initialAuthState = this.hasTokenInBrowser();
    }
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(initialAuthState);
    this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    // Haz lo mismo si estás usando currentUserSubject
    // let initialUser = null;
    // if (isPlatformBrowser(this.platformId)) {
    //   initialUser = this.getUserFromStorageInBrowser();
    // }
    // this.currentUserSubject = new BehaviorSubject<User | null>(initialUser);
    // this.currentUser$ = this.currentUserSubject.asObservable();
  }

  // Renombra o crea un método específico para el navegador
  private hasTokenInBrowser(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // private getUserFromStorageInBrowser(): User | null {
  //   const user = localStorage.getItem('currentUser');
  //   return user ? JSON.parse(user) : null;
  // }

  login(credentials: /* LoginCredentials */ any): Observable<any> {
    return of({ token: 'mock-jwt-token', user: { id: 1, name: 'Admin User', role: 'ADMIN' } }).pipe(
      delay(1000),
      tap(response => {
        if (isPlatformBrowser(this.platformId)) { // Comprueba de nuevo aquí
          localStorage.setItem('authToken', response.token);
          // localStorage.setItem('currentUser', JSON.stringify(response.user));
        }
        this.isAuthenticatedSubject.next(true);
        // this.currentUserSubject.next(response.user);
        this.router.navigate(['/app/dashboard']);
      }),
      catchError(error => {
        this.isAuthenticatedSubject.next(false);
        // this.currentUserSubject.next(null);
        return throwError(() => new Error('Login fallido: ' + error.message));
      })
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) { // Comprueba de nuevo aquí
      localStorage.removeItem('authToken');
      // localStorage.removeItem('currentUser');
    }
    this.isAuthenticatedSubject.next(false);
    // this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  // Este método ya no se usa para la inicialización directa del BehaviorSubject
  // pero puede ser útil en otros lugares si se llama desde el contexto del navegador.
  // Si solo se usa internamente y siempre después de una comprobación de plataforma, está bien.
  // Si no, también debería tener la comprobación.
  // Por seguridad, lo dejamos aquí por si se llama desde otro lado,
  // aunque es mejor usar los métodos específicos "InBrowser" o comprobar antes de llamar.
  private hasToken(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('authToken');
    }
    return false; // Devuelve un valor por defecto si no está en el navegador
  }

  // ... (resto de tus métodos, asegurándote de que cualquier acceso a localStorage
  //      esté protegido por isPlatformBrowser si puede ser llamado desde el servidor)
}