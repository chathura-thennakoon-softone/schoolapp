import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG } from '../../injection-tokens/app-config.token';

import { ImageApi } from './image-api';

describe('ImageApi', () => {
  let service: ImageApi;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ImageApi,
        {
          provide: HttpClient,
          useValue: { get: () => {}, post: () => {}, delete: () => {} },
        },
        { provide: APP_CONFIG, useValue: { apiUrl: 'http://test' } },
      ],
    });
    service = TestBed.inject(ImageApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
