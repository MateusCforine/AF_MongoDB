import { Routes } from '@angular/router';
import { Financeiro } from './financeiro/financeiro';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'financeiro',
    pathMatch: 'full'
  },
  {
    path: 'financeiro',
    component: Financeiro
  }
];
