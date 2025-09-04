import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { StudentDetailPage } from './student-detail-page';
import { StudentApi } from '../../../services/student-api';
import { ImageApi } from '../../../../../sch/services/image-api';
import { APP_CONFIG } from '../../../../../injection-tokens/app-config.token';
import { ToastrService } from 'ngx-toastr';

describe('StudentDetailPage', () => {
  let component: StudentDetailPage;
  let fixture: ComponentFixture<StudentDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentDetailPage],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of({}), snapshot: {} } },
        {
          provide: StudentApi,
          useValue: {
            getStudent: () => of(null),
            insertStudent: () => of(1),
            updateStudent: () => of(void 0),
          },
        },
        {
          provide: ImageApi,
          useValue: {
            uploadStudentProfile: () => of({ filename: 'x' }),
            deleteStudentProfile: () => of(void 0),
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
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
