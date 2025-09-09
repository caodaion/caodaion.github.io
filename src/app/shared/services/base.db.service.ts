import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';

@Injectable({
  providedIn: 'root'
})
export class BaseDbService extends Dexie {
  lanhActivities!: Table<any>;
  lanhPosts!: Table<any>;
  tuanCuu!: Table<any>;
  vuonLanh!: Table<any>;

  constructor() {
    super('CaoDaiONDB');
    
    // Initial schema (v1)
    this.version(1).stores({
      lanhActivities: 'date, data',
      lanhPosts: 'date, data',
      tuanCuu: 'id, data',
      vuonLanh: 'id, data',
    });
  }
}
