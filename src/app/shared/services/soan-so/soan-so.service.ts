import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SoanSoService {

  longSoData = <any>{
    'tam-giao': {
      'so-nguon-dan-thoi-ty': {
        name: 'Ngươn Đán (Thời Tý)',
        eventLunar: {
          lunarDay: 1,
          lunarMonth: 1,
          lunarTime: 'TÝ',
        }
      },
      'so-le-via-duc-dieu-tri-kim-mau-thoi-ty': {
        name: 'Lễ Vía Đức Diêu Trì Kim Mẫu (Thời Tý)',
        eventLunar: {
          lunarDay: 15,
          lunarMonth: 8,
          lunarTime: 'TÝ',
        }
      },
      'so-le-via-duc-dieu-tri-kim-mau-thoi-ngo-cung-cac-thanh-that': {
        name: 'Lễ Vía Đức Diêu Trì Kim Mẫu (Thời Ngọ) (Cúng các Thánh Thất)',
        eventLunar: {
          lunarDay: 15,
          lunarMonth: 8,
          lunarTime: 'NGỌ',
        }
      },
      'so-le-via-duc-dieu-tri-kim-mau-thoi-ngo': {
        name: 'Lễ Vía Đức Diêu Trì Kim Mẫu (Thời Ngọ)',
        eventLunar: {
          lunarDay: 15,
          lunarMonth: 8,
          lunarTime: 'NGỌ',
        }
      },
    },
    'tam-tran': {
      'so-cau-sieu': {
        name: 'Cầu Siêu',
        chi: 'nhựt'
      }
    }
  }

  constructor(private http: HttpClient) { }

  getSoTemplate(key: any): Observable<any> {
    return this.http.get(`assets/documents/tap-so-van/${key}.json`);
  }

  getLongSoList(key: any): Observable<any> {
    return new Observable((observable: any) => {
      observable.next(this.longSoData[key])
    })
  }
}
