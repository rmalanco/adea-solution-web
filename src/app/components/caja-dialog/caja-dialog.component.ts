import { Component, Inject, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBox, faPlus, faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';

import { ApiService } from '../../services/api.service';
import { Caja, CreateCajaRequest, UpdateCajaRequest } from '../../models/caja-expediente.models';
import { UBICACIONES } from '../../models/caja-expediente.models';

export interface CajaDialogData {
  mode: 'create' | 'edit';
  caja?: Caja;
}

@Component({
  selector: 'app-caja-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    FontAwesomeModule
  ],
  templateUrl: './caja-dialog.component.html',
  styleUrl: './caja-dialog.component.css'
})
export class CajaDialogComponent implements OnInit {
  cajaForm: FormGroup;
  ubicaciones = UBICACIONES;
  isEditMode = false;

  // Font Awesome icons
  faBox = faBox;
  faPlus = faPlus;
  faEdit = faEdit;
  faTimes = faTimes;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<CajaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CajaDialogData
  ) {
    this.isEditMode = data.mode === 'edit';
    this.cajaForm = this.fb.group({
      estado: ['', Validators.required],
      ubicacion_Id: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.isEditMode && this.data.caja) {
      this.cajaForm.patchValue({
        estado: this.data.caja.estado,
        ubicacion_Id: this.data.caja.ubicacion_Id
      });
    }
  }

  @HostListener('keydown.escape')
  onEscapeKey(): void {
    this.onCancel();
  }

  @HostListener('keydown.enter', ['$event'])
  onEnterKey(event: KeyboardEvent): void {
    if (this.cajaForm.valid && !event.shiftKey) {
      event.preventDefault();
      this.onSubmit();
    }
  }

  onSubmit(): void {
    if (this.cajaForm.valid) {
      const formValue = this.cajaForm.value;
      
      if (this.isEditMode && this.data.caja) {
        const updateRequest: UpdateCajaRequest = {
          caja_Id: this.data.caja.caja_Id,
          estado: formValue.estado,
          ubicacion_Id: formValue.ubicacion_Id
        };
        
        this.apiService.updateCaja(this.data.caja.caja_Id, updateRequest).subscribe({
          next: () => {
            this.snackBar.open('Caja actualizada exitosamente', 'Cerrar', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Error updating caja:', error);
            this.snackBar.open(error.error || 'Error al actualizar la caja', 'Cerrar', { duration: 3000 });
          }
        });
      } else {
        const createRequest: CreateCajaRequest = {
          estado: formValue.estado,
          ubicacion_Id: formValue.ubicacion_Id
        };
        
        this.apiService.createCaja(createRequest).subscribe({
          next: () => {
            this.snackBar.open('Caja creada exitosamente', 'Cerrar', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Error creating caja:', error);
            this.snackBar.open(error.error || 'Error al crear la caja', 'Cerrar', { duration: 3000 });
          }
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.cajaForm.get(fieldName);
    if (field?.hasError('required')) {
      if (fieldName === 'estado') {
        return 'Debe seleccionar un estado';
      }
      if (fieldName === 'ubicacion_Id') {
        return 'Debe seleccionar una ubicación';
      }
      return `${fieldName} es obligatorio`;
    }
    return '';
  }
}