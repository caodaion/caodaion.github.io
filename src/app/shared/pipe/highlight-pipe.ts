import { inject, Pipe, PipeTransform } from '@angular/core';
import { CommonService } from '../services/common.service';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {

  private readonly commonService = inject(CommonService);
  
  transform(value: string, searchText: string): string {
    if (!value || !searchText) return value;

    // Escape ký tự đặc biệt trong regex (vd: . * + ?)
    const escaped = this.commonService.generatedSlug(searchText);
    const re = new RegExp(escaped, 'gi');

    return value.replace(re, (match: string) => `<mark>${match}</mark>`);
  }

}
