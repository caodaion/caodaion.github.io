import { Pipe, PipeTransform } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common/common.service';

@Pipe({
    name: 'searchOrganization',
    standalone: true
})
export class SearchOrganizationPipe implements PipeTransform {

  constructor(private commonService: CommonService) {

  }

  transform(value: any, option: any): any {
    if (!option?.searchText) {
      return value;
    }
    const searchContent = this.commonService.generatedSlug(`${option?.searchText}`)
    return value?.filter((ch: any) => {
      return this.commonService.generatedSlug(`${ch}`)?.includes(searchContent)
    })
  }

}
