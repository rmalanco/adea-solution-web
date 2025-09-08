import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faBox, faFolder, faMapMarkerAlt, faCheckCircle, faTimesCircle,
  faUser, faFileAlt, faCalendarAlt, faTimes
} from '@fortawesome/free-solid-svg-icons';

import { ApiService } from '../../services/api.service';
import { Caja, Expediente } from '../../models/caja-expediente.models';

@Component({
  selector: 'app-caja-details',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatTooltipModule,
    FontAwesomeModule
  ],
  template: `
    <div class="caja-details-container">
      <div class="dialog-header">
        <div class="header-content">
          <div class="title-section">
            <fa-icon [icon]="faBox" class="title-icon"></fa-icon>
            <h2 mat-dialog-title>Detalles de la Caja #{{ data.caja_Id }}</h2>
          </div>
          <button mat-icon-button (click)="closeDialog()" class="close-button">
            <fa-icon [icon]="faTimes"></fa-icon>
          </button>
        </div>
      </div>

      <div mat-dialog-content class="dialog-content">
        <!-- Caja Information Card -->
        <mat-card class="info-card">
          <mat-card-header>
            <mat-card-title>
              <fa-icon [icon]="faBox" class="card-icon"></fa-icon>
              Información de la Caja
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">
                  <fa-icon [icon]="faBox" class="info-icon"></fa-icon>
                  ID de Caja
                </div>
                <div class="info-value">{{ data.caja_Id }}</div>
              </div>
              
              <div class="info-item">
                <div class="info-label">
                  <fa-icon [icon]="data.estado === 'ACT' ? faCheckCircle : faTimesCircle" 
                           class="info-icon" 
                           [class.active]="data.estado === 'ACT'"
                           [class.inactive]="data.estado === 'INA'"></fa-icon>
                  Estado
                </div>
                <div class="info-value">
                  <span class="status-badge" [class]="'status-' + data.estado.toLowerCase()">
                    {{ data.estado === 'ACT' ? 'Activo' : 'Inactivo' }}
                  </span>
                </div>
              </div>
              
              <div class="info-item">
                <div class="info-label">
                  <fa-icon [icon]="faMapMarkerAlt" class="info-icon"></fa-icon>
                  Ubicación
                </div>
                <div class="info-value">{{ data.ubicacion_Id }}</div>
              </div>
              
              <div class="info-item">
                <div class="info-label">
                  <fa-icon [icon]="faFolder" class="info-icon"></fa-icon>
                  Total Expedientes
                </div>
                <div class="info-value">{{ data.expedientesCount || 0 }}</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Expedientes Section -->
        <mat-card class="expedientes-card">
          <mat-card-header>
            <mat-card-title>
              <fa-icon [icon]="faFolder" class="card-icon"></fa-icon>
              Expedientes en esta Caja
            </mat-card-title>
            <mat-card-subtitle>
              {{ expedientes.length }} expedientes encontrados
            </mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <div *ngIf="loadingExpedientes" class="loading-container">
              <mat-spinner diameter="40"></mat-spinner>
              <p>Cargando expedientes...</p>
            </div>
            
            <div *ngIf="!loadingExpedientes && expedientes.length === 0" class="empty-state">
              <fa-icon [icon]="faFolder" size="3x" class="empty-icon"></fa-icon>
              <h3>No hay expedientes</h3>
              <p>Esta caja no contiene expedientes registrados.</p>
            </div>
            
            <div *ngIf="!loadingExpedientes && expedientes.length > 0" class="table-container">
              <table mat-table [dataSource]="expedientes" class="expedientes-table">
                <!-- ID Column -->
                <ng-container matColumnDef="id">
                  <th mat-header-cell *matHeaderCellDef>ID</th>
                  <td mat-cell *matCellDef="let expediente">
                    <span class="id-badge">#{{ expediente.expediente_Id }}</span>
                  </td>
                </ng-container>

                <!-- Employee Name Column -->
                <ng-container matColumnDef="empleado">
                  <th mat-header-cell *matHeaderCellDef>
                    <fa-icon [icon]="faUser" class="header-icon"></fa-icon>
                    Empleado
                  </th>
                  <td mat-cell *matCellDef="let expediente">
                    <div class="empleado-info">
                      <fa-icon [icon]="faUser" class="cell-icon"></fa-icon>
                      {{ expediente.nombre_Empleado }}
                    </div>
                  </td>
                </ng-container>

                <!-- Type Column -->
                <ng-container matColumnDef="tipo">
                  <th mat-header-cell *matHeaderCellDef>
                    <fa-icon [icon]="faFileAlt" class="header-icon"></fa-icon>
                    Tipo
                  </th>
                  <td mat-cell *matCellDef="let expediente">
                    <div class="tipo-info">
                      <fa-icon [icon]="faFileAlt" class="cell-icon"></fa-icon>
                      {{ expediente.tipo_Expediente }}
                    </div>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="expedientesColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: expedientesColumns;"></tr>
              </table>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div mat-dialog-actions class="dialog-actions">
        <button mat-button (click)="closeDialog()" class="cancel-button">
          Cerrar
        </button>
      </div>
    </div>
  `,
  styles: [`
    .caja-details-container {
      max-width: 900px;
      width: 100%;
      margin: 0 auto;
    }

    .dialog-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white !important;
      padding: 24px 32px;
      margin: -24px -24px 0 -24px;
      border-radius: 8px 8px 0 0;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      max-width: 800px;
    }

    .title-section {
      display: flex;
      align-items: center;
      gap: 16px;
      flex: 1;
      justify-content: flex-start;
    }

    .title-icon {
      font-size: 32px;
      color: white;
    }

    h2 {
      margin: 0;
      font-size: 32px;
      font-weight: 800;
      color: white !important;
      text-align: left;
    }

    .close-button {
      color: white;
      position: absolute;
      right: 24px;
      top: 50%;
      transform: translateY(-50%);
    }

    .dialog-content {
      padding: 24px 16px;
      max-height: 70vh;
      overflow-y: auto;
      margin: 0;
    }

    .info-card, .expedientes-card {
      margin-bottom: 20px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .card-icon {
      margin-right: 8px;
      color: #667eea;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
      margin-top: 16px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
      align-items: flex-start;
    }

    .info-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
      color: #666;
      font-size: 14px;
      width: 100%;
    }

    .info-icon {
      font-size: 16px;
      flex-shrink: 0;
    }

    .info-icon.active {
      color: #4caf50;
    }

    .info-icon.inactive {
      color: #f44336;
    }

    .info-value {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      width: 100%;
      display: flex;
      align-items: center;
    }

    .status-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-badge.status-act {
      background-color: #e8f5e8;
      color: #2e7d32;
    }

    .status-badge.status-ina {
      background-color: #ffebee;
      color: #c62828;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 40px;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 40px;
      text-align: center;
    }

    .empty-icon {
      color: #ccc;
    }

    .table-container {
      overflow-x: auto;
    }

    .expedientes-table {
      width: 100%;
    }

    .id-badge {
      background-color: #e3f2fd;
      color: #1976d2;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }

    .header-icon, .cell-icon {
      margin-right: 8px;
      color: #666;
      flex-shrink: 0;
    }

    .empleado-info, .tipo-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .dialog-actions {
      padding: 16px 16px;
      justify-content: flex-end;
      border-top: 1px solid #e0e0e0;
      margin: 0;
    }

    .cancel-button {
      background-color: #f5f5f5;
      color: #666;
    }

    @media (max-width: 600px) {
      .info-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }
      
      .dialog-content {
        padding: 16px 12px;
      }
      
      .caja-details-container {
        max-width: 100vw;
        margin: 0;
      }
      
      .dialog-header {
        padding: 20px 12px;
        margin: -16px -16px 0 -16px;
      }
      
      .header-content {
        max-width: 100%;
      }
      
      .title-section {
        gap: 12px;
        justify-content: flex-start;
      }
      
      .title-icon {
        font-size: 28px;
      }
      
      h2 {
        font-size: 26px;
        font-weight: 800;
        color: white !important;
        text-align: left;
      }
      
      .close-button {
        right: 12px;
      }
      
      .dialog-actions {
        padding: 12px 12px;
      }
    }
  `]
})
export class CajaDetailsComponent implements OnInit {
  expedientes: Expediente[] = [];
  loadingExpedientes = false;
  expedientesColumns: string[] = ['id', 'empleado', 'tipo'];

  // Font Awesome icons
  faBox = faBox;
  faFolder = faFolder;
  faMapMarkerAlt = faMapMarkerAlt;
  faCheckCircle = faCheckCircle;
  faTimesCircle = faTimesCircle;
  faUser = faUser;
  faFileAlt = faFileAlt;
  faCalendarAlt = faCalendarAlt;
  faTimes = faTimes;

  constructor(
    public dialogRef: MatDialogRef<CajaDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Caja,
    private readonly apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.loadExpedientes();
  }

  loadExpedientes(): void {
    this.loadingExpedientes = true;
    this.apiService.getExpedientesByCaja(this.data.caja_Id).subscribe({
      next: (expedientes) => {
        this.expedientes = expedientes;
        this.loadingExpedientes = false;
      },
      error: (error) => {
        console.error('Error loading expedientes:', error);
        this.loadingExpedientes = false;
      }
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
