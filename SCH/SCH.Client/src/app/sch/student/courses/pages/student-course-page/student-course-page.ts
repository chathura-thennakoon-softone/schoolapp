import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentCourseMap } from '../../../../../sch/interfaces/student-course-map';
import {
  AllCommunityModule,
  CellClickedEvent,
  ColDef,
  GridReadyEvent,
  ModuleRegistry,
} from 'ag-grid-community';
import { StudentApi } from '../../../services/student-api';
import { AgGridAngular } from 'ag-grid-angular';
import { Course } from '../../../../../sch/interfaces/course';
import { CourseApi } from '../../../../../sch/services/course-api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'sch-student-course-page',
  imports: [CommonModule, FormsModule, AgGridAngular],
  templateUrl: './student-course-page.html',
  styleUrl: './student-course-page.scss',
})
export class StudentCoursePage {
  protected studentId = 0;

  protected readonly columnDefs: ColDef<
    StudentCourseMap,
    number | string | Date | boolean | null
  >[] = [
    {
      headerName: 'StudentId',
      field: 'studentId',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'CourseId',
      field: 'courseId',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Enrollment Date',
      field: 'enrollmentDate',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Student First Name',
      field: 'studentFirstName',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Student Last Name',
      field: 'studentLastName',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Course Name',
      field: 'courseName',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Actions',
      cellRenderer: (params: any) => {
        return `
      <button type="button" class="delete-btn" data-action="delete">Delete</button>
    `;
      },
      width: 200,
      suppressMovable: true,
    },
  ];

  protected rowData: StudentCourseMap[] = [];
  protected courses: Course[] = [];

  protected selectedCourseId: number | null = null;

  protected gridDataLoading = false;
  protected coursesLoading = false;
  protected isDeleting = false;
  protected isAdding = false;
  protected isEditing = false;

  constructor(
    private readonly _avRoute: ActivatedRoute,
    private readonly cdr: ChangeDetectorRef,
    private readonly studentApi: StudentApi,
    private readonly courseApi: CourseApi
  ) {}

  ngOnInit(): void {
    this._avRoute.params.subscribe((params) => {
      this.studentId = +params['id'] || 0;
    });

    this.setCourses();
  }

  private setCourses(): void {
    this.coursesLoading = true;

    this.courseApi.getCourses().subscribe((courses) => {
      this.courses = courses;
      this.coursesLoading = false;
      this.cdr.markForCheck();
    });
  }

  protected onGridReady(params: GridReadyEvent) {
    this.setGridData();
  }

  private setGridData(): void {
    this.gridDataLoading = true;

    this.studentApi
      .getCourses(this.studentId)
      .subscribe((data) => {
        if (data?.length) {
          this.rowData = data;
        } else {
          this.rowData = [];
        }
      })
      .add(() => {
        this.gridDataLoading = false;

        this.cdr.markForCheck();
      });
  }

  protected onCellClicked(event: CellClickedEvent): void {
    if (event.colDef.headerName === 'Actions') {
      const target = event.event!.target as HTMLElement;
      if (target.dataset['action'] === 'delete') {
        this.onDeletes([event.data]);
      }
    }
  }

  protected onDeletes(students: StudentCourseMap[]): void {}

  protected onAddCourse(): void {}
}
