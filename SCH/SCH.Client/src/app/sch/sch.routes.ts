import { Routes } from "@angular/router";
import { studentRoutes } from './student/student.routes';
import { StudentApi } from "./student/services/student-api";

export const schRoutes: Routes = [
  {
    path: '',
    redirectTo: 'student',
    pathMatch: 'full',
  },
  {
    path: 'student',
    providers: [
      {
        provide: StudentApi,
        useClass: StudentApi
      },
    ],
    children: studentRoutes
  }
];