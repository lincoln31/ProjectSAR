import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox'; // Para la columna de checkboxes
import { SelectionModel } from '@angular/cdk/collections'; // Para la selección en la tabla

// Interface para los datos de la tabla (ejemplo)
export interface PaymentHistoryElement {
  id: number;
  name: string;
  identifier: string;
  description: string;
}

// Datos mock para la tabla
const ELEMENT_DATA: PaymentHistoryElement[] = [
  { id: 1, name: 'Ann Culhane', identifier: '5684236526', description: 'Lorem ipsum dolor sit amet...' },
  { id: 2, name: 'Ahmad Rosser', identifier: '5684236527', description: 'Consectetur adipiscing elit...' },
  { id: 3, name: 'Zain Calzoni', identifier: '5684236528', description: 'Nulla facilisi...' },
  { id: 4, name: 'Leo Stanton', identifier: '5684236529', description: 'Sed do eiusmod tempor...' },
  { id: 5, name: 'Kaiya Vetrovs', identifier: '5684236530', description: 'Incididunt ut labore et dolore...' },
];

@Component({
  selector: 'app-dashboard-main',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule
  ],
  templateUrl: './dashboard-main.component.html',
  styleUrls: ['./dashboard-main.component.scss']
})
export class DashboardMainComponent implements OnInit, AfterViewInit {

  // Para la tabla de historial de pagos
  displayedColumns: string[] = ['select', 'id', 'name', 'description'];
  dataSource = new MatTableDataSource<PaymentHistoryElement>(ELEMENT_DATA);
  selection = new SelectionModel<PaymentHistoryElement>(true, []); // Para la selección múltiple

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() { }

  ngOnInit(): void {
    // Aquí podrías cargar datos de servicios en el futuro
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  /** Si la selección de checkboxes es para todos los elementos de la página actual */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length; // O this.dataSource.paginator.pageSize si quieres solo la página actual
    return numSelected === numRows;
  }

  /** Selecciona todas las filas si no están todas seleccionadas; de lo contrario, limpia la selección. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  // Lógica para el calendario (simplificada por ahora)
  // Necesitarás más lógica para generar los días del mes, manejar navegación, etc.
  calendarDays: (number | null)[] = []; // Ejemplo: [null, null, 1, 2, ..., 30, null]
  currentMonthYear: string = 'Junio 2024'; // Se actualizaría dinámicamente

  // Podrías tener métodos para:
  // generateCalendarDays(year: number, month: number) { ... }
  // previousMonth() { ... }
  // nextMonth() { ... }
  // selectDay(day: number) { ... }
}