import { TestBed } from '@angular/core/testing';

import { CongPhuService } from './cong-phu.service';

describe('CongPhuService', () => {
  let service: CongPhuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CongPhuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
