import { TestBed } from '@angular/core/testing';

import { DienThoPhatMauService } from './dien-tho-phat-mau.service';

describe('DienThoPhatMauService', () => {
  let service: DienThoPhatMauService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DienThoPhatMauService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
