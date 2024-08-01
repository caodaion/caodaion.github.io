import { Pipe, PipeTransform } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common/common.service';

@Pipe({
  name: 'filterVocabulary'
})
export class FilterVocabularyPipe implements PipeTransform {

  constructor(private commonService: CommonService) {

  }

  transform(value: any, searchText: any): any {
    if (!searchText) {
      return value;
    }
    const searchContent = this.commonService.generatedSlug(`${searchText}`)
    return value?.filter((ch: any) => {
      return this.commonService.generatedSlug(`${ch?.data?.text}`)?.includes(searchContent) ||
        this.commonService.generatedSlug(`${ch?.data?.mean}`)?.includes(searchContent)
    })?.sort((a: any, b: any) => a?.data?.text < b?.data?.text ? -1 : 1)
  }

}
