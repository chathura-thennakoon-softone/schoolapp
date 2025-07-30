import { Routes } from "@angular/router";
import { studentRoutes } from './student/student.routes';

export const schRoutes: Routes = [
  {
    path: '',
    redirectTo: 'student',
    pathMatch: 'full',
  },
  {
    path: 'student',
    children: studentRoutes
  }
];