import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFolder, faPlus, faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';

import { ApiService } from '../../services/api.service';
import { Expediente, CreateExpedienteRequest, UpdateExpedienteRequest, Caja } from '../../models/caja-expediente.models';
import { TIPOS_EXPEDIENTE } from '../../models/caja-expediente.models';

export interface ExpedienteDialogData {
  mode: 'create' | 'edit';
  expediente?: Expediente;
  cajas: Caja[];
}

@Component({
  selector: 'app-expediente-dialog',
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
  templateUrl: './expediente-dialog.component.html',
  styleUrl: './expediente-dialog.component.css'
})
export class ExpedienteDialogComponent implements OnInit {
  expedienteForm: FormGroup;
  tiposExpediente = TIPOS_EXPEDIENTE;
  isEditMode = false;

  // Font Awesome icons
  faFolder = faFolder;
  faPlus = faPlus;
  faEdit = faEdit;
  faTimes = faTimes;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<ExpedienteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ExpedienteDialogData
  ) {
    this.isEditMode = data.mode === 'edit';
    this.expedienteForm = this.fb.group({
      caja_Id: ['', Validators.required],
      nombre_Empleado: ['', [Validators.required, Validators.maxLength(100)]],
      tipo_Expediente: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.isEditMode && this.data.expediente) {
      this.expedienteForm.patchValue({
        caja_Id: this.data.expediente.caja_Id,
        nombre_Empleado: this.data.expediente.nombre_Empleado,
        tipo_Expediente: this.data.expediente.tipo_Expediente
      });
    }
  }

  onSubmit(): void {
    if (this.expedienteForm.valid) {
      const formValue = this.expedienteForm.value;
      
      if (this.isEditMode && this.data.expediente) {
        const updateRequest: UpdateExpedienteRequest = {
          expediente_Id: this.data.expediente.expediente_Id,
          caja_Id: formValue.caja_Id,
          nombre_Empleado: formValue.nombre_Empleado,
          tipo_Expediente: formValue.tipo_Expediente
        };
        
        this.apiService.updateExpediente(this.data.expediente.expediente_Id, updateRequest).subscribe({
          next: () => {
            this.snackBar.open('Expediente actualizado exitosamente', 'Cerrar', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Error updating expediente:', error);
            this.snackBar.open(error.error || 'Error al actualizar el expediente', 'Cerrar', { duration: 3000 });
          }
        });
      } else {
        const createRequest: CreateExpedienteRequest = {
          caja_Id: formValue.caja_Id,
          nombre_Empleado: formValue.nombre_Empleado,
          tipo_Expediente: formValue.tipo_Expediente
        };
        
        this.apiService.createExpediente(createRequest).subscribe({
          next: () => {
            this.snackBar.open('Expediente creado exitosamente', 'Cerrar', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Error creating expediente:', error);
            this.snackBar.open(error.error || 'Error al crear el expediente', 'Cerrar', { duration: 3000 });
          }
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.expedienteForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName} es obligatorio`;
    }
    if (field?.hasError('maxlength')) {
      return 'El nombre no puede exceder 100 caracteres';
    }
    return '';
  }

  getCajaDisplayText(caja: Caja): string {
    return `Caja ${caja.caja_Id} - ${caja.estado} (${caja.ubicacion_Id})`;
  }
}