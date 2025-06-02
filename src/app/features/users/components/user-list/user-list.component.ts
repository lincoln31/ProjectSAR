import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; // RouterModule para routerLink si lo usaras
import { CommonModule } from '@angular/common';

// Angular Material Modules
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip'; // Para tooltips en botones de acción

// Interfaz para los datos de usuario
export interface UserData {
  id: string; // Podría ser un UUID o un número
  firstName: string;
  lastName: string;
  idCard: string;
  email: string;
  tower: string;
  apartment: string;
  role?: string; // Opcional
}

// Datos mock
const MOCK_USERS: UserData[] = [
  { id: '1', firstName: 'Juan', lastName: 'Pérez', idCard: '8-123-456', email: 'juan.perez@gmail.com', tower: 'A', apartment: '301', role: 'Residente' },
  { id: '2', firstName: 'María', lastName: 'González', idCard: '9-876-543', email: 'maria.gonzalez@hotmail.com', tower: 'B', apartment: '205', role: 'Propietario' },
  { id: '3', firstName: 'Carlos', lastName: 'Mendoza', idCard: '7-654-321', email: 'carlos.mendoza@gmail.com', tower: 'A', apartment: '102', role: 'Residente' },
  { id: '4', firstName: 'Laura', lastName: 'Sánchez', idCard: '8-456-789', email: 'laura.sanchez@yahoo.com', tower: 'C', apartment: '401', role: 'Residente' },
  { id: '5', firstName: 'Roberto', lastName: 'Díaz', idCard: '9-222-333', email: 'roberto.diaz@gmail.com', tower: 'B', apartment: '307', role: 'Administrador' },
  { id: '6', firstName: 'Ana', lastName: 'Martínez', idCard: '1-111-111', email: 'ana.martinez@example.com', tower: 'C', apartment: '202', role: 'Residente' },
];


@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule, // Si usas routerLink en la plantilla
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['firstName', 'lastName', 'idCard', 'email', 'tower', 'apartment', 'actions'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private router: Router /* , private userService: UserService */) { // Inyectar servicio de usuarios después
    this.dataSource = new MatTableDataSource(MOCK_USERS);
  }

  ngOnInit(): void {
    // En el futuro, cargarías los usuarios desde un servicio aquí
    // this.userService.getUsers().subscribe(users => {
    //   this.dataSource.data = users;
    // });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Configuración personalizada para el filtro (opcional, pero útil)
    this.dataSource.filterPredicate = (data: UserData, filter: string) => {
      const dataStr = Object.keys(data).reduce((currentTerm: string, key: string) => {
        // Acumula los valores de las propiedades del objeto UserData en una cadena
        return currentTerm + (data as any)[key] + '◬'; // Usar un separador improbable
      }, '').toLowerCase();
      const transformedFilter = filter.trim().toLowerCase();
      return dataStr.indexOf(transformedFilter) !== -1;
    };
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  goToAddUser(): void {
    this.router.navigate(['/app/users/new']); // Navegar a la ruta del formulario de creación
  }

  editUser(user: UserData): void {
    console.log('Editar usuario:', user);
    this.router.navigate(['/app/users/edit', user.id]); // Navegar a la ruta de edición con el ID
  }

  deleteUser(user: UserData): void {
    // Aquí implementarías la lógica de confirmación y eliminación
    // Por ejemplo, usando MatDialog para un modal de confirmación
    console.log('Eliminar usuario:', user);
    // const confirmDelete = confirm(`¿Está seguro de que desea eliminar a ${user.firstName} ${user.lastName}?`);
    // if (confirmDelete) {
    //   this.userService.deleteUser(user.id).subscribe(() => {
    //     // Actualizar la tabla (re-obtener usuarios o quitar el item del datasource)
    //     this.dataSource.data = this.dataSource.data.filter(u => u.id !== user.id);
    //     // Mostrar notificación de éxito
    //   });
    // }
  }

  // viewUserDetails(user: UserData): void {
  //   console.log('Ver detalles de:', user);
  //   this.router.navigate(['/app/users/profile', user.id]); // Si tienes una vista de perfil
  // }
}