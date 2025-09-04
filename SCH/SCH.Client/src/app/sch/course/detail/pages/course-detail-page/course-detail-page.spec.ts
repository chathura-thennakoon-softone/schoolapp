import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CourseDetailPage } from './course-detail-page';
import { CourseApi } from '../../../../../sch/services/course-api';
import { APP_CONFIG } from '../../../../../injection-tokens/app-config.token';
import { ToastrService } from 'ngx-toastr';

describe('CourseDetailPage', () => {
  let component: CourseDetailPage;
  let fixture: ComponentFixture<CourseDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseDetailPage],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of({}), snapshot: {} } },
        {
          provide: CourseApi,
          useValue: {
            getCourse: () => of(null),
            insertCourse: () => of(1),
            updateCourse: () => of(void 0),
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

    fixture = TestBed.createComponent(CourseDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
