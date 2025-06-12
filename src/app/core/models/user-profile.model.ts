// src/app/core/models/user-profile.model.ts

/**
 * Interfaz para la petición de creación/actualización de perfil de usuario,
 * basada en UserProfileRequestDto.java
 */
export interface UserProfileRequest {
    firstName: string;
    lastName: string;
    phoneNumber?: string; // Opcional
    documentId?: string;  // Opcional
    address?: string;     // Opcional
    birthDate?: string;   // LocalDate se mapea a string (ISO 8601: 'YYYY-MM-DD')
  }
  
  /**
   * Interfaz para la respuesta del perfil de usuario,
   * basada en UserProfileResponseDto.java
   */
  export interface UserProfileResponse {
    id: number;           // Long se mapea a number
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    documentId?: string;
    address?: string;
    birthDate?: string;   // LocalDate se mapea a string (ISO 8601: 'YYYY-MM-DD')
    userId: number;       // Long se mapea a number
    // username?: string; // Si lo añades en el DTO de respuesta
  }