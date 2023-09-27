import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TinyUrlService {

  constructor(private http: HttpClient) { }

  shortenUrl(url: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer L9617Wffv17qx50IA1wfBbLEvarAyj1IH8QA6ybwVs9fOctXb0D5QXiiiqBi`
    })
    return this.http.post(`https://api.tinyurl.com/create`, {
      "url": url,
    }, { headers: headers })
  }
}
