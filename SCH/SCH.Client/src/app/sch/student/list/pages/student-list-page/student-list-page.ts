import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import {
  AllCommunityModule,
  ModuleRegistry,
  ColDef,
  GridReadyEvent,
  CellClickedEvent,
} from 'ag-grid-community';
import { Student } from '../../../../interfaces/student';
import { StudentApi } from '../../../services/student-api';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfig } from '../../../../../interfaces/app-config';
import { APP_CONFIG } from '../../../../../injection-tokens/app-config.token';
import { ImageApi } from '../../../../services/image-api';
import { catchError } from 'rxjs/operators';
import { concatMap, from, mergeMap, of } from 'rxjs';
import { Notification } from '../../../../../services/notification';
import { ConfirmDialog } from '../../../../../selectors/confirm-dialog/confirm-dialog';
import { MatDialog } from '@angular/material/dialog';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'sch-student-list-page',
  imports: [AgGridAngular],
  templateUrl: './student-list-page.html',
  styleUrl: './student-list-page.scss',
})
export class StudentListPage {
  protected readonly columnDefs: ColDef<
    Student,
    number | string | Date | boolean | null
  >[] = [
      {
        headerName: 'Photo',
        field: 'imageUrl',
        width: 80,
        cellRenderer: (params: any) => {
          if (params.value) {
            return `<img src="${params.value}" alt="Student" style="width:40px;height:40px;border-radius:50%;" />`;
          }
          return '';
        },
        sortable: false,
        filter: false,
        suppressMovable: true,
      },
      {
        headerName: 'ID',
        field: 'id',
        sortable: true,
        filter: true,
      },
      {
        headerName: 'First Name',
        field: 'firstName',
        sortable: true,
        filter: true,
      },
      {
        headerName: 'Last Name',
        field: 'lastName',
        sortable: true,
        filter: true,
      },
      {
        headerName: 'Email',
        field: 'email',
        sortable: true,
        filter: true,
      },
      {
        headerName: 'Phone Number',
        field: 'phoneNumber',
        sortable: true,
        filter: true,
      },
      {
        headerName: 'SSN',
        field: 'ssn',
        sortable: true,
        filter: true,
      },
      {
        headerName: 'Start Date',
        field: 'startDate',
        sortable: true,
        filter: true,
      },
      {
        headerName: 'Active',
        field: 'isActive',
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

  protected rowData: Student[] = [];

  protected gridDataLoading = false;
  public isDeleting = false;

  private readonly apiUrl: string;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router,
    private readonly _avRoute: ActivatedRoute,
    private readonly studentApi: StudentApi,
    @Inject(APP_CONFIG) private readonly appConfig: AppConfig,
    private readonly imageApi: ImageApi,
    private readonly notification: Notification,
    @Inject(MatDialog) private readonly dialog: MatDialog
  ) {
    this.apiUrl = this.appConfig.apiUrl;
  }

  protected onGridReady(params: GridReadyEvent) {
    this.setGridData();
  }

  private setGridData() {
    this.gridDataLoading = true;

    this.studentApi
      .getStudents(true)
      .subscribe((data) => {
        if (data?.length) {
          data.forEach((student: Student) => {
            if (student.startDate) {
              student.startDate = new Date(student.startDate);
            }

            if (student.image) {
              student.imageUrl = `${this.apiUrl}/Image/getStudentProfile/${student.image}`;
            } else {
              student.imageUrl = '';
            }
          });

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

  private onEdit(student: Student): void {
    this.router.navigate([`../detail/${student.id}`], {
      relativeTo: this._avRoute,
    });
  }

  protected onRemoveAll(): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        message: 'Are you sure you want to remove all students?',
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

  private onDeletes(students: Student[]): void {
    this.isDeleting = true;

    from(students)
      .pipe(
        concatMap((student) => {
          if (student.image) {
            return this.imageApi.deleteStudentProfile(student.image).pipe(
              catchError(() => of(null)),
              mergeMap(() => this.studentApi.deleteStudent(student.id))
            );
          } else {
            return this.studentApi.deleteStudent(student.id);
          }
        })
      )
      .subscribe({
        complete: () => {
          this.setGridData();
          this.notification.success('Student deleted successfully');
          this.isDeleting = false;
        },
        error: (err) => {
          this.notification.error('Failed to delete student');
          this.isDeleting = false;
        },
      });

    this.cdr.markForCheck();
  }

  protected onAdd(): void {
    this.router.navigate(['../detail/0'], { relativeTo: this._avRoute });
  }
}
