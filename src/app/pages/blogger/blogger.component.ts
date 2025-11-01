import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Blogger } from '../../shared/services/blogger';
import { SeoService } from 'src/app/shared/services/seo.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IconComponent } from '../../components/icon/icon.component';
import { ChildHeaderComponent } from '../../components/child-header/child-header.component';

interface BloggerPost {
  id: string;
  title: string;
  content: string;
  published: string;
  updated: string;
  url: string;
  labels?: string[];
  author?: {
    displayName: string;
    url: string;
  };
}

@Component({
  selector: 'app-blogger',
  standalone: true,
  imports: [CommonModule, IconComponent, ChildHeaderComponent],
  templateUrl: './blogger.component.html',
  styleUrl: './blogger.component.scss'
})
export class BloggerComponent implements OnInit {
  bloggerService = inject(Blogger);
  seoService = inject(SeoService);
  sanitizer = inject(DomSanitizer);

  posts: BloggerPost[] = [];
  loading: boolean = true;
  loadingMore: boolean = false;
  error: string | null = null;
  selectedLabel: string = 'all';
  availableLabels: string[] = ['all'];
  nextPageToken: string | null = null;
  initialLoadCount: number = 10;

  ngOnInit(): void {
    this.setSeoMetadata();
    this.fetchAllPosts();
  }

  private setSeoMetadata(): void {
    this.seoService.updateMetadata({
      title: 'Blog Cao Đài',
      description: 'Đọc các bài viết về đạo Cao Đài từ blog',
      url: 'blogger',
      keywords: 'blog, Cao Đài, đạo Cao Đài, bài viết, tín đồ Cao Đài, tôn giáo, tâm linh, CaoDaiON',
    });
  }

  fetchAllPosts(reset: boolean = true): void {
    if (reset) {
      this.loading = true;
      this.posts = [];
      this.nextPageToken = null;
      this.selectedLabel = 'all';
    } else {
      this.loadingMore = true;
    }
    this.error = null;
    
    this.bloggerService.fetchAllPosts(this.initialLoadCount, this.nextPageToken || undefined).subscribe({
      next: (response: any) => {
        if (reset) {
          this.posts = response?.items || [];
        } else {
          this.posts = [...this.posts, ...(response?.items || [])];
        }
        this.nextPageToken = response?.nextPageToken || null;
        this.extractLabels();
        this.loading = false;
        this.loadingMore = false;
      },
      error: (err) => {
        this.error = 'Không thể tải bài viết. Vui lòng thử lại sau.';
        this.loading = false;
        this.loadingMore = false;
        console.error('Error fetching posts:', err);
      }
    });
  }

  loadMorePosts(): void {
    if (this.nextPageToken && !this.loadingMore) {
      if (this.selectedLabel === 'all') {
        this.fetchAllPosts(false);
      } else {
        this.fetchPostsByLabel(this.selectedLabel, false);
      }
    }
  }

  fetchPostsByLabel(label: string, reset: boolean = true): void {
    if (label === 'all') {
      this.fetchAllPosts(reset);
      return;
    }

    if (reset) {
      this.loading = true;
      this.posts = [];
      this.nextPageToken = null;
      this.selectedLabel = label;
    } else {
      this.loadingMore = true;
    }
    this.error = null;
    
    this.bloggerService.fetchPostsByLabel(label, this.initialLoadCount, this.nextPageToken || undefined).subscribe({
      next: (response: any) => {
        if (reset) {
          this.posts = response?.items || [];
        } else {
          this.posts = [...this.posts, ...(response?.items || [])];
        }
        this.nextPageToken = response?.nextPageToken || null;
        this.loading = false;
        this.loadingMore = false;
      },
      error: (err) => {
        this.error = 'Không thể tải bài viết. Vui lòng thử lại sau.';
        this.loading = false;
        this.loadingMore = false;
        console.error('Error fetching posts:', err);
      }
    });
  }

  onLabelChange(label: string): void {
    if (label === 'all') {
      this.fetchAllPosts(true);
    } else {
      this.fetchPostsByLabel(label, true);
    }
  }

  private extractLabels(): void {
    const labelSet = new Set<string>();
    this.posts.forEach(post => {
      if (post.labels) {
        post.labels.forEach(label => labelSet.add(label));
      }
    });
    this.availableLabels = ['all', ...Array.from(labelSet).sort()];
  }

  getSanitizedContent(content: string): SafeHtml {
    // Strip HTML tags for preview and truncate
    const textContent = content.replace(/<[^>]*>/g, '').trim();
    const truncated = textContent.substring(0, 200) + (textContent.length > 200 ? '...' : '');
    // Since we've already stripped HTML, we can safely trust the text
    return this.sanitizer.bypassSecurityTrustHtml(truncated);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  openPost(post: BloggerPost): void {
    window.open(post.url, '_blank');
  }
}

