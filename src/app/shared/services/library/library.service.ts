import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_PARAMS } from '../../constants/api.constant';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {

  constructor(private http: HttpClient) { }

  getStaticBooks(): Observable<any> {
    return this.http.get(`assets/documents/library/static-library.json`);
  }

  getBookFromLibrary(): Observable<any> {
    return new Observable((observable) => {
      this.http.get(`https://api.github.com/repos/${API_PARAMS.caodaionLibrady.user}/${API_PARAMS.caodaionLibrady.repo}/contents/${'library'}.json${!environment.production ? '?ref=dev' : ''}`)
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
    return new Observable((observable) => {
      this.http.get(`https://api.github.com/repos/${API_PARAMS.caodaionLibrady.user}/${API_PARAMS.caodaionLibrady.repo}/contents/${key}/${'table-content'}.json${!environment.production ? '?ref=dev' : ''}`)
        .subscribe((res: any) => {
          observable.next(JSON.parse(decodeURIComponent(escape(atob(res.content)))))
          observable.complete()
        });
    })
  }

  getBookByKey(key: any, isStatic: boolean = false, fetchOrigin: boolean = false): Observable<any> {
    if (isStatic) {
      return this.http.get(`assets/documents/library/${key}/${key}.txt`, { responseType: 'text' })
    }
    return new Observable((observable) => {
      this.http.get(`https://api.github.com/repos/${API_PARAMS.caodaionLibrady.user}/${API_PARAMS.caodaionLibrady.repo}/contents/${key}/${key}.md${!environment.production ? '?ref=dev' : ''}`)
        .subscribe((res: any) => {
          const resposne = <any>{}
          resposne.data = decodeURIComponent(escape(atob(res.content)))
          resposne.origin = res.download_url?.replace(`${key}.md`, 'origin.pdf')
          observable.next(resposne)
          observable.complete()
        });
    })
  }

  getDataOfTableContent(path: any, isStatic: boolean = false): Observable<any> {
    if (isStatic) {
      return this.http.get(`assets/documents/library/${path}.txt`, { responseType: 'text' })
    }
    return new Observable((observable) => {
      this.http.get(`https://api.github.com/repos/${API_PARAMS.caodaionLibrady.user}/${API_PARAMS.caodaionLibrady.repo}/contents/${path}.md${!environment.production ? '?ref=dev' : ''}`)
        .subscribe((res: any) => {
          observable.next(decodeURIComponent(escape(atob(res.content))))
          observable.complete()
        });
    })
  }
}
