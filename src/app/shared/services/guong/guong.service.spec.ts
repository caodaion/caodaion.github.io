import { TestBed } from '@angular/core/testing';

import { GuongService } from './guong.service';

describe('GuongService', () => {
  let service: GuongService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GuongService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
