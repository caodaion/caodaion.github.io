import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PhoneticService {
  private apiUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

  constructor(private http: HttpClient) {}

  getPhonetic(word: string): Observable<any> {
    const url = `${this.apiUrl}${word}`;
    return this.http.get(url);
  }
}
