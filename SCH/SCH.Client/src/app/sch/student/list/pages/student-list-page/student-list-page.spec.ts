import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { StudentListPage } from './student-list-page';
import { StudentApi } from '../../../services/student-api';
import { APP_CONFIG } from '../../../../../../app/injection-tokens/app-config.token';
import { ToastrService } from 'ngx-toastr';
import { ImageApi } from '../../../../../sch/services/image-api';

describe('StudentListPage', () => {
  let component: StudentListPage;
  let fixture: ComponentFixture<StudentListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentListPage],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of({}), snapshot: {} } },
        {
          provide: StudentApi,
          useValue: {
            getStudents: () => of([]),
            deleteStudent: () => of(void 0),
          },
        },
        { provide: APP_CONFIG, useValue: { apiUrl: 'http://test' } },
        {
          provide: ToastrService,
          useValue: {
            success: () => {},
            error: () => {},
            warning: () => {},
            info: () => {},
          },
        },
        {
          provide: ImageApi,
          useValue: { deleteStudentProfile: () => of(void 0) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
