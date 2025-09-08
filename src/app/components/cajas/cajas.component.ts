import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
// Charts functionality can be added later if needed
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faBox, faFolder, faPlus, faEdit, faTrash, faEye, faCheckCircle, faTimesCircle,
  faExclamationTriangle, faMapMarkerAlt, faTable
} from '@fortawesome/free-solid-svg-icons';

import { ApiService } from '../../services/api.service';
import { Caja } from '../../models/caja-expediente.models';
import { CajaDialogComponent } from '../caja-dialog/caja-dialog.component';
import { CajaDetailsComponent } from '../caja-details/caja-details.component';

@Component({
  selector: 'app-cajas',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    FontAwesomeModule
  ],
  templateUrl: './cajas.component.html',
  styleUrl: './cajas.component.css'
})
export class CajasComponent implements OnInit {
  cajas: Caja[] = [];
  displayedColumns: string[] = ['caja_Id', 'estado', 'ubicacion_Id', 'expedientesCount', 'actions'];
  loading = false;

  // Component properties
  selectedCaja: Caja | null = null;
  isLoading = false;
  
  // Font Awesome icons
  faBox = faBox;
  faFolder = faFolder;
  faPlus = faPlus;
  faEdit = faEdit;
  faTrash = faTrash;
  faEye = faEye;
  faCheckCircle = faCheckCircle;
  faTimesCircle = faTimesCircle;
  faExclamationTriangle = faExclamationTriangle;
  faMapMarkerAlt = faMapMarkerAlt;
  faTable = faTable;

  constructor(
    private readonly apiService: ApiService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCajas();
  }

  loadCajas(): void {
    this.loading = true;
    this.apiService.getCajas().subscribe({
      next: (cajas) => {
        this.cajas = cajas;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading cajas:', error);
        this.snackBar.open('Error al cargar las cajas', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CajaDialogComponent, {
      width: '500px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCajas();
      }
    });
  }

  openEditDialog(caja: Caja): void {
    const dialogRef = this.dialog.open(CajaDialogComponent, {
      width: '500px',
      data: { mode: 'edit', caja }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCajas();
      }
    });
  }

  deleteCaja(caja: Caja): void {
    if (confirm(`¿Está seguro de eliminar la caja ${caja.caja_Id}?`)) {
      this.apiService.deleteCaja(caja.caja_Id).subscribe({
        next: () => {
          this.snackBar.open('Caja eliminada exitosamente', 'Cerrar', { duration: 3000 });
          this.loadCajas();
        },
        error: (error) => {
          console.error('Error deleting caja:', error);
          this.snackBar.open(error.error || 'Error al eliminar la caja', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  viewExpedientes(caja: Caja): void {
    // Navegar a expedientes con filtro por caja
    // Esto se implementará cuando creemos el componente de expedientes
    console.log('Ver expedientes de caja:', caja.caja_Id);
  }

  getActiveCajasCount(): number {
    return this.cajas.filter(caja => caja.estado === 'ACT').length;
  }

  getInactiveCajasCount(): number {
    return this.cajas.filter(caja => caja.estado === 'INA').length;
  }

  getTotalExpedientesCount(): number {
    return this.cajas.reduce((total, caja) => total + caja.expedientesCount, 0);
  }

  // New methods for modern dashboard
  selectCaja(caja: Caja): void {
    this.selectedCaja = this.selectedCaja === caja ? null : caja;
  }

  viewCaja(caja: Caja): void {
    const dialogRef = this.dialog.open(CajaDetailsComponent, {
      width: '900px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      data: caja,
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      // No action needed after closing details dialog
    });
  }

  // Methods for modern dashboard stats
  getCajasByStatus(status: string): Caja[] {
    return this.cajas.filter(caja => caja.estado === status);
  }

  getTotalExpedientes(): number {
    return this.cajas.reduce((total, caja) => total + (caja.expedientesCount || 0), 0);
  }

}