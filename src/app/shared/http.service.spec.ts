import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { HttpService } from './http.service';

describe('HttpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpService = TestBed.get(HttpService);
    expect(service).toBeTruthy();
  });
  it('should get all users', () => {
    const service: HttpService = TestBed.get(HttpService);
    const backend: HttpTestingController = TestBed.get(HttpService);
    expect(service).toBeTruthy();
  });
});
