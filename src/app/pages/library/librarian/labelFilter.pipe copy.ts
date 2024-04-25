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
    name: 'labelFilter'
})
export class LabelFilterPipe implements PipeTransform {

    constructor(private commonService: CommonService) {

    }
    transform(value: any, searchText: any): any {
        if (!searchText) {
            return value;
        }
        return value?.filter((ch: any) => {
            return (this.commonService.generatedSlug(`${searchText}`)?.split('-')
                .every((x) => {
                    return this.commonService.generatedSlug(`${ch}`)?.includes(x)
                }))
        })
    }
}