import { Component, OnInit } from '@angular/core';
import { QuizService } from 'src/app/shared/services/quiz/quiz.service';

@Component({
    selector: 'app-quiz-list',
    templateUrl: './quiz-list.component.html',
    styleUrls: ['./quiz-list.component.scss'],
    standalone: false
})
export class QuizListComponent implements OnInit {
  quiz = <any>[]
  constructor(
    private quizService: QuizService
  ) {

  }

  ngOnInit(): void {
    this.fetchQuiz()
  }


  fetchQuiz() {
    if (this.quizService?.quiz?.length > 0) {
      this.quiz = this.quizService?.quiz
      console.log(this.quiz);
    } else {
      try {
        this.quizService.fetchQuiz()
          .subscribe((res: any) => {
            if (res.status == 200) {
              this.quiz = res.data
              console.log(this.quiz);
            }
          })
      } catch (e) {
        console.error(e);
      }
    }
  }

  updatedImage(section: any, field?: any) {
    section.loaded = true
  }
}
