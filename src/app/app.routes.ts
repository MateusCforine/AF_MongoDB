import { Routes } from '@angular/router';
import { MovimentacoesFinanceira } from './financeiro/financeiro';

export const routes: Routes = [
  { path: '', redirectTo: 'financeiro', pathMatch: 'full' },
  { path: 'financeiro', component: MovimentacoesFinanceira }
];
