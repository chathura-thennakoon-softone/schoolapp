import { ChangeDetectorRef, Component } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import {
  AllCommunityModule,
  ModuleRegistry,
  ColDef,
  GridReadyEvent,
} from 'ag-grid-community';
import { Student } from '../../../../interfaces/student';
import { StudentApi } from '../../../services/student-api';

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
    ];

  protected rowData: Student[] = [];

  protected gridDataLoading = false;

  constructor(
    private readonly cdr: ChangeDetectorRef, 
    private readonly studentApi: StudentApi) { }

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
}
