export interface Caja {
  caja_Id: number;
  estado: string;
  ubicacion_Id: string;
  expedientesCount: number;
}

export interface CreateCajaRequest {
  estado: string;
  ubicacion_Id: string;
}

export interface UpdateCajaRequest {
  caja_Id: number;
  estado: string;
  ubicacion_Id: string;
}

export interface Expediente {
  expediente_Id: number;
  caja_Id: number;
  nombre_Empleado: string;
  tipo_Expediente: string;
}

export interface CreateExpedienteRequest {
  caja_Id: number;
  nombre_Empleado: string;
  tipo_Expediente: string;
}

export interface UpdateExpedienteRequest {
  expediente_Id: number;
  caja_Id: number;
  nombre_Empleado: string;
  tipo_Expediente: string;
}

export const TIPOS_EXPEDIENTE = ['Histórico', 'Día a Día', 'Guarda'] as const;
export const UBICACIONES = ['Norte', 'Sur', 'Noreste', 'Poniente', 'Centro'] as const;
