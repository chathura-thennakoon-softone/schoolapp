import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Teacher } from '../../../../../sch/interfaces/teacher';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TeacherApi } from '../../../../../sch/services/teacher-api';
import { CommonModule } from '@angular/common';
import { Notification } from '../../../../../services/notification';


@Component({
  selector: 'sch-teacher-detail-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './teacher-detail-page.html',
  styleUrl: './teacher-detail-page.scss'
})
export class TeacherDetailPage {
  protected teacherId = 0;

  protected teacher: Teacher | null = null;

  protected isTeacherLoading = false;
  protected isTeacherSaving = false;

  protected teacherForm: FormGroup;

  constructor(
    private readonly _avRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly cdr: ChangeDetectorRef,
    private readonly teacherApi: TeacherApi,
    private readonly notification: Notification
  ) {
    this.teacherForm = this.fb.group({
      id: [0],
      name: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  ngOnInit(): void {
    this._avRoute.params.subscribe((params) => {
      this.teacherId = +params['id'] || 0;

      this.setTeacher();
    });
  }

  private reset(): void {
    this.teacher = null;
    this.teacherForm.reset({
      id: 0,
      name: '',
    });
  }

  private setTeacher(): void {
    this.reset();
    if (this.teacherId) {
      this.isTeacherLoading = true;
      this.teacherApi
        .getTeacher(this.teacherId)
        .subscribe({
          next: (teacher) => {
            if (teacher) {
              this.teacher = teacher;

              this.setFormData();
            } else {
              this.router.navigate(['../', 0], { relativeTo: this._avRoute });
            }
          },
          error: (error) => {
            if (error.status === 404) {
              this.router.navigate(['../', 0], { relativeTo: this._avRoute });
            }
          },
        })
        .add(() => {
          this.isTeacherLoading = false;
          this.cdr.markForCheck();
        });
    } else {
      this.setFormData();
    }
  }

  private setFormData(): void {
    if (this.teacher) {
      this.teacherForm.setValue({
        id: this.teacher.id,
        name: this.teacher.name,
      });
    }
  }

  protected onSubmit() {
    if (this.teacherForm.valid) {

      this.saveTeacher();
    } else {
      this.validateAllFormFields(this.teacherForm);
    }
  }




  private saveTeacher(): void {
    const teacher: Teacher = {
      id: this.teacherForm.value.id,
      name: this.teacherForm.value.name,
    };

    if (teacher.id > 0) {
      this.isTeacherSaving = true;
      this.teacherApi
        .updateTeacher(teacher)
        .subscribe({
          next: () => {
            this.setTeacher();
            this.notification.success('Teacher updated successfully');
          },
          error: (error) => {
            this.notification.error('Failed to update teacher');
          },
        })
        .add(() => {
          this.isTeacherSaving = false;
        });
    } else {
      this.isTeacherSaving = true;
      this.teacherApi
        .insertTeacher(teacher)
        .subscribe({
          next: (id) => {
            this.router.navigate(['../', id], { relativeTo: this._avRoute });
            this.notification.success('Teacher added successfully');
          },
          error: (error) => {
            this.notification.error('Failed to add teacher');
          },
        })
        .add(() => {
          this.isTeacherSaving = false;
        });
    }
  }

  public onBack(): void {
    this.router.navigate(['../../list'], { relativeTo: this._avRoute });
  }

  private validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  protected get formControls() {
    return this.teacherForm.controls;
  }
}
