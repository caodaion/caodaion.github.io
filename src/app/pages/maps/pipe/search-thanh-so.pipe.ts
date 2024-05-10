import { Pipe, PipeTransform } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common/common.service';

@Pipe({
  name: 'searchThanhSo'
})
export class SearchThanhSoPipe implements PipeTransform {

  constructor(private commonService: CommonService) {

  }

  transform(value: any, option: any): any {
    if (!option?.searchText && !option?.selected) {
      return value?.sort((a: any, b: any) => a?.distance < b?.distance ? -1 : 1);
    }
    return value?.filter((ch: any) => {
      return ((this.commonService.generatedSlug(`${option?.searchText}`)?.split('-')
        .every((x) => {
          return this.commonService.generatedSlug(`${ch.name}`)?.includes(x)
            || this.commonService.generatedSlug(`${ch.address}`)?.includes(x)
            || this.commonService.generatedSlug(`${ch.organization}`)?.includes(x)
        })) || (`${option?.searchText}`?.split(' ').every((x) => {
          return ch.name?.toLowerCase()?.includes(x)
            || ch.address?.toLowerCase()?.includes(x)
            || ch.organization?.toLowerCase()?.includes(x)
        })))
    })?.sort((a: any, b: any) => a?.distance < b?.distance ? -1 : 1)
  }

}
