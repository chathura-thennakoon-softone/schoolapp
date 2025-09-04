import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG } from '../../injection-tokens/app-config.token';

import { CourseApi } from './course-api';

describe('CourseApi', () => {
  let service: CourseApi;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CourseApi,
        { provide: HttpClient, useValue: { get: () => {}, post: () => {}, patch: () => {}, delete: () => {} } },
        { provide: APP_CONFIG, useValue: { apiUrl: 'http://test' } },
      ],
    });
    service = TestBed.inject(CourseApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
