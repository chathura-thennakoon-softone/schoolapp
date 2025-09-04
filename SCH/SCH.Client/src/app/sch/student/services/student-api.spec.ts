import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG } from '../../../injection-tokens/app-config.token';

import { StudentApi } from './student-api';

describe('StudentApi', () => {
  let service: StudentApi;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StudentApi,
        {
          provide: HttpClient,
          useValue: {
            get: () => {},
            post: () => {},
            patch: () => {},
            delete: () => {},
            put: () => {},
          },
        },
        { provide: APP_CONFIG, useValue: { apiUrl: 'http://test' } },
      ],
    });
    service = TestBed.inject(StudentApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
