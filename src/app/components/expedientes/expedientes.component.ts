import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBox, faFolder, faPlus, faEdit, faTrash, faEye, faUser, faFileAlt, faTable } from '@fortawesome/free-solid-svg-icons';

import { ApiService } from '../../services/api.service';
import { Expediente, Caja } from '../../models/caja-expediente.models';
import { ExpedienteDialogComponent } from '../expediente-dialog/expediente-dialog.component';

@Component({
  selector: 'app-expedientes',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatTooltipModule,
    FontAwesomeModule
  ],
  templateUrl: './expedientes.component.html',
  styleUrl: './expedientes.component.css'
})
export class ExpedientesComponent implements OnInit {
  expedientes: Expediente[] = [];
  cajas: Caja[] = [];
  displayedColumns: string[] = ['expediente_Id', 'caja_Id', 'nombre_Empleado', 'tipo_Expediente', 'actions'];
  loading = false;
  selectedCajaId: number | null = null;

  // Component properties
  selectedExpediente: Expediente | null = null;
  
  // Font Awesome icons
  faBox = faBox;
  faFolder = faFolder;
  faPlus = faPlus;
  faEdit = faEdit;
  faTrash = faTrash;
  faEye = faEye;
  faUser = faUser;
  faFileAlt = faFileAlt;
  faTable = faTable;

  constructor(
    private readonly apiService: ApiService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCajas();
    this.loadExpedientes();
  }

  loadCajas(): void {
    this.apiService.getCajas().subscribe({
      next: (cajas) => {
        this.cajas = cajas;
      },
      error: (error) => {
        console.error('Error loading cajas:', error);
        this.snackBar.open('Error al cargar las cajas', 'Cerrar', { duration: 3000 });
      }
    });
  }

  loadExpedientes(): void {
    this.loading = true;
    this.apiService.getExpedientes().subscribe({
      next: (expedientes) => {
        this.expedientes = expedientes;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading expedientes:', error);
        this.snackBar.open('Error al cargar los expedientes', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  filterByCaja(cajaId: number | null): void {
    this.selectedCajaId = cajaId;
    if (cajaId) {
      this.loading = true;
      this.apiService.getExpedientesByCaja(cajaId).subscribe({
        next: (expedientes) => {
          this.expedientes = expedientes;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading expedientes by caja:', error);
          this.snackBar.open('Error al cargar los expedientes', 'Cerrar', { duration: 3000 });
          this.loading = false;
        }
      });
    } else {
      this.loadExpedientes();
    }
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(ExpedienteDialogComponent, {
      width: '600px',
      data: { mode: 'create', cajas: this.cajas }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadExpedientes();
        this.loadCajas(); // Recargar cajas para actualizar conteos
      }
    });
  }

  openEditDialog(expediente: Expediente): void {
    const dialogRef = this.dialog.open(ExpedienteDialogComponent, {
      width: '600px',
      data: { mode: 'edit', expediente, cajas: this.cajas }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadExpedientes();
        this.loadCajas(); // Recargar cajas para actualizar conteos
      }
    });
  }

  deleteExpediente(expediente: Expediente): void {
    if (confirm(`¿Está seguro de eliminar el expediente ${expediente.expediente_Id}?`)) {
      this.apiService.deleteExpediente(expediente.expediente_Id).subscribe({
        next: () => {
          this.snackBar.open('Expediente eliminado exitosamente', 'Cerrar', { duration: 3000 });
          this.loadExpedientes();
          this.loadCajas(); // Recargar cajas para actualizar conteos
        },
        error: (error) => {
          console.error('Error deleting expediente:', error);
          this.snackBar.open(error.error || 'Error al eliminar el expediente', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  getCajaInfo(cajaId: number): Caja | undefined {
    return this.cajas.find(c => c.caja_Id === cajaId);
  }

  getTipoExpedienteColor(tipo: string): string {
    switch (tipo) {
      case 'Histórico': return 'primary';
      case 'Día a Día': return 'accent';
      case 'Guarda': return 'warn';
      default: return 'primary';
    }
  }

  getExpedientesByType(tipo: string): Expediente[] {
    return this.expedientes.filter(expediente => expediente.tipo_Expediente === tipo);
  }

  // New methods for modern dashboard
  selectExpediente(expediente: Expediente): void {
    this.selectedExpediente = this.selectedExpediente === expediente ? null : expediente;
  }

  viewExpediente(expediente: Expediente): void {
    // Implement view details functionality
    console.log('Viewing expediente:', expediente);
  }
}