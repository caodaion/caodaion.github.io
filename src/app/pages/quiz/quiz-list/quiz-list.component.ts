import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { QuizService } from 'src/app/shared/services/quiz/quiz.service';

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.scss']
})
export class QuizListComponent implements OnInit {

  quizList: any;
  cols = 0

  constructor(private quizService: QuizService,
    private breakpointObserver: BreakpointObserver) {

  }

  ngOnInit(): void {
    this.getQuizList()
    this.breakpointObserver
      .observe(['(max-width: 600px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.cols = 1
        } else {
          this.cols = 4
        }
      });
  }

  getQuizList() {
    try {
      this.quizService.getQuizList()
        .subscribe((res: any) => {
          console.log(res);
          if (res.code === 200) {
            this.quizList = res.data
          }
        })
    } catch (e) {
      console.log(e);
    }
  }
}
