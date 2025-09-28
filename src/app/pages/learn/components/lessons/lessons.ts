import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Blogger } from 'src/app/shared/services/blogger';

@Component({
  selector: 'app-lessons',
  imports: [
    RouterModule,
    CommonModule
  ],
  templateUrl: './lessons.html',
  styleUrl: './lessons.scss'
})
export class Lessons implements OnInit {

  allSessionGroups: any[] = [];
  @Input() hocPosts: any[] = [];
  @Output() openLesson = new EventEmitter<any>();
  ngOnInit(): void {
    this.fetchHocLessonGroups();
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
    this.openLesson.emit(lesson);
  }
}
