import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule, NavigationEnd } from '@angular/router';
import { Blogger } from 'src/app/shared/services/blogger';
import { LearnDataService } from '../../services/learn-data.service';
import { LearnResultsService } from '../../services/learn-results.service';
import { IconComponent } from 'src/app/components/icon/icon.component';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-lessons',
  imports: [
    RouterModule,
    CommonModule,
    IconComponent
  ],
  templateUrl: './lessons.html',
  styleUrl: './lessons.scss'
})
export class Lessons implements OnInit, OnDestroy {

  allSessionGroups: any[] = [];
  hocPosts: any[] = [];
  completedLessons: Set<string> = new Set();
  private routerSubscription: Subscription | null = null;
  
  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private learnDataService: LearnDataService,
    private learnResultsService: LearnResultsService
  ) {}

  ngOnInit(): void {
    // Get data from service
    this.learnDataService.hocPosts$.subscribe(posts => {
      this.hocPosts = posts;
      this.fetchHocLessonGroups();
    });
    
    // Load completed lessons
    this.loadCompletedLessons();

    // Listen for navigation events to refresh completion status
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        // Refresh completion status when returning to lessons
        this.loadCompletedLessons();
      });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  async loadCompletedLessons(): Promise<void> {
    try {
      const results = await this.learnResultsService.getAllResults();
      this.completedLessons = new Set(results.map(result => result.lessonSlug));
    } catch (error) {
      console.error('Error loading completed lessons:', error);
    }
  }

  fetchHocLessonGroups() {
    this.allSessionGroups = this.hocPosts
      ?.map((post: any) => {
        const hocLabel = post?.labels?.find((label: string) => /^hoc-\d+-/.test(label));
        const titleMatch = hocLabel?.match(/^hoc-\d+-(.+)$/);
        return hocLabel
          ? {
            title: titleMatch ? titleMatch[1].trim() : 'Uncategorized',
            order: hocLabel ? parseInt(hocLabel.match(/^hoc-(\d+)-/)?.[1] ?? '999', 10) : 999,
            key: titleMatch[0],
            posts: this.hocPosts
              .filter((p: any) =>
                p.labels?.some((label: string) => label === titleMatch[0])
              )
              .sort((a: any, b: any) => new Date(a.published).getTime() - new Date(b.published).getTime())
          }
          : null;
      })
      .filter((group: any, idx: number, arr: any[]) =>
        group &&
        arr.findIndex(
          (g) => g && g.title === group.title && g.order === group.order
        ) === idx
      )
      .sort((a: any, b: any) => a.order - b.order);
    console.log(this.allSessionGroups);
  }

  onClickLesson(lesson: any): void {
    // Extract slug from the lesson URL
    const slug = this.extractSlugFromUrl(lesson.url);
    if (slug) {
      // Navigate to the lesson route with the slug and store lesson data in state
      this.router.navigate(['.', slug], { 
        relativeTo: this.route,
        state: { lessonData: lesson }
      });
    }
  }

  private extractSlugFromUrl(url: string): string | null {
    if (!url) return null;
    
    // Extract slug from Blogger URL pattern: http://cdo-dev.blogspot.com/YYYY/MM/slug.html
    const urlMatch = url.match(/\/(\d{4})\/(\d{2})\/([^/]+)\.html$/);
    if (urlMatch && urlMatch[3]) {
      return urlMatch[3]; // Return the slug part
    }
    
    return null;
  }

  isLessonCompleted(lesson: any): boolean {
    const slug = this.extractSlugFromUrl(lesson.url);
    return slug ? this.completedLessons.has(slug) : false;
  }

  async getBestScore(lesson: any): Promise<number | null> {
    const slug = this.extractSlugFromUrl(lesson.url);
    if (!slug) return null;
    
    try {
      const bestResult = await this.learnResultsService.getBestResult(slug);
      return bestResult ? bestResult.percentage : null;
    } catch (error) {
      console.error('Error getting best score:', error);
      return null;
    }
  }

  getGroupCompletionStats(group: any): { completed: number; total: number; percentage: number } {
    if (!group?.posts) {
      return { completed: 0, total: 0, percentage: 0 };
    }

    const total = group.posts.length;
    const completed = group.posts.filter((post: any) => this.isLessonCompleted(post)).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { completed, total, percentage };
  }
}
