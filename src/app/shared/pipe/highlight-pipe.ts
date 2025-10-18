import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {

  transform(value: string, searchText: string): string {
    if (!value || !searchText) return value;

    // Escape ký tự đặc biệt trong regex (vd: . * + ?)
    const escaped = searchText.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const re = new RegExp(escaped, 'gi');

    return value.replace(re, (match) => `<mark>${match}</mark>`);
  }

}
