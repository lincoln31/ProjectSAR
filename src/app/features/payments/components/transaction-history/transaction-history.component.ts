import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, DatePipe, CurrencyPipe, TitleCasePipe } from '@angular/common'; // Pipes necesarios
import { FormsModule } from '@angular/forms';

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
// import { MatDialog } from '@angular/material/dialog';

export interface TransactionData {
  id: string;
  ownerFirstName: string;
  ownerLastName: string;
  ownerIdCard: string;
  paymentDate: Date | string; // Puede ser string si viene así del backend, pero Date es mejor
  paymentMethod: 'credit_card' | 'transfer' | 'cash' | 'yappy' | 'other';
  amount: number;
  concept: string;
  status?: 'pagado' | 'pendiente' | 'vencido'; // Opcional
  // Podría tener un transactionNumber o referenceNumber
  referenceNumber?: string;
}

interface Month {
  value: number;
  viewValue: string;
}

interface PaymentMethodOption {
  value: TransactionData['paymentMethod'];
  viewValue: string;
}

const MOCK_TRANSACTIONS: TransactionData[] = [
  { id: 't1', ownerFirstName: 'Juan', ownerLastName: 'Pérez', ownerIdCard: '8-123-456', paymentDate: new Date(2024, 5, 5), paymentMethod: 'credit_card', amount: 150.00, concept: 'Mantenimiento Junio', status: 'pagado' },
  { id: 't2', ownerFirstName: 'María', ownerLastName: 'González', ownerIdCard: '9-876-543', paymentDate: new Date(2024, 5, 2), paymentMethod: 'transfer', amount: 150.00, concept: 'Mantenimiento Junio', status: 'pagado' },
  { id: 't3', ownerFirstName: 'Carlos', ownerLastName: 'Mendoza', ownerIdCard: '7-654-321', paymentDate: new Date(2024, 5, 10), paymentMethod: 'cash', amount: 150.00, concept: 'Mantenimiento Junio', status: 'pagado' },
  { id: 't4', ownerFirstName: 'Laura', ownerLastName: 'Sánchez', ownerIdCard: '8-456-789', paymentDate: new Date(2024, 5, 1), paymentMethod: 'yappy', amount: 150.00, concept: 'Mantenimiento Junio', status: 'pagado' },
  { id: 't5', ownerFirstName: 'Roberto', ownerLastName: 'Díaz', ownerIdCard: '9-222-333', paymentDate: new Date(2024, 4, 7), paymentMethod: 'credit_card', amount: 120.50, concept: 'Cuota Extraordinaria', status: 'pagado' },
  { id: 't6', ownerFirstName: 'Ana', ownerLastName: 'Martínez', ownerIdCard: '1-111-111', paymentDate: new Date(2024, 4, 15), paymentMethod: 'transfer', amount: 150.00, concept: 'Mantenimiento Mayo', status: 'pagado' },
];

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule,
    DatePipe, // Importar pipes si se usan en la plantilla
    CurrencyPipe,
    TitleCasePipe
  ],
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.scss']
})
export class TransactionHistoryComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['ownerFirstName', 'ownerLastName', 'ownerIdCard', 'paymentDate', 'paymentMethod', 'amount', 'concept', /* 'status', */ 'actions'];
  dataSource: MatTableDataSource<TransactionData>;
  originalData: TransactionData[] = MOCK_TRANSACTIONS;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  availableMonths: Month[] = [
    { value: 0, viewValue: 'Enero' }, { value: 1, viewValue: 'Febrero' }, { value: 2, viewValue: 'Marzo' },
    { value: 3, viewValue: 'Abril' }, { value: 4, viewValue: 'Mayo' }, { value: 5, viewValue: 'Junio' },
    { value: 6, viewValue: 'Julio' }, { value: 7, viewValue: 'Agosto' }, { value: 8, viewValue: 'Septiembre' },
    { value: 9, viewValue: 'Octubre' }, { value: 10, viewValue: 'Noviembre' }, { value: 11, viewValue: 'Diciembre' }
  ];
  availableYears: number[] = [];
  availablePaymentMethods: PaymentMethodOption[] = [
    { value: 'credit_card', viewValue: 'Tarjeta de Crédito' },
    { value: 'transfer', viewValue: 'Transferencia' },
    { value: 'cash', viewValue: 'Efectivo' },
    { value: 'yappy', viewValue: 'Yappy' },
    { value: 'other', viewValue: 'Otro' }
  ];

  selectedMonth: number | '' = ''; // Mes actual por defecto
  selectedYear: number  | ''='' ;    // Año actual por defecto
  selectedPaymentMethod: TransactionData['paymentMethod'] | '' = '';
  generalSearchValue: string = '';

  constructor(
    private router: Router,
    // private paymentService: PaymentService,
    // public dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource(); // Inicializar vacío, luego aplicar filtros
    this.populateYears();
  }

  ngOnInit(): void {
    // Cargar datos y aplicar filtros iniciales
    // this.paymentService.getTransactions().subscribe(data => {
    //   this.originalData = data.map(t => ({...t, paymentDate: new Date(t.paymentDate)})); // Asegurar que paymentDate sea Date
    //   this.applyFilters();
    // });
    this.originalData = MOCK_TRANSACTIONS.map(t => ({...t, paymentDate: new Date(t.paymentDate)}));
    this.applyFilters(); // Aplicar filtros por defecto (mes y año actual)
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // El sorting de fechas funciona mejor si paymentDate es un objeto Date o un timestamp
  }

  populateYears(): void {
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 5; i++) { // Por ejemplo, los últimos 5 años
      this.availableYears.push(currentYear - i);
    }
    this.availableYears.sort(); // Ordenar
  }

  applyGeneralSearch(event: Event) {
    this.generalSearchValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.applyFilters();
  }

  applyFilters(): void {
    let filteredData = [...this.originalData];

    if (this.selectedMonth !== '') {
      filteredData = filteredData.filter(t => new Date(t.paymentDate).getMonth() === this.selectedMonth);
    }
    if (this.selectedYear) {
      filteredData = filteredData.filter(t => new Date(t.paymentDate).getFullYear() === this.selectedYear);
    }
    if (this.selectedPaymentMethod) {
      filteredData = filteredData.filter(t => t.paymentMethod === this.selectedPaymentMethod);
    }

    if (this.generalSearchValue) {
      filteredData = filteredData.filter(t =>
        (t.ownerFirstName.toLowerCase().includes(this.generalSearchValue)) ||
        (t.ownerLastName.toLowerCase().includes(this.generalSearchValue)) ||
        (t.ownerIdCard.toLowerCase().includes(this.generalSearchValue)) ||
        (t.concept.toLowerCase().includes(this.generalSearchValue))
      );
    }

    this.dataSource.data = filteredData;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getPaymentMethodViewValue(methodValue: TransactionData['paymentMethod']): string {
    const foundMethod = this.availablePaymentMethods.find(m => m.value === methodValue);
    return foundMethod ? foundMethod.viewValue : 'Desconocido';
  }

  goToRegisterPayment(): void {
    this.router.navigate(['/app/payments/new']); // Asumiendo esta ruta
  }

  viewTransaction(transaction: TransactionData): void {
    console.log('Ver detalle de transacción:', transaction);
    // Navegar a una vista de detalle o mostrar un modal
    // this.router.navigate(['/app/payments/detail', transaction.id]);
  }

  downloadPDF(transaction: TransactionData): void {
    console.log('Descargar PDF para transacción:', transaction);
    // Lógica para generar y descargar el PDF
   // this.snackBar.open(`PDF para ${transaction.concept} (ID: ${transaction.id}) se generaría aquí.`, 'Ok', { duration: 3000 });
  }

  // editTransaction(transaction: TransactionData): void { ... }
}