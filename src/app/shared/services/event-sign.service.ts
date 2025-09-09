import { Injectable } from '@angular/core';
import { EVENT_SIGN } from '../constants/event-sign.constant';
import { CalendarService } from './calendar/calendar.service';

@Injectable({
  providedIn: 'root'
})
export class EventSignService {

  readonly currentDate = new Date()
  constructor(
    private calendarService: CalendarService
  ) { }

  getEventSigns() {
    return EVENT_SIGN?.filter((item: any) => {
      const dateInfo = item?.time;
      if (!dateInfo) return false;

      // Only match solar calendar and yearly events
      if (dateInfo.calendarType !== 'solar' || dateInfo.year !== 'yearly') return false;

      const eventMonth = dateInfo.month;
      const eventDate = dateInfo.date;

      // Calculate event date for this year
      const eventThisYear = new Date(this.currentDate.getFullYear(), eventMonth - 1, eventDate);

      // If 'before' is specified, check if current date is within the 'before' range
      if (dateInfo.before && dateInfo.before.unit === 'day' && typeof dateInfo.before.value === 'number') {
        const beforeDate = new Date(eventThisYear);
        beforeDate.setDate(eventThisYear.getDate() - dateInfo.before.value);

        // Check if currentDate is between beforeDate and eventThisYear (inclusive)
        return (
          this.currentDate >= beforeDate &&
          this.currentDate <= eventThisYear
        );
      }

      // Default: match only on the exact event date
      return (
        eventMonth === this.currentDate.getMonth() + 1 &&
        eventDate === this.currentDate.getDate()
      );
    });
  }
}
