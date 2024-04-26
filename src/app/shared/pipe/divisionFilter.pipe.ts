import { Pipe, PipeTransform } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common/common.service';

/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
*/
@Pipe({
    standalone: true,
    name: 'divisionFilter'
})
export class DivisionFilterPipe implements PipeTransform {

    constructor(private commonService: CommonService) {

    }
    transform(value: any, option: any): any {
        if (!option?.searchText && !option?.level) {
            return value;
        }
        return value?.filter((ch: any) => {
            if (option?.level == 'province') {
                return (((this.commonService.generatedSlug(`${option?.searchText}`)?.split('-')
                    .every((x) => {
                        return this.commonService.generatedSlug(`${ch.name}`)?.includes(x)
                    })) || (`${option?.searchText}`?.split(' ').every((x) => {
                        return ch.name?.includes(x)
                    }))))
            }
            if (option?.level == 'district') {
                return ch.provinceId == option?.parent &&
                    (((this.commonService.generatedSlug(`${option?.searchText}`)?.split('-')
                        .every((x) => {
                            return this.commonService.generatedSlug(`${ch.name}`)?.includes(x)
                        })) || (`${option?.searchText}`?.split(' ').every((x) => {
                            return ch.name?.includes(x)
                        }))))
            }
            if (option?.level == 'ward') {
                return ch.districtId == option?.parent &&
                    (((this.commonService.generatedSlug(`${option?.searchText}`)?.split('-')
                        .every((x) => {
                            return this.commonService.generatedSlug(`${ch.name}`)?.includes(x)
                        })) || (`${option?.searchText}`?.split(' ').every((x) => {
                            return ch.name?.includes(x)
                        }))))
            }
            return value;
        })
    }
}