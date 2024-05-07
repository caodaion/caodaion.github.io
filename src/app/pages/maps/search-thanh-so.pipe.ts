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
      return value;
    }
    if (option?.selected) {
      console.log(option?.selected);

      return value?.filter((ch: any) => {
        if (option?.selected?.latLng) {
          return ch?.latLng[0] !== option?.selected?.latLng[0] && ch?.latLng[1] !== option?.selected?.latLng[1] && ((this.commonService.generatedSlug(`${option?.searchText}`)?.split('-')
            .every((x) => {
              return this.commonService.generatedSlug(`${ch.name}`)?.includes(x) ||
                this.commonService.generatedSlug(`${ch.address}`)?.includes(x)
            })) || (`${option?.searchText}`?.split(' ').every((x) => {
              return ch.name?.toLowerCase()?.includes(x) || ch.address?.toLowerCase()?.includes(x)
            })))
        }
        return ((this.commonService.generatedSlug(`${option?.searchText}`)?.split('-')
          .every((x) => {
            return this.commonService.generatedSlug(`${ch.name}`)?.includes(x) ||
              this.commonService.generatedSlug(`${ch.address}`)?.includes(x)
          })) || (`${option?.searchText}`?.split(' ').every((x) => {
            return ch.name?.toLowerCase()?.includes(x) || ch.address?.toLowerCase()?.includes(x)
          })))
      })
    }
    return value?.filter((ch: any) => {
      return ((this.commonService.generatedSlug(`${option?.searchText}`)?.split('-')
        .every((x) => {
          return this.commonService.generatedSlug(`${ch.name}`)?.includes(x) ||
            this.commonService.generatedSlug(`${ch.address}`)?.includes(x)
        })) || (`${option?.searchText}`?.split(' ').every((x) => {
          return ch.name?.toLowerCase()?.includes(x) || ch.address?.toLowerCase()?.includes(x)
        })))
    })
  }

}
