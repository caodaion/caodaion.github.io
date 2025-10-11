import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LearnDataService {
  private hocPostsSubject = new BehaviorSubject<any[]>([]);
  public hocPosts$ = this.hocPostsSubject.asObservable();

  setHocPosts(posts: any[]): void {
    this.hocPostsSubject.next(posts);
  }

  getHocPosts(): any[] {
    return this.hocPostsSubject.value;
  }

  findLessonBySlug(slug: string): any | null {
    const posts = this.getHocPosts();
    return posts.find(post => {
      const urlMatch = post.url?.match(/\/(\d{4})\/(\d{2})\/([^/]+)\.html$/);
      return urlMatch && urlMatch[3] === slug;
    }) || null;
  }

  private extractSlugFromUrl(url: string): string | null {
    if (!url) return null;
    const urlMatch = url.match(/\/(\d{4})\/(\d{2})\/([^/]+)\.html$/);
    return urlMatch ? urlMatch[3] : null;
  }
}