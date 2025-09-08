import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faFileAlt, faUser, faBox, faTimes, faCheckCircle, faTimesCircle,
  faMapMarkerAlt, faFolder, faCalendarAlt, faIdCard, faEdit
} from '@fortawesome/free-solid-svg-icons';

import { ApiService } from '../../services/api.service';
import { Expediente, Caja } from '../../models/caja-expediente.models';

@Component({
  selector: 'app-expediente-details',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    FontAwesomeModule
  ],
  template: `
    <div class="expediente-details-container">
      <!-- Dialog Header -->
      <div class="dialog-header">
        <div class="header-content">
          <div class="title-section">
            <fa-icon [icon]="faFileAlt" class="title-icon"></fa-icon>
            <h2 mat-dialog-title>Detalles del Expediente</h2>
          </div>
          <button mat-icon-button (click)="onClose()" class="close-button">
            <fa-icon [icon]="faTimes"></fa-icon>
          </button>
        </div>
      </div>

      <!-- Dialog Content -->
      <div class="dialog-content">
        <div class="info-grid">
          <!-- ID -->
          <div class="info-item">
            <div class="info-label">
              <fa-icon [icon]="faIdCard" class="header-icon"></fa-icon>
              <span>ID del Expediente</span>
            </div>
            <div class="info-value">
              <span class="id-badge">#{{ expediente.expediente_Id }}</span>
            </div>
          </div>

          <!-- Empleado -->
          <div class="info-item">
            <div class="info-label">
              <fa-icon [icon]="faUser" class="header-icon"></fa-icon>
              <span>Empleado</span>
            </div>
            <div class="info-value">
              <div class="empleado-info">
                <fa-icon [icon]="faUser" class="cell-icon"></fa-icon>
                <span>{{ expediente.nombre_Empleado }}</span>
              </div>
            </div>
          </div>

          <!-- Tipo -->
          <div class="info-item">
            <div class="info-label">
              <fa-icon [icon]="faFileAlt" class="header-icon"></fa-icon>
              <span>Tipo de Expediente</span>
            </div>
            <div class="info-value">
              <div class="tipo-info">
                <fa-icon [icon]="faFileAlt" class="cell-icon"></fa-icon>
                <span class="tipo-badge" [class]="getTipoClass(expediente.tipo_Expediente)">
                  {{ expediente.tipo_Expediente }}
                </span>
              </div>
            </div>
          </div>

          <!-- Caja -->
          <div class="info-item">
            <div class="info-label">
              <fa-icon [icon]="faBox" class="header-icon"></fa-icon>
              <span>Caja Asignada</span>
            </div>
            <div class="info-value">
              <div class="caja-info">
                <fa-icon [icon]="faBox" class="cell-icon"></fa-icon>
                <span>Caja #{{ expediente.caja_Id }}</span>
                <span class="caja-status" *ngIf="cajaInfo">
                  ({{ cajaInfo.estado === 'ACT' ? 'Activa' : 'Inactiva' }})
                </span>
              </div>
            </div>
          </div>

          <!-- Ubicación de la Caja -->
          <div class="info-item" *ngIf="cajaInfo">
            <div class="info-label">
              <fa-icon [icon]="faMapMarkerAlt" class="header-icon"></fa-icon>
              <span>Ubicación</span>
            </div>
            <div class="info-value">
              <div class="ubicacion-info">
                <fa-icon [icon]="faMapMarkerAlt" class="cell-icon"></fa-icon>
                <span>{{ cajaInfo.ubicacion_Id }}</span>
              </div>
            </div>
          </div>

          <!-- Estado de la Caja -->
          <div class="info-item" *ngIf="cajaInfo">
            <div class="info-label">
              <fa-icon [icon]="cajaInfo.estado === 'ACT' ? faCheckCircle : faTimesCircle" class="header-icon"></fa-icon>
              <span>Estado de la Caja</span>
            </div>
            <div class="info-value">
              <span class="status-badge" [class.status-activo]="cajaInfo.estado === 'ACT'" [class.status-inactivo]="cajaInfo.estado === 'INA'">
                <fa-icon [icon]="cajaInfo.estado === 'ACT' ? faCheckCircle : faTimesCircle" class="status-icon"></fa-icon>
                {{ cajaInfo.estado === 'ACT' ? 'Activa' : 'Inactiva' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Dialog Actions -->
      <div class="dialog-actions">
        <button mat-button (click)="onClose()" class="close-action-button">
          Cerrar
        </button>
        <button mat-raised-button color="primary" (click)="onEdit()" class="edit-action-button">
          <fa-icon [icon]="faEdit" class="button-icon"></fa-icon>
          Editar Expediente
        </button>
      </div>
    </div>
  `,
  styles: [`
    .expediente-details-container {
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

    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
      align-items: flex-start;
    }

    .info-label {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      color: #495057;
      font-size: 14px;
      font-family: 'Inter', sans-serif;
    }

    .info-value {
      width: 100%;
      display: flex;
      align-items: center;
    }

    .header-icon {
      color: #667eea;
      font-size: 16px;
      flex-shrink: 0;
    }

    .cell-icon {
      color: #6c757d;
      font-size: 16px;
      flex-shrink: 0;
    }

    .id-badge {
      background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
      color: #1976d2;
      padding: 8px 16px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 700;
      font-family: 'Inter', sans-serif;
    }

    .empleado-info, .tipo-info, .caja-info, .ubicacion-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .tipo-badge {
      padding: 6px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      font-family: 'Inter', sans-serif;
    }

    .tipo-badge.historico {
      background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
      color: #155724;
    }

    .tipo-badge.dia-dia {
      background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
      color: #856404;
    }

    .tipo-badge.guarda {
      background: linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%);
      color: #0c5460;
    }

    .caja-status {
      color: #6c757d;
      font-size: 12px;
      font-style: italic;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      font-family: 'Inter', sans-serif;
    }

    .status-badge.status-activo {
      background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
      color: #155724;
    }

    .status-badge.status-inactivo {
      background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
      color: #721c24;
    }

    .status-icon {
      font-size: 12px;
    }

    .dialog-actions {
      padding: 16px 16px;
      justify-content: flex-end;
      border-top: 1px solid #e0e0e0;
      margin: 0;
      display: flex;
      gap: 12px;
    }

    .close-action-button {
      background-color: #f5f5f5;
      color: #666;
      border-radius: 8px;
      padding: 8px 16px;
      font-weight: 500;
    }

    .edit-action-button {
      background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
      color: white;
      border: none;
      border-radius: 8px;
      padding: 8px 16px;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
      transition: all 0.3s ease;
    }

    .edit-action-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(76, 175, 80, 0.4);
    }

    .button-icon {
      margin-right: 8px;
      font-size: 16px;
    }

    /* Responsive Design */
    @media (max-width: 600px) {
      .expediente-details-container {
        max-width: 100vw;
        margin: 0;
      }
      
      .dialog-header {
        padding: 20px 12px;
        margin: -16px -16px 0 -16px;
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
      
      .dialog-content {
        padding: 16px 12px;
      }
      
      .info-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }
      
      .dialog-actions {
        padding: 12px 12px;
        flex-direction: column;
        gap: 8px;
      }
      
      .close-action-button, .edit-action-button {
        width: 100%;
      }
    }
  `]
})
export class ExpedienteDetailsComponent implements OnInit {
  expediente: Expediente;
  cajaInfo: Caja | null = null;
  loading = false;

  // Font Awesome icons
  faFileAlt = faFileAlt;
  faUser = faUser;
  faBox = faBox;
  faTimes = faTimes;
  faCheckCircle = faCheckCircle;
  faTimesCircle = faTimesCircle;
  faMapMarkerAlt = faMapMarkerAlt;
  faFolder = faFolder;
  faCalendarAlt = faCalendarAlt;
  faIdCard = faIdCard;
  faEdit = faEdit;

  constructor(
    private dialogRef: MatDialogRef<ExpedienteDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Expediente,
    private apiService: ApiService
  ) {
    this.expediente = data;
  }

  ngOnInit(): void {
    this.loadCajaInfo();
  }

  loadCajaInfo(): void {
    this.loading = true;
    this.apiService.getCajas().subscribe({
      next: (cajas) => {
        this.cajaInfo = cajas.find(caja => caja.caja_Id === this.expediente.caja_Id) || null;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading caja info:', error);
        this.loading = false;
      }
    });
  }

  getTipoClass(tipo: string): string {
    switch (tipo.toLowerCase()) {
      case 'histórico':
        return 'historico';
      case 'día a día':
      case 'dia a dia':
        return 'dia-dia';
      case 'guarda':
        return 'guarda';
      default:
        return 'historico';
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onEdit(): void {
    // Emit event to parent component to open edit dialog
    this.dialogRef.close({ action: 'edit', expediente: this.expediente });
  }
}
