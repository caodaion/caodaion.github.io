import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';

export interface Kinh {
  key: string;
  name: string;
  group: string;
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
          if (!groups[kinh.group]) {
            groups[kinh.group] = [];
          }
          groups[kinh.group].push(kinh);
        });
        return groups;
      })
    );
  }

  getGroupName(key: string): string {
    const groupNames: {[key: string]: string} = {
      'cung_tu_thoi': 'Kinh Cúng Tứ Thời',
      'quan_hon_tang_te': 'Kinh Quan Hôn Tang Tế',
      'thuat_nguyen': 'Kinh Thuật Nguyện',
      'di_lac': 'Kinh Đức Di Lạc'
    };
    return groupNames[key] || key;
  }
}