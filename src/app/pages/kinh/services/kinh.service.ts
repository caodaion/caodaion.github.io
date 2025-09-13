import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';

export interface Kinh {
  key: string;
  name: string;
  group: string;
  sub_group: string;
}

@Injectable({
  providedIn: 'root'
})
export class KinhService {
  private kinhListUrl = 'assets/documents/kinh/kinh_list.json';
  private kinhBasePath = 'assets/documents/kinh/';

  constructor(private http: HttpClient) { }

  getKinhList(): Observable<Kinh[]> {
    return this.http.get<Kinh[]>(this.kinhListUrl);
  }

  getKinhByKey(key: string): Observable<string> {
    return this.http.get(`${this.kinhBasePath}${key}.txt`, { responseType: 'text' });
  }

  getKinhGroups(): Observable<{[key: string]: Kinh[]}> {
    return this.getKinhList().pipe(
      map(kinhList => {
        const groups: {[key: string]: Kinh[]} = {};
        kinhList.forEach(kinh => {
          const kinhGroup = kinh.sub_group || kinh.group;
          if (!groups[kinhGroup]) {
            groups[kinhGroup] = [];
          }
          groups[kinhGroup].push(kinh);
        });
        
        // Sort groups according to the order defined in getGroupName
        const groupOrder = [
          'cung_tu_thoi',
          'quan_hon_tang_te',
          'kinh_sanh',
          'hon_nhon',
          'kinh_lao',
          'kinh_benh',
          'kinh_tu',
          'kinh_dieu',
          'kinh_tong_chung',
          'kinh_lam_tuan',
          'kinh_ky_lap',
          'kinh_cung_co_hon',
          'kinh_cung_chien_si',
          'kinh_khac'
        ];
        
        const sortedGroups: {[key: string]: Kinh[]} = {};
        
        // Add groups in the specified order
        groupOrder.forEach(groupKey => {
          if (groups[groupKey]) {
            sortedGroups[groupKey] = groups[groupKey];
          }
        });
        
        // Add any remaining groups that weren't in the predefined order
        Object.keys(groups).forEach(groupKey => {
          if (!groupOrder.includes(groupKey)) {
            sortedGroups[groupKey] = groups[groupKey];
          }
        });
        
        return sortedGroups;
      })
    );
  }

  getGroupName(key: string): string {
    const groupNames: {[key: string]: string} = {
      'cung_tu_thoi': 'Kinh Cúng Tứ Thời',
      'quan_hon_tang_te': 'Kinh Quan Hôn Tang Tế',
      'kinh_sanh': 'Kinh Sanh',
      'hon_nhon': 'Hôn Nhơn',
      'kinh_lao': 'Kinh Lão',
      'kinh_benh': 'Kinh Bệnh',
      'kinh_tu': 'Kinh Tử',
      'kinh_dieu': 'Kinh Điếu',
      'kinh_tong_chung': 'Kinh Tống Chung',
      'kinh_lam_tuan': 'Kinh Làm Tuần',
      'kinh_ky_lap': 'Kinh Kỵ Lạp',
      'kinh_cung_co_hon': 'Kinh Cúng Cô Hồn',
      'kinh_cung_chien_si': 'Kinh Cúng Chiến Sĩ',
      'kinh_khac': 'Kinh Khác'
    };
    return groupNames[key] || key;
  }
}