import { Injectable } from '@angular/core';
import { CommonService } from '../common/common.service';
import { SheetService } from '../sheet/sheet.service';
import { Observable } from 'rxjs';

type Mutable<T> = { -readonly [P in keyof T]: T[P] }

@Injectable({
  providedIn: 'root'
})
export class MapsService {
  readonly sheetId = `2PACX-1vSt4mbrK2ibNf3z6WBa_zRamMdHh9XlBNDqeO3Lx4aqbaSVyyGBZ3jJ6hi4zZJbrkbHIu-k1JD2_Qmc`
  readonly mapsWorkbook: any;
  readonly maps = <any>{};
  readonly mapsSetting = <any>{};
  readonly thanhSo = <any>[];

  constructor(
    private sheetService: SheetService,
    private commonService: CommonService
  ) { }

  fetchMaps(): Observable<any> {
    const ref: Mutable<this> = this;
    return new Observable((observable) => {
      const returnData = () => {
        const response = <any>{}
        this.sheetService.decodeRawSheetData(ref.mapsWorkbook.Sheets['maps'])
          .subscribe((res: any) => {
            const settings = res?.filter((item: any) => item?.address === 'setting')
            const mapsSetting = <any>{}
            settings.forEach((item: any) => {
              mapsSetting[item?.name] = item?.latLng
            })
            let organizations = <any>[]
            res?.forEach((item: any) => {
              if (item?.address != 'setting' && item?.latLng) {
                const responseItem: any = item
                let editKey = ''
                item.key?.split('-')?.forEach((v: any) => {
                  if (v?.length > 1) {
                    editKey += `${v[0]}${v[v?.length - 1]}`
                  } else {
                    editKey += v
                  }
                  editKey += '-'
                })
                const editToken = res?.find((r: any) => r.key?.match(`${editKey}edit[0-9]`))
                if (editToken?.name) {                  
                  responseItem.editToken = `?${editToken?.key?.match(`edit[0-9]`)[0]}=${editToken?.name}`
                }
                responseItem.latLng = responseItem.latLng?.split(',')?.map((lt: any) => lt?.trim())
                if (!response?.thanhSo) {
                  response.thanhSo = <any>[]
                }
                response.thanhSo.push(responseItem)
                organizations?.push(item?.organization)
                organizations = ([... new Set(organizations)])?.filter((o: any) => o);
                response.organizations = organizations;
              }
            })
            if (settings?.length > 0) {
              response.status = 200;
              response.setting = mapsSetting
            }
          })
        observable.next(response)
        observable.complete()
      }
      if (!ref.mapsWorkbook) {
        try {
          this.sheetService.fetchSheet(this.sheetId)
            .subscribe((res: any) => {
              if (res.status == 200) {
                if (res?.workbook) {
                  ref.mapsWorkbook = res?.workbook
                  returnData()
                }
              }
            })
        } catch (e) {
          console.error(e);
        }
      } else {
        returnData()
      }
    })
  }
}
