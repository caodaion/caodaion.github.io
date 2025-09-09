import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DocsService {

  constructor(private http: HttpClient) { }

  getDocsContent(path: any) {
    return this.http.get(`${path}`, { responseType: 'json' });
  }

  getStaticLibrary(path: string) {
    return this.http.get(path, { responseType: 'json' });
  }
}
