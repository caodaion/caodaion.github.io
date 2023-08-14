import { Component, OnInit } from '@angular/core';
import { QuizService } from 'src/app/shared/services/quiz/quiz.service';

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.scss']
})
export class QuizListComponent implements OnInit {

  quizList: any;

  constructor(private quizService: QuizService) {

  }

  ngOnInit(): void {
    this.getQuizList()
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
