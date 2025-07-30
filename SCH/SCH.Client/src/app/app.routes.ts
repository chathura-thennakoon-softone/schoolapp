import { Routes } from '@angular/router';
import { schRoutes } from './sch/sch.routes';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./containers/general-container/general-container').then(
        (m) => m.GeneralContainer
      ),
    children: schRoutes
  },
];
