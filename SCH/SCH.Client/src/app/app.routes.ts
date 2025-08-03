import { Routes } from '@angular/router';
import { schRoutes } from './sch/sch.routes';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./sch/pages/schpage/schpage').then(
        (m) => m.SCHPage
      ),
    children: schRoutes
  },
];
