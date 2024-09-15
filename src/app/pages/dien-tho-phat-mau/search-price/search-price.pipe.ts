import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common/common.service';

@Pipe({
  name: 'searchPrice'
})
export class SearchPricePipe implements PipeTransform {

  constructor(
    private commonService: CommonService,
    private decimalPipe: DecimalPipe
  ) {

  }

  transform(value: any, options: any): any {
    const searchContent = this.commonService.generatedSlug(`${options?.searchText}`)
    value = value?.sort((a: any, b: any) => {
      return new Date(a?.logFrom) > new Date(b?.logFrom) ? 1 : -1
    })
    value = value?.sort((a: any, b: any) => {
      return (this.commonService.generatedSlug(a[options?.orderBy]) > this.commonService.generatedSlug(b[options?.orderBy]) ? (options?.isAsc ? 1 : -1) : (options?.isAsc ? -1 : 1))
    })
    if (!searchContent) {
      return value;
    }
    return value?.filter((item: any) => {
      return this.commonService.generatedSlug(`${item.name}`)?.includes(searchContent) ||
        this.commonService.generatedSlug(`${item.unit}`)?.includes(searchContent) ||
        this.commonService.generatedSlug(`${this.decimalPipe.transform(item.month, '2.0-0')}`)?.includes(searchContent) ||
        this.commonService.generatedSlug(`${item.month}`)?.includes(searchContent) ||
        this.commonService.generatedSlug(`${item.updatedBy}`)?.includes(searchContent) ||
        this.commonService.generatedSlug(`${this.decimalPipe.transform(item.date, '2.0-0')}`)?.includes(searchContent)
    });
  }
}
