import { Pipe, PipeTransform } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common/common.service';

@Pipe({
  name: 'searchOrganization'
})
export class SearchOrganizationPipe implements PipeTransform {

  constructor(private commonService: CommonService) {

  }

  transform(value: any, option: any): any {
    if (!option?.searchText) {
      return value;
    }    
    return value?.filter((ch: any) => {
      return ((this.commonService.generatedSlug(`${option?.searchText}`)?.split('-')
        .every((x) => {
          return this.commonService.generatedSlug(`${ch}`)?.includes(x)
        })) || (`${option?.searchText}`?.split(' ').every((x) => {
          return ch?.toLowerCase()?.includes(x)
        })))
    })
  }

}
