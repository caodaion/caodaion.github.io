import { TestBed } from '@angular/core/testing';

import { CauSieuVoViService } from './cau-sieu-vo-vi.service';

describe('CaodaionEditorService', () => {
  let service: CauSieuVoViService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CauSieuVoViService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
