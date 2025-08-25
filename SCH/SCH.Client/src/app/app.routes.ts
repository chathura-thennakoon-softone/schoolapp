import { Routes } from '@angular/router';
import { StudentApi } from './student/services/student-api';
import { ImageApi } from './services/image-api';
import { studentRoutes } from './student/student.routes';
import { CourseApi } from './services/course-api';
import { courseRoutes } from './course/course.routes';

export const routes: Routes = [
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
      {
        provide: ImageApi,
        useClass: ImageApi
      },
      {
        provide: CourseApi,
        useClass: CourseApi
      }
    ],
    children: studentRoutes
    
  },
  {
    path: 'course',
    providers: [
      {
        provide: CourseApi,
        useClass: CourseApi
      },
      {
        provide: ImageApi,
        useClass: ImageApi
      }
    ],
    children: courseRoutes
  }
];
