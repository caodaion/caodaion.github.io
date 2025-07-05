import { Pipe, PipeTransform } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common/common.service';

@Pipe({
    name: 'searchKinh',
    standalone: false
})
export class SearchKinhPipe implements PipeTransform {

  constructor(private commonService: CommonService) {

  }

  transform(value: any, option: any): any {
    if (!option?.searchText && !option?.selected) {
      return value?.sort((a: any, b: any) => a?.distance < b?.distance ? -1 : 1);
    }
    const searchContent = this.commonService.generatedSlug(`${option?.searchText}`)
    return value?.filter((ch: any) => {
      return this.commonService.generatedSlug(`${ch.name}`)?.includes(searchContent)
    })
  }

}
