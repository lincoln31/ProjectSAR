
/**
 * Interfaz para la petición de login, basada en LoginRequestDTO.java
 */
export interface LoginRequest {
    usernameOrEmail: string;
    password: string;
  }
  
  /**
   * Interfaz para la petición de registro, basada en RegisterRequestDTO.java
   */
  export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;       // Opcional, como en el DTO
    roles?: string[];     // Opcional, como en el DTO
  }
  
  /**
   * Interfaz para la respuesta de autenticación, basada en AuthResponseDTO.java
   */
  export interface AuthResponse {
    accessToken: string;
    tokenType?: string; // Es "Bearer" por defecto en tu DTO, puede ser opcional en el front
    userId: number;    // Long se mapea a number
    username: string;
    email: string;
    roles: string[];
  }
  
  /**
   * Interfaz para respuestas genéricas de mensajes, basada en MessageResponseDTO.java
   * (Asumo que MessageResponseDTO tiene un campo "message" de tipo String)
   */
  export interface MessageResponse {
    message: string;
  }
  
  /**
   * Interfaz para representar un Rol, basada en Role.java
   */
  export interface AppRole { // Uso AppRole para evitar conflictos si alguna vez se importa Role de otro sitio
    id: number;       // Long se mapea a number
    name: string;
  }
  
  /**
   * Interfaz para representar un Usuario en el frontend,
   * basada en User.java y lo que podríamos necesitar del AuthResponseDTO.
   */
  export interface AppUser {
    id: number;
    username: string;
    email: string;
    enabled?: boolean;
    roles?: string[]; // Simplificado a un array de strings como en AuthResponseDTO
    // O si quieres la estructura completa de AppRole:
    // rolesFull?: AppRole[];
    firstName?: string; // Lo añadimos si lo obtenemos en algún momento o lo necesitamos
    lastName?: string;  // Lo añadimos si lo obtenemos en algún momento o lo necesitamos
    phone?: string;     // Lo añadimos si lo obtenemos en algún momento o lo necesitamos
    createdAt?: string; // LocalDateTime se mapea a string (ISO 8601)
    updatedAt?: string;
    // userProfile?: any; // Define UserProfile interface si es necesario y si se envía al front
    // residencies?: any[]; // Define Residency interface si es necesario y si se envía al front
  }