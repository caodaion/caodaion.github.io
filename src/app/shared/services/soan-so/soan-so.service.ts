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
      'so-le-via-duc-ngoc-hoang-thuong-de-thoi-ty': {
        name: 'Sớ Lễ Vía Đức Ngọc-Hoàng Thượng Đế (Thời Tý)',
        eventLunar: {
          lunarDay: 9,
          lunarMonth: 1,
          lunarTime: 'TÝ',
        }
      },
      'so-le-via-duc-ngoc-hoang-thuong-de-thoi-ngo': {
        name: 'Sớ Lễ Vía Đức Ngọc-Hoàng Thượng Đế (Thời Ngọ)',
        eventLunar: {
          lunarDay: 9,
          lunarMonth: 1,
          lunarTime: 'NGỌ',
        }
      },
      'so-le-thuong-nguon-thoi-ty': {
        name: 'Sớ Lễ Thượng Ngươn (Thời Tý)',
        eventLunar: {
          lunarDay: 15,
          lunarMonth: 1,
          lunarTime: 'TÝ',
        }
      },
      'so-le-thuong-nguon-thoi-ngo': {
        name: 'Sớ Lễ Thượng Ngươn (Thời Ngọ)',
        eventLunar: {
          lunarDay: 15,
          lunarMonth: 1,
          lunarTime: 'NGỌ',
        }
      },
      'so-le-via-duc-thai-thuong-lao-quan-thoi-ty': {
        name: 'Sớ Lễ Vía Đức Thái Thượng Lão Quân (Thời Tý)',
        eventLunar: {
          lunarDay: 15,
          lunarMonth: 2,
          lunarTime: 'TÝ',
        }
      },
      'so-le-via-duc-thai-thuong-lao-quan-thoi-ngo': {
        name: 'Sớ Lễ Vía Đức Thái Thượng Lão Quân (Thời NGỌ)',
        eventLunar: {
          lunarDay: 15,
          lunarMonth: 2,
          lunarTime: 'NGỌ',
        }
      },
      'so-le-ky-niem-duc-giao-tong-dac-dao-thoi-ty': {
        name: 'Sớ Lễ Kỷ Niệm Đức Giáo Tông Đắc Đạo (Thời Tý)',
        eventLunar: {
          lunarDay: 25,
          lunarMonth: 2,
          lunarTime: 'TÝ',
        }
      },
      'so-le-ky-niem-duc-giao-tong-dac-dao-thoi-ngo': {
        name: 'Sớ Lễ Kỷ Niệm Đức Giáo Tông Đắc Đạo (Thời NGỌ)',
        eventLunar: {
          lunarDay: 15,
          lunarMonth: 2,
          lunarTime: 'NGỌ',
        }
      },
      'so-le-ky-niem-duc-giao-tong-tho-phong-thoi-ty': {
        name: 'Sớ Lễ Kỷ Niệm Đức Giáo Tông Thọ Phong (Thời Tý)',
        eventLunar: {
          lunarDay: 13,
          lunarMonth: 3,
          lunarTime: 'TÝ',
        }
      },
      'so-le-ky-niem-duc-giao-tong-tho-phong-thoi-ngo': {
        name: 'Sớ Lễ Kỷ Niệm Đức Giáo Tông Thọ Phong (Thời NGỌ)',
        eventLunar: {
          lunarDay: 13,
          lunarMonth: 3,
          lunarTime: 'NGỌ',
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
      },
      'so-cao-hoang-thien-hau-tho': {
        name: 'Cáo Hoàng Thiên Hậu Thổ'
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
