import { Injectable } from '@angular/core';
import { Observable, map, switchMap, from, of } from 'rxjs';
import { CalendarEvent } from './lich.service';
import {
  TuanCuu,
  TuanCuuService,
  TuanCuuEvent,
} from '../../tuan-cuu/services/tuan-cuu.service';
import { CAODAI_TITLE } from '../../../shared/constants/master-data/caodai-title.constant';

@Injectable({
  providedIn: 'root',
})
export class TuanCuuCalendarService {
  constructor(private tuanCuuService: TuanCuuService) {}

  /**
   * Get Tuần Cửu events formatted as CalendarEvents
   */
  getTuanCuuCalendarEvents(): Observable<CalendarEvent[]> {
    return from(this.tuanCuuService.getTuanCuuList()).pipe(
      map((tuanCuuList) => {
        // Filter to only active and upcoming Tuần Cửu
        const relevantTuanCuu = tuanCuuList.filter(
          (tc) => tc.status === 'active' || tc.status === 'upcoming'
        );

        // Convert each Tuần Cửu event to a CalendarEvent
        return this.convertToCalendarEvents(relevantTuanCuu);
      })
    );
  }

  /**
   * Convert Tuần Cửu data to calendar events
   */
  private convertToCalendarEvents(tuanCuuList: TuanCuu[]): CalendarEvent[] {
    const calendarEvents: CalendarEvent[] = [];

    tuanCuuList.forEach((tuanCuu) => {
      // For each event in the Tuần Cửu
      tuanCuu.events.forEach((event: TuanCuuEvent) => {
        // Create title based on format "Cầu siêu [sequence] cho [title] [name] [holyName]"
        let title = ``;

        // Add honorific title and name
        if (tuanCuu.deceased) {
          // Determine the proper title display
          let titleDisplay = '';
          const foundTitle: any = CAODAI_TITLE?.data?.find(
            (item: any) => item.key === tuanCuu.deceased.title
          );

          title = foundTitle?.eventTitle || 'Cầu Siêu';
          title += ` ${event.sequence}`;

          switch (tuanCuu.deceased.title) {
            case 'chua-co-dao':
            case 'dao-huu':
              titleDisplay =
                foundTitle?.howToAddress[tuanCuu.deceased?.gender] || '';
              break;
            case 'chuc-viec':
            case 'bao-quan':
            case 'thoi-quan':
              titleDisplay = (tuanCuu.deceased?.subTitle ?
                foundTitle?.subTitle?.find(
                  (st: any) => st?.key === tuanCuu.deceased?.subTitle
                )?.name : foundTitle?.name) || '';
              break;
            default:
              titleDisplay = foundTitle?.name;
          }

          // Add title if available
          if (titleDisplay) {
            title += ` cho ${titleDisplay}`;
          } else {
            title += ' cho';
          }

          // Add name
          if (!tuanCuu.deceased.holyName && tuanCuu.deceased.name) {
            title += ` ${tuanCuu.deceased.name}`;
          }

          // Add holy name if available for male
          if (tuanCuu.deceased.holyName) {
            title += ` ${tuanCuu.deceased.holyName}`;
          }
        }

        // Create calendar event
        const calendarEvent: CalendarEvent = {
          tuanCuuId: `${tuanCuu.id}`,
          id: `tuancuu-${tuanCuu.id}-${event.sequence}`,
          title: title,
          description: `${tuanCuu.summary || ''}`,
          subtitle: event.sequence,
          type: 'tuan-cuu',
          color: '#9C27B0', // Update to match filter color
          textColor: '#ffffff',
          allDay: true,
          eventTime: event.eventTime || 'Dậu', // Use the event's time or default to "Dậu"
          solar: {
            year: event.date.getFullYear(),
            month: event.date.getMonth() + 1,
            day: event.date.getDate(),
          },
          lunar: event.lunarDate
            ? {
                day: event.lunarDate.day as number,
                month: event.lunarDate.month as number,
                year:
                  typeof event.lunarDate.year === 'number'
                    ? event.lunarDate.year
                    : undefined,
              }
            : undefined,
        };

        calendarEvents.push(calendarEvent);
      });
    });

    return calendarEvents;
  }
}
