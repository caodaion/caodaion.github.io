import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {

  constructor(private http: HttpClient) { }

  getStaticBooks(): Observable<any> {
    return this.http.get(`assets/documents/library/static-library.json`);
  }

  getBookByKey(key: any) {
    return this.http.get(`assets/documents/library/${key}.json`);
  }
}
