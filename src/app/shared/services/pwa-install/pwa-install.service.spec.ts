import { TestBed } from '@angular/core/testing';

import { PwaInstallService } from './pwa-install.service';

describe('PwaInstallService', () => {
  let service: PwaInstallService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PwaInstallService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should detect if PWA is installed', () => {
    expect(typeof service.isInstalled).toBe('boolean');
  });

  it('should provide install instructions', () => {
    const instructions = service.getInstallInstructions();
    expect(instructions).toBeTruthy();
    expect(typeof instructions).toBe('string');
  });
});
