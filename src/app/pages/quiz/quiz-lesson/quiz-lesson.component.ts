import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { QuizService } from 'src/app/shared/services/quiz/quiz.service';

@Component({
  selector: 'app-quiz-lesson',
  templateUrl: './quiz-lesson.component.html',
  styleUrls: ['./quiz-lesson.component.scss']
})
export class QuizLessonComponent implements OnInit {

  quiz = <any>[];
  sectionKey: any;
  gateKey: any;
  lessonKey: any;
  section = <any>{};
  gate = <any>{};
  lesson = <any>{};

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService,
    private commonService: CommonService,
    private matDialog: MatDialog,
    private breakpointObserver: BreakpointObserver
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((query: any) => {
      this.sectionKey = query['sectionKey']
      this.gateKey = query['gateKey']
      this.lessonKey = query['lessonKey']
      setTimeout(() => {
        this.breakpointObserver
          .observe(['(max-width: 600px)'])
          .subscribe((state: BreakpointState) => {
            if (state.matches) {
              localStorage.setItem(
                'currentLayout',
                JSON.stringify({
                  isHideToolbar: true,
                  isHideBottomNavBar: true,
                })
              );
            } else {
              localStorage.setItem(
                'currentLayout',
                JSON.stringify({
                  isHideToolbar: false,
                  isHideBottomNavBar: false,
                })
              );
            }
          });
      }, 0)
      this.fetchQuiz()
    })
  }

  fetchQuiz() {
    if (this.quizService?.quiz?.length > 0) {
      this.quiz = this.quizService?.quiz
      this.getLesson()
    } else {
      try {
        this.quizService.fetchQuiz()
          .subscribe((res: any) => {
            if (res.status == 200) {
              this.quiz = res.data
              this.getLesson()
            }
          })
      } catch (e) {
        console.error(e);
      }
    }
  }

  getLesson() {
    this.section = this.quiz?.find((item: any) => item?.key === this.sectionKey)
    console.log(this.section);
    this.gate = this.section?.gates?.find((item: any) => item?.key === this.gateKey)
    this.lesson = this.gate?.lesson?.find((item: any) => item?.key === this.lessonKey)
    console.log(this.lesson);
  }
}
