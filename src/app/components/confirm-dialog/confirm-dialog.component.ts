import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faExclamationTriangle, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger' | 'info';
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    FontAwesomeModule
  ],
  template: `
    <div class="confirm-dialog-container">
      <div class="dialog-header" [class]="'header-' + (data.type || 'warning')">
        <div class="header-content">
          <div class="title-section">
            <fa-icon [icon]="getIcon()" class="title-icon"></fa-icon>
            <h2 mat-dialog-title>{{ data.title }}</h2>
          </div>
          <button mat-icon-button (click)="onCancel()" class="close-button">
            <fa-icon [icon]="faTimes"></fa-icon>
          </button>
        </div>
      </div>

      <div class="dialog-content">
        <div class="message-container">
          <p class="confirmation-message">{{ data.message }}</p>
        </div>
      </div>

      <div class="dialog-actions">
        <button mat-button (click)="onCancel()" class="cancel-button">
          {{ data.cancelText || 'Cancelar' }}
        </button>
        <button mat-raised-button (click)="onConfirm()" class="confirm-button" [class]="'confirm-' + (data.type || 'warning')">
          <fa-icon [icon]="faTrash" class="button-icon"></fa-icon>
          {{ data.confirmText || 'Eliminar' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .confirm-dialog-container {
      max-width: 500px;
      width: 100%;
      margin: 0 auto;
    }

    .dialog-header {
      color: white !important;
      padding: 24px 32px;
      margin: -24px -24px 0 -24px;
      border-radius: 8px 8px 0 0;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .header-warning {
      background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
    }

    .header-danger {
      background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
    }

    .header-info {
      background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      max-width: 400px;
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
      margin: 0;
    }

    .message-container {
      text-align: center;
    }

    .confirmation-message {
      font-size: 18px;
      color: #2c3e50;
      margin: 0;
      line-height: 1.6;
      font-family: 'Inter', sans-serif;
    }

    .dialog-actions {
      padding: 16px 16px;
      justify-content: flex-end;
      border-top: 1px solid #e0e0e0;
      margin: 0;
      display: flex;
      gap: 12px;
    }

    .cancel-button {
      background-color: #f5f5f5;
      color: #666;
      border-radius: 8px;
      padding: 8px 16px;
      font-weight: 500;
    }

    .confirm-button {
      border: none;
      border-radius: 8px;
      padding: 8px 16px;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease;
    }

    .confirm-warning {
      background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
      color: white;
    }

    .confirm-danger {
      background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
      color: white;
    }

    .confirm-info {
      background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
      color: white;
    }

    .confirm-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    }

    .button-icon {
      margin-right: 8px;
      font-size: 16px;
    }

    /* Responsive Design */
    @media (max-width: 600px) {
      .confirm-dialog-container {
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
      
      .confirmation-message {
        font-size: 16px;
      }
      
      .dialog-actions {
        padding: 12px 12px;
        flex-direction: column;
        gap: 8px;
      }
      
      .cancel-button, .confirm-button {
        width: 100%;
      }
    }
  `]
})
export class ConfirmDialogComponent {
  faExclamationTriangle = faExclamationTriangle;
  faTimes = faTimes;
  faTrash = faTrash;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}

  getIcon() {
    switch (this.data.type) {
      case 'danger':
        return faTrash;
      case 'info':
        return faExclamationTriangle;
      default:
        return faExclamationTriangle;
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
