import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentCourse } from './student-course';

describe('StudentCourse', () => {
  let component: StudentCourse;
  let fixture: ComponentFixture<StudentCourse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentCourse]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentCourse);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
