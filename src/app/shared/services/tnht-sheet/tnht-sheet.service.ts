import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SheetService } from '../sheet/sheet.service';

type Mutable<T> = { -readonly [P in keyof T]: T[P] };
@Injectable({
  providedIn: 'root',
})
export class TnhtSheetService {
  eventList: any[] = [];
  readonly sheetId = `2PACX-1vRxqUXHaKmgYI3E334eCT0vrQBmyB906FCiiSYW9zr_S-9bodW8OFKOdO3tdQ17iYqik73B_0XQ8Bvk`;
  readonly tnhtSheet = `tnhtDelta`;
  readonly tnhtWorkbook: any;
  readonly tnhtList: any;
  isActiveTnhtList: boolean = false;

  constructor(private sheetService: SheetService) {}

  fetchTnht(): Observable<any> {
    const ref: Mutable<this> = this;
    return new Observable((observable) => {
      const returnData = () => {
        let response = <any>{};
        response.setting = {
          googleFormsId: '1FAIpQLScmPKPaMbO_4mhS4armrtyushZCSfL999QVIEgOkiyzqV_ELQ',
          key: 'entry.1660620644',
          delta: 'entry.1566415383',
          title: 'entry.1365831130',
        }
        this.sheetService
          .decodeRawSheetData(ref.tnhtWorkbook.Sheets[this.tnhtSheet])
          .subscribe((res: any) => {
            const registeredData = res;
            response.data = registeredData;
            response.status = 200;
            observable.next(response);
            observable.complete();
          });
      };
      if (!ref.tnhtWorkbook) {
        try {
          this.sheetService.fetchSheet(this.sheetId).subscribe((res: any) => {
            if (res.status == 200) {
              if (res?.workbook) {                
                ref.tnhtWorkbook = res?.workbook;
                returnData();
              }
            }
          });
        } catch (e) {
          console.error(e);
        }
      } else {
        returnData();
      }
    });
  }
}

