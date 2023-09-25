import { TestBed } from '@angular/core/testing';

import { SoanSoService } from './soan-so.service';

describe('SoanSoService', () => {
  let service: SoanSoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SoanSoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
