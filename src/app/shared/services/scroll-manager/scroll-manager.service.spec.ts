import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ScrollManagerService } from './scroll-manager.service';
import { ScrollPositionService } from '../scroll-position/scroll-position.service';

describe('ScrollManagerService', () => {
  let service: ScrollManagerService;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockScrollPositionService: jasmine.SpyObj<ScrollPositionService>;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['events']);
    const scrollPositionSpy = jasmine.createSpyObj('ScrollPositionService', [
      'getCurrentScrollPosition',
      'saveScrollPosition',
      'getScrollPosition',
      'restoreScrollPosition',
      'clearScrollPosition',
      'clearAllScrollPositions'
    ]);

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ScrollPositionService, useValue: scrollPositionSpy }
      ]
    });

    service = TestBed.inject(ScrollManagerService);
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockScrollPositionService = TestBed.inject(ScrollPositionService) as jasmine.SpyObj<ScrollPositionService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save current scroll position', () => {
    const mockPosition = { x: 100, y: 200 };
    mockScrollPositionService.getCurrentScrollPosition.and.returnValue(mockPosition);
    
    service.saveCurrentScrollPosition();
    
    expect(mockScrollPositionService.getCurrentScrollPosition).toHaveBeenCalled();
  });

  it('should clear all scroll positions', () => {
    service.clearAllScrollPositions();
    
    expect(mockScrollPositionService.clearAllScrollPositions).toHaveBeenCalled();
  });
});