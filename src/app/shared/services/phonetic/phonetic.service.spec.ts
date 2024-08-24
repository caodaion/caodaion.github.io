import { TestBed } from '@angular/core/testing';

import { PhoneticService } from './phonetic.service';

describe('PhoneticService', () => {
  let service: PhoneticService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhoneticService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
