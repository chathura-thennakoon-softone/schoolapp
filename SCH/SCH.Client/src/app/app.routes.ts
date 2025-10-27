import { Routes } from '@angular/router';
import { schRoutes } from './sch/sch.routes';
import { SidenavService } from './sch/services/sidenav.service';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'sch',
    pathMatch: 'full',
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register-page/register-page').then(
        (m) => m.RegisterPage
      )
  },
  {
    path: 'sch',
    loadComponent: () =>
      import('./sch/pages/schpage/schpage').then(
        (m) => m.SCHPage
      ),
    providers: [
      {
        provide: SidenavService,
        useClass: SidenavService
      },
    ],
    children: schRoutes
  },
  {
    path: 'notfound',
    loadComponent: () =>
      import('./pages/not-found-page/not-found-page').then(
        (m) => m.NotFoundPage
      )
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./pages/unauthorized-page/unauthorized-page').then(
        (m) => m.UnauthorizedPage
      )
  },
  {
    path: 'servererror',
    loadComponent: () =>
      import('./pages/server-error-page/server-error-page').then(
        (m) => m.ServerErrorPage
      )
  },
  {
    path: '**',
    redirectTo: 'notfound',
    pathMatch: 'full'
  }
];
