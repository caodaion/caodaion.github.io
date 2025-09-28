import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Blogger {

  private readonly http = inject(HttpClient);
  private readonly blogId = '4095902482828699776';
  private readonly apiKey = 'AIzaSyDMjZ7ej2nGwPe5qikDX7BYbtBuslresTA';

  constructor() { }

  fetchHocPosts() {
    const label = 'hoc'; // Replace with your desired label
    const url = `https://www.googleapis.com/blogger/v3/blogs/${this.blogId}/posts?labels=${encodeURIComponent(label)}&key=${this.apiKey}`;
    return this.http.get(url);
  }
}
