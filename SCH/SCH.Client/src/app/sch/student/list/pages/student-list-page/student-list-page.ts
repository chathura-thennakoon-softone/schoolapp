import { Component } from '@angular/core';
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

  //   protected rowData: Student[] = [
  //     {
  //         "id": 1,
  //         "firstName": "FirstName1",
  //         "lastName": "LastName1",
  //         "email": "email1@mail.com",
  //         "phoneNumber": "phonenumber1",
  //         "ssn": "ssn1",
  //         "image": "image1",
  //         "startDate": "2024-11-11T00:00:00",
  //         "isActive": true
  //     },
  //     {
  //         "id": 2,
  //         "firstName": "FirstName2",
  //         "lastName": "LastName2",
  //         "email": "email2@mail.com",
  //         "phoneNumber": "phonenumber2",
  //         "ssn": "ssn2",
  //         "image": "image2",
  //         "startDate": "2024-11-12T00:00:00",
  //         "isActive": true
  //     },
  //     {
  //         "id": 3,
  //         "firstName": "FirstName3",
  //         "lastName": "LastName3",
  //         "email": "email3@mail.com",
  //         "phoneNumber": "phonenumber3",
  //         "ssn": "ssn3",
  //         "image": "image3",
  //         "startDate": "2024-11-13T00:00:00",
  //         "isActive": true
  //     },
  //     {
  //         "id": 4,
  //         "firstName": "FirstName4",
  //         "lastName": "LastName4",
  //         "email": "email4@mail.com",
  //         "phoneNumber": "phonenumber4",
  //         "ssn": "ssn4",
  //         "image": "image4",
  //         "startDate": "2024-11-14T00:00:00",
  //         "isActive": true
  //     },
  //     {
  //         "id": 6,
  //         "firstName": "FirstName6",
  //         "lastName": "LastName6",
  //         "email": "email6@mail.com",
  //         "phoneNumber": "phonenumber6",
  //         "ssn": "ssn6",
  //         "image": "image6",
  //         "startDate": "2024-11-16T00:00:00",
  //         "isActive": true
  //     },
  //     {
  //         "id": 7,
  //         "firstName": "Chathura",
  //         "lastName": "Sudarshana",
  //         "email": "mail@mail.com",
  //         "phoneNumber": "1231231231",
  //         "ssn": "221122112211",
  //         "image": "tvfw2ze3.zi0.png",
  //         "startDate": "2025-07-20T00:00:00",
  //         "isActive": true
  //     }
  // ];
  protected gridDataLoading = false;

  constructor(private readonly studentApi: StudentApi) {}

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

        console.log('Row data loaded:', this.rowData);
      })
      .add(() => {
        this.gridDataLoading = false;
      });
  }
}
