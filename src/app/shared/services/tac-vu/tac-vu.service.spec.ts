import { TestBed } from '@angular/core/testing';

import { TacVuService } from './tac-vu.service';

describe('TacVuService', () => {
  let service: TacVuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TacVuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
