import { TestBed } from '@angular/core/testing';

import { Bcd100Service } from './bcd100.service';

describe('Bcd100Service', () => {
  let service: Bcd100Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Bcd100Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
