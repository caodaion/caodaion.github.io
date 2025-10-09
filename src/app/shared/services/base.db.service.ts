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
  learnResults!: Table<any>;

  constructor() {
    super('CaoDaiONDB');
    
    // Initial schema (v1)
    this.version(1).stores({
      lanhActivities: 'date, data',
      lanhPosts: 'date, data',
      tuanCuu: 'id, data',
      vuonLanh: 'id, data',
    });

    // Version 2: Add learn results table
    this.version(2).stores({
      lanhActivities: 'date, data',
      lanhPosts: 'date, data',
      tuanCuu: 'id, data',
      vuonLanh: 'id, data',
      learnResults: '++id, lessonSlug, completedAt, percentage',
    });
  }
}
