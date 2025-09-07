import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/cajas', pathMatch: 'full' },
  { path: 'cajas', loadComponent: () => import('./components/cajas/cajas.component').then(m => m.CajasComponent) },
  { path: 'expedientes', loadComponent: () => import('./components/expedientes/expedientes.component').then(m => m.ExpedientesComponent) },
  { path: '**', redirectTo: '/cajas' }
];
