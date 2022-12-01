import { TestBed } from '@angular/core/testing';

import { KinhService } from './kinh.service';

describe('KinhService', () => {
  let service: KinhService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KinhService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
