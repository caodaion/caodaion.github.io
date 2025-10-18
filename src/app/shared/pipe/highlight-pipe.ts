import { inject, Pipe, PipeTransform } from '@angular/core';
import { CommonService } from '../services/common.service';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {

  private readonly commonService = inject(CommonService);
  
  transform(value: string, searchText: string): string {
    if (!value || !searchText) return value;

    // Convert search text to slug for normalized searching
    const searchSlug = this.commonService.generatedSlug(searchText);
    if (!searchSlug) return value;

    let result = '';
    let i = 0;
    
    while (i < value?.length) {
      let found = false;
      
      // Try to match starting from current position
      for (let j = i + 1; j <= value?.length; j++) {
        const substring = value?.substring(i, j);
        const substringSlug = this.commonService.generatedSlug(substring);
        
        if (substringSlug === searchSlug) {
          // Found exact match
          result += `<mark>${substring}</mark>`;
          i = j;
          found = true;
          break;
        } else if (substringSlug && searchSlug.startsWith(substringSlug)) {
          // Continue searching for longer match
          continue;
        } else {
          // No more possible matches from this position
          break;
        }
      }
      
      if (!found) {
        // No match found, add current character and move forward
        result += value[i];
        i++;
      }
    }
    
    return result;
  }

}
