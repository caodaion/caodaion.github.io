import { TestBed } from '@angular/core/testing';

import { TinyUrlService } from './tiny-url.service';

describe('TinyUrlService', () => {
  let service: TinyUrlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TinyUrlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
