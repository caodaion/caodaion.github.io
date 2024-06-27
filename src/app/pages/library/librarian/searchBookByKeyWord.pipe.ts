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
    name: 'searchBookByKeyWord'
})
export class SearchBookByKeyWordPipe implements PipeTransform {

    constructor(private commonService: CommonService) {

    }
    transform(value: any, option: any): any {
        if (!option?.searchText && option?.selectedChips?.length == 0) {
            return value;
        }
        const searchContent = this.commonService.generatedSlug(`${option?.searchText}`);
        return value?.filter((ch: any) => {
            return (this.commonService.generatedSlug(`${ch.name}`)?.includes(searchContent) ||
                this.commonService.generatedSlug(`${ch.author}`)?.includes(searchContent) ||
                this.commonService.generatedSlug(`${ch.description}`)?.includes(searchContent))
                && option?.selectedChips?.every((x: any) => {
                    return ch?.labels?.includes(x)
                })
        })
    }
}