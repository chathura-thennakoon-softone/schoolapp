import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentCoursePage } from './student-course-page';

describe('StudentCoursePage', () => {
  let component: StudentCoursePage;
  let fixture: ComponentFixture<StudentCoursePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentCoursePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentCoursePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
