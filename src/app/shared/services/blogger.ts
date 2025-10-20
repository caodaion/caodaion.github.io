import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Blogger {

  private readonly http = inject(HttpClient);
  private readonly blogId = environment?.blogger?.blogId;
  private readonly apiKey = environment?.blogger?.apiKey;

  constructor() { }

  fetchHocPosts() {
    const label = 'hoc'; // Replace with your desired label
    const url = `https://www.googleapis.com/blogger/v3/blogs/${this.blogId}/posts?labels=${encodeURIComponent(label)}&key=${this.apiKey}`;
    return this.http.get(url);
  }
}
