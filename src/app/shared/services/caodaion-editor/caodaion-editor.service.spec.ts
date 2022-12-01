import { TestBed } from '@angular/core/testing';

import { CaodaionEditorService } from './caodaion-editor.service';

describe('CaodaionEditorService', () => {
  let service: CaodaionEditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CaodaionEditorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
