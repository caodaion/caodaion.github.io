import { TestBed } from '@angular/core/testing';

import { EnglishService } from './english.service';

describe('EnglishService', () => {
  let service: EnglishService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnglishService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
