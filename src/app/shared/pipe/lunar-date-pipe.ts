import { DecimalPipe } from '@angular/common';
import { inject, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lunarDate'
})
export class LunarDatePipe implements PipeTransform {

  decimalPipe = inject(DecimalPipe);

  transform(value: any, format: any): unknown {
    if (!value) return '';
    switch (format) {
      case 'full':
        return `${this.decimalPipe.transform(value.day, '2.0-0')}/${this.decimalPipe.transform(value.month, '2.0-0')}${value?.leap ? 'N' : ''}/${value.year}`;
      case 'date-month':
        return `${this.decimalPipe.transform(value.day, '2.0-0')}/${this.decimalPipe.transform(value.month, '2.0-0')}${value?.leap ? 'N' : ''}`;
      case 'year':
        return `${value.year}`;
      case 'date':
        return `${this.decimalPipe.transform(value.day, '2.0-0')}`;
      case 'month':
        return `${this.decimalPipe.transform(value.month, '2.0-0')}${value?.leap ? 'N' : ''}`;
      default:
        return `${this.decimalPipe.transform(value.day, '2.0-0')}/${this.decimalPipe.transform(value.month, '2.0-0')}${value?.leap ? 'N' : ''}/${value.year}`;
    }
  }

}
