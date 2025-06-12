import { VehicleStatus, VehicleType } from './vehicle.enums'; // Importa los enums

/**
 * Interfaz para la petición de creación/actualización de vehículo,
 * basada en VehicleRequestDto.java
 */
export interface VehicleRequest {
  plate: string;
  type: VehicleType; // Usar el enum
  brand?: string;
  model?: string;
  color?: string;
  status: VehicleStatus; // Usar el enum
  ownerUserId: number;   // Long se mapea a number
}

/**
 * Interfaz para la respuesta del vehículo,
 * basada en VehicleResponseDto.java
 */
export interface VehicleResponse {
  id: number;
  plate: string;
  type: VehicleType;
  brand?: string;
  model?: string;
  color?: string;
  status: VehicleStatus;
  ownerUserId: number;
  ownerFullName?: string;
  ownerDocumentId?: string;
  towerName?: string;
  apartmentNumber?: string;
  // createdAt?: string; // Si los necesitas en el frontend, añádelos
  // updatedAt?: string;
}

/**
 * Interfaz para los parámetros de filtro de la lista de vehículos
 * (basado en los @RequestParam del controller)
 */
export interface VehicleFilterParams {
  plate?: string;
  towerId?: number;
  apartmentId?: number;
  type?: VehicleType;
  status?: VehicleStatus;
  residentNameOrDocument?: string;
  page?: number;    // Para la paginación (usualmente 0-indexed)
  size?: number;    // Tamaño de la página
  sort?: string;    // Campo de ordenación, ej: "plate,asc" o "createdAt,desc"
}

/**
 * Interfaz para la respuesta paginada (similar a Page<T> de Spring)
 */
export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // Número de página actual (0-indexed)
  first: boolean;
  last: boolean;
  empty: boolean;
  sort?: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  pageable?: { // Información sobre la paginación
    pageNumber: number;
    pageSize: number;
    sort: {
        sorted: boolean;
        unsorted: boolean;
        empty: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  // ... otros campos que Page<T> de Spring pueda tener y necesites
}