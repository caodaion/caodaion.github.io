import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API_PATH } from '../../constants/api.constant';
@Injectable({
  providedIn: 'root',
})
export class CauSieuVoViService {
  constructor(private http: HttpClient) { }

  getCauSieuVoViList(): Observable<any> {
    const url = `${API_PATH.cauSieuVoVi.root}`;
    const list = new Observable((observer) => {
      observer.next(JSON.parse(localStorage.getItem('csvv') || `{data: []}`))
    })
    return list
  }
  getCauSieuVoViById(_id: any) {
    const url = `${API_PATH.cauSieuVoVi.root}/${_id}`;
    JSON.parse(localStorage.getItem('csvv') || `{data: []}`)
    const item = new Observable((observer) => {
      observer.next({data: JSON.parse(localStorage.getItem('csvv') || `{data: []}`)?.data.find((doc: any) => doc.key === _id)})
    })
    return item
  }
  addCauSieuVoVi(req: any, id: any) {
    const url = `${API_PATH.cauSieuVoVi.root}`;
    localStorage.setItem('csvv', JSON.stringify(req))
    const item = new Observable((observer) => {
      observer.next({data: JSON.parse(localStorage.getItem('csvv') || `{data: []}`)?.data.find((doc: any) => doc.key === id)})
    })
    return item
  }
  updateCauSieuVoVi(req: any, id: any) {
    const url = `${API_PATH.cauSieuVoVi.root}`;
    localStorage.setItem('csvv', JSON.stringify(req))
    const item = new Observable((observer) => {
      observer.next({data: JSON.parse(localStorage.getItem('csvv') || `{data: []}`)?.data.find((doc: any) => doc.key === id)})
    })
    return item
  }
}
