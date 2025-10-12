import { Injectable } from '@angular/core';

export interface CalendarEventData {
  id?: number;
  title: string;
  description: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private dbName = 'CaoDaiONDB';
  private dbVersion = 1;
  private storeName = 'events';
  private db: IDBDatabase | null = null;

  constructor() {
    this.initDB();
  }

  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Thử mở database mà không chỉ định version để lấy version hiện tại
      const checkRequest = indexedDB.open(this.dbName);

      checkRequest.onsuccess = () => {
        const existingDb = checkRequest.result;
        const currentVersion = existingDb.version;
        existingDb.close();

        // Mở database với version hiện tại
        const request = indexedDB.open(this.dbName, currentVersion);

        request.onerror = () => {
          console.error('Lỗi khi mở IndexedDB:', request.error);
          reject(request.error);
        };

        request.onsuccess = () => {
          this.db = request.result;
          resolve();
        };

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          
          // Tạo object store nếu chưa tồn tại
          if (!db.objectStoreNames.contains(this.storeName)) {
            const store = db.createObjectStore(this.storeName, { 
              keyPath: 'id', 
              autoIncrement: true 
            });
            
            // Tạo index cho date để tìm kiếm theo ngày
            store.createIndex('date', 'date', { unique: false });
            store.createIndex('title', 'title', { unique: false });
          }
        };
      };

      checkRequest.onerror = () => {
        // Nếu database chưa tồn tại, tạo mới với version 1
        const request = indexedDB.open(this.dbName, this.dbVersion);

        request.onerror = () => {
          console.error('Lỗi khi tạo IndexedDB mới:', request.error);
          reject(request.error);
        };

        request.onsuccess = () => {
          this.db = request.result;
          resolve();
        };

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          
          // Tạo object store
          const store = db.createObjectStore(this.storeName, { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          
          // Tạo index cho date để tìm kiếm theo ngày
          store.createIndex('date', 'date', { unique: false });
          store.createIndex('title', 'title', { unique: false });
        };
      };
    });
  }

  private async ensureDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.initDB();
    }
    if (!this.db) {
      throw new Error('Không thể khởi tạo IndexedDB');
    }
    
    // Kiểm tra xem object store có tồn tại không
    if (!this.db.objectStoreNames.contains(this.storeName)) {
      console.log('Object store "events" chưa tồn tại, đang tạo mới...');
      await this.createObjectStore();
    }
    
    return this.db;
  }

  private async createObjectStore(): Promise<void> {
    return new Promise((resolve, reject) => {
      const currentVersion = this.db!.version;
      const newVersion = currentVersion + 1;
      
      // Đóng database hiện tại
      this.db!.close();
      
      // Mở với version mới để tạo object store
      const request = indexedDB.open(this.dbName, newVersion);
      
      request.onerror = () => {
        console.error('Lỗi khi tạo object store:', request.error);
        reject(request.error);
      };
      
      request.onsuccess = () => {
        this.db = request.result;
        console.log('Object store "events" đã được tạo thành công');
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Tạo object store
        const store = db.createObjectStore(this.storeName, { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        
        // Tạo index cho date để tìm kiếm theo ngày
        store.createIndex('date', 'date', { unique: false });
        store.createIndex('title', 'title', { unique: false });
        
        console.log('Object store "events" và các index đã được tạo');
      };
    });
  }

  async addEvent(eventData: Omit<CalendarEventData, 'id'>): Promise<number> {
    const db = await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      const request = store.add(eventData);
      
      request.onsuccess = () => {
        console.log('Sự kiện đã được thêm với ID:', request.result);
        resolve(request.result as number);
      };
      
      request.onerror = () => {
        console.error('Lỗi khi thêm sự kiện:', request.error);
        reject(request.error);
      };
    });
  }

  async getEventsByDate(date: Date): Promise<CalendarEventData[]> {
    const db = await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const index = store.index('date');
      
      // Tạo range để tìm tất cả events trong ngày
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      const range = IDBKeyRange.bound(startOfDay, endOfDay);
      const request = index.getAll(range);
      
      request.onsuccess = () => {
        resolve(request.result);
      };
      
      request.onerror = () => {
        console.error('Lỗi khi lấy sự kiện theo ngày:', request.error);
        reject(request.error);
      };
    });
  }

  async getAllEvents(): Promise<CalendarEventData[]> {
    const db = await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();
      
      request.onsuccess = () => {
        resolve(request.result);
      };
      
      request.onerror = () => {
        console.error('Lỗi khi lấy tất cả sự kiện:', request.error);
        reject(request.error);
      };
    });
  }

  async updateEvent(id: number, eventData: Partial<CalendarEventData>): Promise<void> {
    const db = await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      // Lấy event hiện tại trước
      const getRequest = store.get(id);
      
      getRequest.onsuccess = () => {
        const existingEvent = getRequest.result;
        if (!existingEvent) {
          reject(new Error('Không tìm thấy sự kiện với ID: ' + id));
          return;
        }
        
        // Cập nhật với dữ liệu mới
        const updatedEvent = {
          ...existingEvent,
          ...eventData,
          updatedAt: new Date()
        };
        
        const updateRequest = store.put(updatedEvent);
        
        updateRequest.onsuccess = () => {
          console.log('Sự kiện đã được cập nhật');
          resolve();
        };
        
        updateRequest.onerror = () => {
          console.error('Lỗi khi cập nhật sự kiện:', updateRequest.error);
          reject(updateRequest.error);
        };
      };
      
      getRequest.onerror = () => {
        console.error('Lỗi khi lấy sự kiện:', getRequest.error);
        reject(getRequest.error);
      };
    });
  }

  async deleteEvent(id: number): Promise<void> {
    const db = await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);
      
      request.onsuccess = () => {
        console.log('Sự kiện đã được xóa');
        resolve();
      };
      
      request.onerror = () => {
        console.error('Lỗi khi xóa sự kiện:', request.error);
        reject(request.error);
      };
    });
  }

  async searchEvents(searchTerm: string): Promise<CalendarEventData[]> {
    const db = await this.ensureDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();
      
      request.onsuccess = () => {
        const allEvents = request.result;
        const filteredEvents = allEvents.filter(event => 
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        resolve(filteredEvents);
      };
      
      request.onerror = () => {
        console.error('Lỗi khi tìm kiếm sự kiện:', request.error);
        reject(request.error);
      };
    });
  }
}
