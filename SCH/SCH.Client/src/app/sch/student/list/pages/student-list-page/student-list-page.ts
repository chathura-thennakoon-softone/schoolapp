import { ChangeDetectorRef, Component } from '@angular/core';
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

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router,
    private readonly _avRoute: ActivatedRoute,
    private readonly studentApi: StudentApi
  ) {}

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
        this.onDelete(event.data);
      }
    }
  }

  private onEdit(student: Student): void {
    this.router.navigate([`../detail/${student.id}`], {
      relativeTo: this._avRoute,
    });
  }

  private onDelete(student: Student): void {

    this.isDeleting = true;
    this.studentApi
      .deleteStudent(student.id)
      .subscribe(() => {
        this.setGridData();
      })
      .add(() => {
        this.isDeleting = false;
      });
  }

  protected onAdd(): void {
    this.router.navigate(['../detail/0'], { relativeTo: this._avRoute });
  }
}
