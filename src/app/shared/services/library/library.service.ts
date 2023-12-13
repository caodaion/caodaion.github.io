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

  getBookFromLibrary(): Observable<any> {
    const user = 'caodaion-library'
    const repo = 'caodaion-library.github.io'
    return new Observable((observable) => {
      this.http.get(`https://api.github.com/repos/${user}/${repo}/contents/${'library'}.json`)
        .subscribe((res: any) => {
          observable.next(JSON.parse(decodeURIComponent(escape(atob(res.content)))))
          observable.complete()
        });
    })
  }

  getTableContentByKey(key: any, isStatic: boolean = false): Observable<any> {
    if (isStatic) {
      return this.http.get(`assets/documents/library/${key}/${'table-content'}.json`)
    }
    const user = 'caodaion-library'
    const repo = 'caodaion-library.github.io'
    return new Observable((observable) => {
      this.http.get(`https://api.github.com/repos/${user}/${repo}/contents/${key}/${'table-content'}.json`)
        .subscribe((res: any) => {
          observable.next(JSON.parse(decodeURIComponent(escape(atob(res.content)))))
          observable.complete()
        });
    })
  }

  getBookByKey(key: any, isStatic: boolean = false): Observable<any> {
    if (isStatic) {
      return this.http.get(`assets/documents/library/${key}/${key}.txt`, {responseType: 'text'})
    }
    const user = 'caodaion-library'
    const repo = 'caodaion-library.github.io'
    return new Observable((observable) => {
      this.http.get(`https://api.github.com/repos/${user}/${repo}/contents/${key}/${key}.md`)
        .subscribe((res: any) => {
          observable.next(decodeURIComponent(escape(atob(res.content))))
          observable.complete()
        });
    })
  }

  getDataOfTableContent(path: any, isStatic: boolean = false): Observable<any> {
    if (isStatic) {
      return this.http.get(`assets/documents/library/${path}.txt`, {responseType: 'text'})
    }
    const user = 'caodaion-library'
    const repo = 'caodaion-library.github.io'
    return new Observable((observable) => {
      this.http.get(`https://api.github.com/repos/${user}/${repo}/contents/${path}.md`)
        .subscribe((res: any) => {
          observable.next(decodeURIComponent(escape(atob(res.content))))
          observable.complete()
        });
    })
  }
}
