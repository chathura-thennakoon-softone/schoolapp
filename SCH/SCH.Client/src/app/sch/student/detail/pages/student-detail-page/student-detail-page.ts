import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Student } from '../../../../interfaces/student';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { StudentApi } from '../../../services/student-api';
import { APP_CONFIG } from '../../../../../injection-tokens/app-config.token';
import { AppConfig } from '../../../../../interfaces/app-config';
import { ImageApi } from '../../../../services/image-api';
import { CommonModule, formatDate } from '@angular/common';
import { Notification } from '../../../../../services/notification';

@Component({
  selector: 'sch-student-detail-page',
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule],
  templateUrl: './student-detail-page.html',
  styleUrl: './student-detail-page.scss',
})
export class StudentDetailPage {
  protected studentId = 0;

  protected student: Student | null = null;

  protected isStudentLoading = false;
  protected isStudentSaving = false;
  protected isUploadingImage = false;
  protected isDeletingImage = false;

  protected studentForm: FormGroup;

  protected isImageChanged = false;
  private profileImageFile: File | null = null;
  protected profileImage = '';
  private readonly apiUrl;

  constructor(
    private readonly _avRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly cdr: ChangeDetectorRef,
    private readonly studentApi: StudentApi,
    private readonly imageApi: ImageApi,
    @Inject(APP_CONFIG) private readonly appConfig: AppConfig,
    private readonly notification: Notification
  ) {
    this.apiUrl = this.appConfig.apiUrl;
    this.studentForm = this.fb.group({
      id: [0],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: [null, [Validators.minLength(2)]],
      email: [null, [Validators.email]],
      phoneNumber: [null, [Validators.pattern('^[0-9]{10}$')]],
      ssn: [null, [Validators.required, Validators.minLength(2)]],
      startDate: [null],
    });
  }

  ngOnInit(): void {
    this._avRoute.params.subscribe((params) => {
      this.studentId = +params['id'] || 0;

      this.setStudent();
    });
  }

  private reset(): void {
    this.student = null;
    this.profileImageFile = null;
    this.profileImage = '';
    this.isImageChanged = false;
    this.studentForm.reset({
      id: 0,
      firstName: '',
      lastName: null,
      email: null,
      phoneNumber: null,
      ssn: null,
      startDate: null,
    });
  }

  private setStudent(): void {
    this.reset();
    if (this.studentId) {
      this.isStudentLoading = true;
      this.studentApi
        .getStudent(this.studentId)
        .subscribe({
          next: (student) => {
            if (student) {
              this.student = student;

              if (this.student.startDate) {
                this.student.startDate = new Date(this.student.startDate);
              }

              if (this.student.image) {
                this.student.imageUrl = `${this.apiUrl}/Image/getStudentProfile/${this.student.image}`;
              } else {
                this.student.imageUrl = '';
              }

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
          this.isStudentLoading = false;
          this.cdr.markForCheck();
        });
    } else {
      this.setFormData();
    }
  }

  private setFormData(): void {
    if (this.student) {
      let date: string | null = null;
      if (this.student.startDate) {
        date = formatDate(this.student.startDate, 'yyyy-MM-dd', 'en');
      }

      this.studentForm.setValue({
        id: this.student.id,
        firstName: this.student.firstName,
        lastName: this.student.lastName,
        email: this.student.email,
        phoneNumber: this.student.phoneNumber,
        ssn: this.student.ssn,
        startDate: date,
      });
    }
  }

  protected onSubmit() {
    if (this.studentForm.valid) {
      if (this.isImageChanged && this.profileImageFile) {
        this.uploadImage();
      } else {
        let image: string | null = null;

        if (this.student) {
          image = this.student.image;
        }

        this.saveStudent(image);
      }
    } else {
      this.validateAllFormFields(this.studentForm);
    }
  }

  private uploadImage(): void {
    this.isUploadingImage = true;

    this.imageApi
      .uploadStudentProfile(this.profileImageFile!)
      .subscribe((data) => {
        this.saveStudent(data.filename);
      })
      .add(() => {
        this.isUploadingImage = false;
      });
  }

  private deleteImage(fileName: string): void {
    this.isDeletingImage = true;
    this.imageApi
      .deleteStudentProfile(fileName)
      .subscribe()
      .add(() => {
        this.isDeletingImage = false;
      });
  }

  private saveStudent(image: string | null): void {
    const student: Student = {
      id: this.studentForm.value.id,
      firstName: this.studentForm.value.firstName,
      lastName: this.studentForm.value.lastName,
      email: this.studentForm.value.email,
      phoneNumber: this.studentForm.value.phoneNumber,
      ssn: this.studentForm.value.ssn,
      startDate: new Date(this.studentForm.value.startDate),
      image: image,
      isActive: true,
      imageUrl: null,
    };

    if (student.id > 0) {
      this.isStudentSaving = true;
      this.studentApi
        .updateStudent(student)
        .subscribe({
          next: () => {
            if (this.isImageChanged && this.student!.image) {
              this.deleteImage(this.student!.image);
            }
            this.setStudent();
            this.notification.success('Student updated successfully');
          },
          error: (error) => {
            this.notification.error('Failed to update student');
          },
        })
        .add(() => {
          this.isStudentSaving = false;
        });
    } else {
      this.isStudentSaving = true;
      this.studentApi
        .insertStudent(student)
        .subscribe({
          next: (id) => {
            this.router.navigate(['../', id], { relativeTo: this._avRoute });
            this.notification.success('Student added successfully');
          },
          error: (error) => {
            this.notification.error('Failed to add student');
          },
        })
        .add(() => {
          this.isStudentSaving = false;
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

  protected onFileChange(event: any) {
    if (event.target.files.length) {
      const file: File = event.target.files[0];
      const mimeType = file.type;
      const fileName = file.name;
      const fileSize = file.size;
      const supportedImageTypes = [
        '.jpg',
        '.png',
        '.jpeg',
        '.JPG',
        '.PNG',
        '.JPEG',
      ];
      const type = supportedImageTypes.find((t) => fileName.endsWith(t));
      const mimeTypePattern = /image\/*/;
      const bannerImageFileMaxSize = 2097152;
      if (mimeTypePattern.exec(mimeType) === null || !type) {
        this.notification.error('File type should be JPG, JPEG or PNG');
      } else if (fileSize > bannerImageFileMaxSize) {
        this.notification.error('Please upload a file that not exceed 2MB');
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          this.profileImage = reader.result as string;
          this.cdr.markForCheck();
        };
        this.isImageChanged = true;
        this.profileImageFile = file;
      }

      this.cdr.markForCheck();
    }
  }

  protected get formControls() {
    return this.studentForm.controls;
  }
}
