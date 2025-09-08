import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
  Caja, 
  CreateCajaRequest, 
  UpdateCajaRequest, 
  Expediente, 
  CreateExpedienteRequest, 
  UpdateExpedienteRequest 
} from '../models/caja-expediente.models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) { }

  // Cajas
  getCajas(): Observable<Caja[]> {
    return this.http.get<Caja[]>(`${this.baseUrl}/cajas`);
  }

  getCaja(id: number): Observable<Caja> {
    return this.http.get<Caja>(`${this.baseUrl}/cajas/${id}`);
  }

  createCaja(caja: CreateCajaRequest): Observable<Caja> {
    return this.http.post<Caja>(`${this.baseUrl}/cajas`, caja);
  }

  updateCaja(id: number, caja: UpdateCajaRequest): Observable<Caja> {
    return this.http.put<Caja>(`${this.baseUrl}/cajas/${id}`, caja);
  }

  deleteCaja(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/cajas/${id}`);
  }

  getExpedientesByCaja(cajaId: number): Observable<Expediente[]> {
    return this.http.get<Expediente[]>(`${this.baseUrl}/cajas/${cajaId}/expedientes`);
  }

  // Expedientes
  getExpedientes(): Observable<Expediente[]> {
    return this.http.get<Expediente[]>(`${this.baseUrl}/expedientes`);
  }

  getExpediente(id: number): Observable<Expediente> {
    return this.http.get<Expediente>(`${this.baseUrl}/expedientes/${id}`);
  }

  createExpediente(expediente: CreateExpedienteRequest): Observable<Expediente> {
    return this.http.post<Expediente>(`${this.baseUrl}/expedientes`, expediente);
  }

  updateExpediente(id: number, expediente: UpdateExpedienteRequest): Observable<Expediente> {
    return this.http.put<Expediente>(`${this.baseUrl}/expedientes/${id}`, expediente);
  }

  deleteExpediente(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/expedientes/${id}`);
  }

  // Opciones
  getUbicaciones(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/opciones/ubicaciones`);
  }

  getTiposExpediente(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/opciones/tipos-expediente`);
  }
}
