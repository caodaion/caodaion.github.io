import { Injectable, Injector } from '@angular/core';
import { BaseDbService } from '../../../shared/services/base.db.service';
import { v4 as uuidv4 } from 'uuid';

// Interface for Tuan Cuu event
export interface TuanCuuEvent {
  date: Date;
  lunarDate?: { day: number; month: number; year: number | string };
  sequence: string;
  weekDay?: string;
  eventTime?: string; // Time for the event ceremony, default is "Dậu"
}

// Interface for deceased person information
export interface DeceasedPerson {
  name: string;
  age?: string | number;
  gender: 'male' | 'female';
  deathDate: Date;
  deathLunarDate?: { day: number; month: number; year: number | string };
  deathTime?: string | number;
  title: string;
  subTitle?: string;
  holyName?: string;
  color?: string;
}

// Interface for Tuan Cuu
export interface TuanCuu {
  id: string;
  name: string;
  status: 'active' | 'upcoming' | 'completed';
  startDate: Date;
  endDate: Date;
  events: any[];
  deceased: DeceasedPerson;
  summary?: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TuanCuuService {
  constructor(private baseDbService: BaseDbService, private injector: Injector) {}

  // Get all Tuan Cuu entries
  async getTuanCuuList(): Promise<TuanCuu[]> {
    try {
      const tuanCuuEntries = await this.baseDbService.tuanCuu.toArray();
      
      // Convert date strings to Date objects for all entries
      return tuanCuuEntries.map(entry => this.convertDates(entry));
    } catch (error) {
      console.error('Error getting Tuan Cuu list:', error);
      throw error;
    }
  }

  // Get a single Tuan Cuu by ID
  async getTuanCuuById(id: string): Promise<TuanCuu | undefined> {
    try {
      const tuanCuu = await this.baseDbService.tuanCuu.get(id);
      if (tuanCuu) {
        return this.convertDates(tuanCuu);
      }
      return undefined;
    } catch (error) {
      console.error('Error getting Tuan Cuu by ID:', error);
      throw error;
    }
  }

  // Add a new Tuan Cuu
  async addTuanCuu(tuanCuu: TuanCuu): Promise<string> {
    try {
      // Ensure ID exists
      if (!tuanCuu.id) {
        tuanCuu.id = uuidv4();
      }
      
      // Set timestamps
      tuanCuu.createdAt = new Date();
      tuanCuu.updatedAt = new Date();
      
      // Calculate status if not provided
      if (!tuanCuu.status) {
        tuanCuu.status = this.calculateStatus(tuanCuu);
      }
      
      await this.baseDbService.tuanCuu.add(tuanCuu);
      
      // Refresh calendar events after adding
      this.refreshCalendarEvents();
      
      return tuanCuu.id;
    } catch (error) {
      console.error('Error adding Tuan Cuu:', error);
      throw error;
    }
  }

  // Update an existing Tuan Cuu
  async updateTuanCuu(id: string, tuanCuu: TuanCuu): Promise<void> {
    try {
      // Update timestamp
      tuanCuu.updatedAt = new Date();
      
      // Calculate status if not provided
      if (!tuanCuu.status) {
        tuanCuu.status = this.calculateStatus(tuanCuu);
      }
      
      await this.baseDbService.tuanCuu.update(id, tuanCuu);
      
      // Refresh calendar events after updating
      this.refreshCalendarEvents();
    } catch (error) {
      console.error('Error updating Tuan Cuu:', error);
      throw error;
    }
  }

  // Delete a Tuan Cuu
  async deleteTuanCuu(id: string): Promise<void> {
    try {
      await this.baseDbService.tuanCuu.delete(id);
      
      // Refresh calendar events after deletion
      this.refreshCalendarEvents();
    } catch (error) {
      console.error('Error deleting Tuan Cuu:', error);
      throw error;
    }
  }

  // Calculate status based on dates
  calculateStatus(tuanCuu: TuanCuu): 'active' | 'upcoming' | 'completed' {
    const now = new Date();
    const startDate = new Date(tuanCuu.startDate);
    const endDate = new Date(tuanCuu.endDate);

    if (now < startDate) {
      return 'upcoming';
    } else if (now > endDate) {
      return 'completed';
    } else {
      return 'active';
    }
  }

  // Update statuses for all Tuan Cuu entries
  async updateAllStatuses(): Promise<void> {
    try {
      const tuanCuuList = await this.getTuanCuuList();
      
      for (const tuanCuu of tuanCuuList) {
        const newStatus = this.calculateStatus(tuanCuu);
        
        // Only update if status has changed
        if (tuanCuu.status !== newStatus) {
          tuanCuu.status = newStatus;
          await this.updateTuanCuu(tuanCuu.id, tuanCuu);
        }
      }
    } catch (error) {
      console.error('Error updating Tuan Cuu statuses:', error);
      throw error;
    }
  }

  // Convert date strings to Date objects for serialization/deserialization
  private convertDates(tuanCuu: any): TuanCuu {
    // Convert main dates
    if (typeof tuanCuu.startDate === 'string') {
      tuanCuu.startDate = new Date(tuanCuu.startDate);
    }
    
    if (typeof tuanCuu.endDate === 'string') {
      tuanCuu.endDate = new Date(tuanCuu.endDate);
    }
    
    if (typeof tuanCuu.createdAt === 'string') {
      tuanCuu.createdAt = new Date(tuanCuu.createdAt);
    }
    
    if (typeof tuanCuu.updatedAt === 'string') {
      tuanCuu.updatedAt = new Date(tuanCuu.updatedAt);
    }
    
    // Convert deceased death date
    if (tuanCuu.deceased && typeof tuanCuu.deceased.deathDate === 'string') {
      tuanCuu.deceased.deathDate = new Date(tuanCuu.deceased.deathDate);
    }
    
    // Convert event dates
    if (tuanCuu.events && Array.isArray(tuanCuu.events)) {
      tuanCuu.events = tuanCuu.events.map((event: any) => {
        if (typeof event.date === 'string') {
          event.date = new Date(event.date);
        }
        return event;
      });
    }
    
    return tuanCuu as TuanCuu;
  }

  // Refresh calendar events
  private refreshCalendarEvents(): void {
    console.log('Refreshing calendar events...');
    
    // Use dynamic import to avoid circular dependency with calendar service
    // if (typeof window !== 'undefined') {
    //   setTimeout(() => {
    //     import('../../lich/services/calendar.service').then(module => {
    //       try {
    //         // Try to get the calendar service from the global app injector
    //         const appInjector = (window as any).appInjector;
    //         if (appInjector) {
    //           const calendarService = appInjector.get(module.CalendarService);
    //           if (calendarService && typeof calendarService.refreshTuanCuuEvents === 'function') {
    //             calendarService.refreshTuanCuuEvents();
    //           }
    //         }
    //       } catch (error) {
    //         console.error('Error refreshing calendar with Tuần Cửu events:', error);
    //       }
    //     });
    //   }, 500); // Small delay to ensure database operations are complete
    // }
  }
}