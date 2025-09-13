import { TestBed } from '@angular/core/testing';

import { ScrollPositionService } from './scroll-position.service';

describe('ScrollPositionService', () => {
  let service: ScrollPositionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScrollPositionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save and retrieve scroll position', () => {
    const position = { x: 100, y: 200 };
    const route = '/test-route';
    
    service.saveScrollPosition(route, position);
    const retrieved = service.getScrollPosition(route);
    
    expect(retrieved).toEqual(position);
  });

  it('should return null for non-existent route', () => {
    const retrieved = service.getScrollPosition('/non-existent');
    expect(retrieved).toBeNull();
  });

  it('should clear scroll position', () => {
    const position = { x: 100, y: 200 };
    const route = '/test-route';
    
    service.saveScrollPosition(route, position);
    service.clearScrollPosition(route);
    const retrieved = service.getScrollPosition(route);
    
    expect(retrieved).toBeNull();
  });
});