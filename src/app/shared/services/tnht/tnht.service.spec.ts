import { TestBed } from '@angular/core/testing';

import { TnhtService } from './tnht.service';

describe('EventService', () => {
  let service: TnhtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TnhtService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
