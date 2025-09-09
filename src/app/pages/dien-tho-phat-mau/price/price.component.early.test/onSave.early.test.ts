
// Unit tests for: onSave

import { PriceComponent } from '../price.component';


class MockDecimalPipe {
  transform = jest.fn().mockReturnValue('01');
}

class MockDatePipe {
  transform = jest.fn().mockReturnValue('01');
}

class MockCalendarService {
  getConvertedFullDate = jest.fn().mockReturnValue({
    convertSolar2Lunar: { lunarYear: 2023 }
  });
}

class MockCommonService {
  generatedSlug = jest.fn().mockReturnValue('mock-slug');
}

class MockChangeDetectorRef {
  detectChanges = jest.fn();
}

class MockMatDialog {
  open = jest.fn().mockReturnValue({
    afterClosed: jest.fn().mockReturnValue({
      subscribe: jest.fn((callback) => callback())
    })
  });
}

describe('PriceComponent.onSave() onSave method', () => {
  let component: PriceComponent;
  let mockDecimalPipe: MockDecimalPipe;
  let mockDatePipe: MockDatePipe;
  let mockCalendarService: MockCalendarService;
  let mockCommonService: MockCommonService;
  let mockChangeDetectorRef: MockChangeDetectorRef;
  let mockMatDialog: MockMatDialog;

  beforeEach(() => {
    mockDecimalPipe = new MockDecimalPipe() as any;
    mockDatePipe = new MockDatePipe() as any;
    mockCalendarService = new MockCalendarService() as any;
    mockCommonService = new MockCommonService() as any;
    mockChangeDetectorRef = new MockChangeDetectorRef() as any;
    mockMatDialog = new MockMatDialog() as any;

    component = new PriceComponent(
      mockDecimalPipe,
      mockDatePipe,
      mockCalendarService,
      mockCommonService,
      mockChangeDetectorRef,
      mockMatDialog
    );
    component.setting = {
      googleFormsId: 'mock-id',
      data: 'mock-data',
      logFrom: 'mock-logFrom',
      updatedBy: 'mock-updatedBy'
    };
    component.user = { userName: 'mockUser' };
    component.addedData = { name: 'mockName', year: 2023, month: 1, date: 1 };
  });

  describe('Happy Path', () => {
    it('should construct the googleFormPath correctly and open the dialog', () => {
      component.onSave();

      expect(component.googleFormPath).toContain('https://docs.google.com/forms/d/e/mock-id/viewform');
      expect(component.googleFormPath).toContain('mock-data=%5B%7B%22key%22%3A%22price%22%2C%22data%22%3A%7B%22name%22%3A%22mockName%22%2C%22year%22%3A2023%2C%22month%22%3A1%2C%22date%22%3A1%7D%7D%5D');
      expect(component.googleFormPath).toContain('mock-logFrom=2023-01-01');
      expect(component.googleFormPath).toContain('mock-updatedBy=mockUser');
      expect(mockMatDialog.open).toHaveBeenCalledWith(component.savePriceDialog);
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing googleFormsId gracefully', () => {
      component.setting.googleFormsId = undefined;
      component.onSave();

      expect(component.googleFormPath).toBe('https://docs.google.com/forms/d/e/undefined/viewform?mock-data=%5B%7B%22key%22%3A%22price%22%2C%22data%22%3A%7B%22name%22%3A%22mockName%22%2C%22year%22%3A2023%2C%22month%22%3A1%2C%22date%22%3A1%7D%7D%5D&mock-logFrom=2023-01-01&mock-updatedBy=mockUser');
    });

    it('should handle missing userName gracefully', () => {
      component.user.userName = undefined;
      component.onSave();

      expect(component.googleFormPath).toContain('mock-updatedBy=undefined');
    });

    it('should handle missing addedData gracefully', () => {
      component.addedData = undefined as any;
      component.onSave();

      expect(component.googleFormPath).toContain('mock-data=%5B%7B%22key%22%3A%22price%22%2C%22data%22%3Anull%7D%5D');
    });
  });
});

// End of unit tests for: onSave
