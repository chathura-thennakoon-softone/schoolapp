import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import {
  AllCommunityModule,
  ModuleRegistry,
  ColDef,
  GridReadyEvent,
  CellClickedEvent,
} from 'ag-grid-community';
import { Course } from '../../../../interfaces/course';
import { ActivatedRoute, Router } from '@angular/router';
import { concat, Observable } from 'rxjs';
import { Notification } from '../../../../services/notification';
import { ConfirmDialog } from '../../../../selectors/confirm-dialog/confirm-dialog';
import { MatDialog } from '@angular/material/dialog';
import { CourseApi } from '../../../../services/course-api';


ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'sch-course-list-page',
  imports: [AgGridAngular],
  templateUrl: './course-list-page.html',
  styleUrl: './course-list-page.scss'
})
export class CourseListPage {

  protected readonly columnDefs: ColDef<
    Course,
    number | string | Date | boolean | null
  >[] = [
      {
        headerName: 'ID',
        field: 'id',
        sortable: true,
        filter: true,
      },
      {
        headerName: 'First Name',
        field: 'name',
        sortable: true,
        filter: true,
      },
      {
        headerName: 'Actions',
        cellRenderer: (params: any) => {
          return `
      <button type="button" class="edit-btn" data-action="edit">Edit</button>
      <button type="button" class="delete-btn" data-action="delete">Delete</button>
    `;
        },
        width: 200,
        suppressMovable: true,
      },
    ];

  protected rowData: Course[] = [];

  protected gridDataLoading = false;
  public isDeleting = false;


  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router,
    private readonly _avRoute: ActivatedRoute,
    private readonly courseApi: CourseApi,
    private readonly notification: Notification,
    @Inject(MatDialog) private readonly dialog: MatDialog
  ) { }


  protected onGridReady(params: GridReadyEvent) {
    this.setGridData();
  }

  private setGridData() {
    this.gridDataLoading = true;

    this.courseApi
      .getCourses()
      .subscribe((data) => {
        if (data?.length) {

          this.rowData = data;
        } else {
          this.rowData = [];
        }
        this.cdr.markForCheck();
      })
      .add(() => {
        this.gridDataLoading = false;
      });
  }

  protected onCellClicked(event: CellClickedEvent): void {
    if (event.colDef.headerName === 'Actions') {
      const target = event.event!.target as HTMLElement;
      if (target.dataset['action'] === 'edit') {
        this.onEdit(event.data);
      } else if (target.dataset['action'] === 'delete') {
        this.onDeletes([event.data]);
      }
    }
  }

  private onEdit(course: Course): void {
    this.router.navigate([`../detail/${course.id}`], {
      relativeTo: this._avRoute,
    });
  }

  protected onRemoveAll(): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        message: 'Are you sure you want to remove all courses?',
        cancelText: 'Cancel',
        confirmText: 'Delete',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.onDeletes(this.rowData);
      }
    });
  }

  private onDeletes(courses: Course[]): void {
    this.isDeleting = true;

    const coursesDeleteCalls: Observable<void>[] = [];

    courses.forEach(
      (course) => {
        const coursesDeleteCall = this.courseApi.deleteCourse(course.id);
        coursesDeleteCalls.push(coursesDeleteCall);
      }
    );

    concat(...coursesDeleteCalls).subscribe({
      complete: () => {
        this.setGridData();
        this.notification.success('Course deleted successfully');
        this.isDeleting = false;
      },
      error: (err) => {
        this.notification.error('Failed to delete course');
        this.isDeleting = false;
      }
    });

    this.cdr.markForCheck();

  }

  protected onAdd(): void {
    this.router.navigate(['../detail/0'], { relativeTo: this._avRoute });
  }




}
