import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  provinces = <any>[]
  districts = <any>[]
  wards = <any>[]

  constructor(private http: HttpClient) { }

  getAllDivisions() {
    const url = 'https://provinces.open-api.vn/api/p/'
    return this.http.get(url)
  }

  getDistricts() {
    const url = `https://provinces.open-api.vn/api/d/`
    return this.http.get(url)
  }

  getWards() {
    const url = `https://provinces.open-api.vn/api/w/`
    return this.http.get(url)
  }
}
