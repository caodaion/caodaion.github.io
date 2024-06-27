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
    const searchContent = this.commonService.generatedSlug(`${option?.searchText}`)
    return value?.filter((ch: any) => {
      return this.commonService.generatedSlug(`${ch.name}`)?.includes(searchContent) ||
        this.commonService.generatedSlug(`${ch.address}`)?.includes(searchContent) ||
        this.commonService.generatedSlug(`${ch.organization}`)?.includes(searchContent)
    })?.sort((a: any, b: any) => a?.distance < b?.distance ? -1 : 1)
  }

}
