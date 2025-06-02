import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, TitleCasePipe } from '@angular/common'; // TitleCasePipe para el estado
import { FormsModule } from '@angular/forms'; // Necesario para [(ngModel)]

// Angular Material Modules
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
// import { MatDialog } from '@angular/material/dialog'; // Para el modal QR o confirmación de borrado

// Interfaz para los datos de vehículo
export interface VehicleData {
  id: string;
  ownerFirstName: string;
  ownerLastName: string;
  plate: string;
  type: 'automovil' | 'motocicleta' | 'camioneta' | 'otro'; // Tipos definidos
  tower: string;
  apartment: string;
  status: 'activo' | 'inactivo';
  // Campos adicionales si son necesarios: brand, model, color
  brand?: string;
  model?: string;
  color?: string;
}

export interface VehicleTypeOption {
  value: VehicleData['type'];
  viewValue: string;
  icon: string;
}

// Datos mock
const MOCK_VEHICLES: VehicleData[] = [
  { id: 'v1', ownerFirstName: 'Juan', ownerLastName: 'Pérez', plate: 'ABD-123', type: 'automovil', tower: 'A', apartment: '301', status: 'activo', brand: 'Toyota', model: 'Corolla', color: 'Rojo' },
  { id: 'v2', ownerFirstName: 'María', ownerLastName: 'González', plate: 'XYZ-789', type: 'camioneta', tower: 'B', apartment: '205', status: 'activo', brand: 'Ford', model: 'Explorer', color: 'Azul' },
  { id: 'v3', ownerFirstName: 'Carlos', ownerLastName: 'Mendoza', plate: 'MNP-456', type: 'motocicleta', tower: 'A', apartment: '102', status: 'activo', brand: 'Honda', model: 'CBR', color: 'Negro' },
  { id: 'v4', ownerFirstName: 'Laura', ownerLastName: 'Sánchez', plate: 'QRS-987', type: 'automovil', tower: 'C', apartment: '401', status: 'inactivo', brand: 'Chevrolet', model: 'Spark', color: 'Blanco' },
  { id: 'v5', ownerFirstName: 'Roberto', ownerLastName: 'Díaz', plate: 'KLM-555', type: 'automovil', tower: 'B', apartment: '307', status: 'activo', brand: 'Nissan', model: 'Sentra', color: 'Gris' },
];

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule, // Para [(ngModel)]
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule,
    TitleCasePipe // Para el pipe titlecase en el estado
  ],
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.scss']
})
export class VehicleListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['ownerFirstName', 'ownerLastName', 'plate', 'type', 'tower', 'apartment', 'status', 'actions'];
  dataSource: MatTableDataSource<VehicleData>;
  originalData: VehicleData[] = MOCK_VEHICLES; // Mantener una copia de los datos originales

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Filtros
  availableTowers: string[] = ['Torre A', 'Torre B', 'Torre C']; // Podría venir de un servicio
  availableVehicleTypes: VehicleTypeOption[] = [
    { value: 'automovil', viewValue: 'Automóvil', icon: 'directions_car' },
    { value: 'motocicleta', viewValue: 'Motocicleta', icon: 'two_wheeler' },
    { value: 'camioneta', viewValue: 'Camioneta', icon: 'airport_shuttle' }, // O un icono más genérico de SUV/Van
    { value: 'otro', viewValue: 'Otro', icon: 'commute' }
  ];
  selectedTower: string = '';
  selectedVehicleType: VehicleData['type'] | '' = '';
  selectedStatus: VehicleData['status'] | '' = '';
  generalSearchValue: string = '';


  constructor(
    private router: Router,
    // private vehicleService: VehicleService, // Futuro servicio
    // public dialog: MatDialog // Para modales
  ) {
    this.dataSource = new MatTableDataSource(this.originalData);
  }

  ngOnInit(): void {
    // Cargar datos del servicio en el futuro
    // this.vehicleService.getVehicles().subscribe(data => {
    //   this.originalData = data;
    //   this.dataSource.data = data;
    // });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // El filterPredicate por defecto de MatTableDataSource filtra en base a la representación
    // string de todo el objeto. Para filtros más específicos y combinados,
    // es mejor aplicar el filtro manualmente sobre una copia de los datos.
    // O, si el backend soporta filtros, delegar el filtrado al backend.
  }

  applyGeneralSearch(event: Event) {
    this.generalSearchValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.applyFilters();
  }

  applyFilters(): void {
    let filteredData = [...this.originalData]; // Empezar con todos los datos

    // Aplicar filtro de torre
    if (this.selectedTower) {
      filteredData = filteredData.filter(vehicle => vehicle.tower.toLowerCase() === this.selectedTower.toLowerCase());
    }

    // Aplicar filtro de tipo de vehículo
    if (this.selectedVehicleType) {
      filteredData = filteredData.filter(vehicle => vehicle.type === this.selectedVehicleType);
    }

    // Aplicar filtro de estado
    if (this.selectedStatus) {
      filteredData = filteredData.filter(vehicle => vehicle.status === this.selectedStatus);
    }

    // Aplicar búsqueda general
    if (this.generalSearchValue) {
      filteredData = filteredData.filter(vehicle =>
        (vehicle.plate.toLowerCase().includes(this.generalSearchValue)) ||
        (vehicle.ownerFirstName.toLowerCase().includes(this.generalSearchValue)) ||
        (vehicle.ownerLastName.toLowerCase().includes(this.generalSearchValue))
      );
    }

    this.dataSource.data = filteredData;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getVehicleIcon(type: VehicleData['type']): string {
    const foundType = this.availableVehicleTypes.find(t => t.value === type);
    return foundType ? foundType.icon : 'help_outline'; // Icono por defecto
  }

  getVehicleTypeViewValue(type: VehicleData['type']): string {
    const foundType = this.availableVehicleTypes.find(t => t.value === type);
    return foundType ? foundType.viewValue : 'Desconocido';
  }

  goToAddVehicle(): void {
    this.router.navigate(['/app/vehicles/new']); // Asumiendo esta ruta para el formulario
  }

  editVehicle(vehicle: VehicleData): void {
    console.log('Editar vehículo:', vehicle);
    this.router.navigate(['/app/vehicles/edit', vehicle.id]);
  }

  generateQR(vehicle: VehicleData): void {
    console.log('Generar QR para:', vehicle);
    // Aquí iría la lógica para mostrar un modal con el QR
    // Ejemplo:
    // const dialogRef = this.dialog.open(QrCodeDialogComponent, {
    //   data: { plate: vehicle.plate, owner: `${vehicle.ownerFirstName} ${vehicle.ownerLastName}` }
    // });
  }

  deleteVehicle(vehicle: VehicleData): void {
    console.log('Eliminar vehículo:', vehicle);
    // Lógica de confirmación y eliminación
    // Ejemplo:
    // const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    //   data: { title: 'Confirmar Eliminación', message: `¿Está seguro de eliminar el vehículo con placa ${vehicle.plate}?` }
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     // Llamar al servicio para eliminar y actualizar datasource
    //   }
    // });
  }
}