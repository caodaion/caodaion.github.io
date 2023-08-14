import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuizService } from 'src/app/shared/services/quiz/quiz.service';

@Component({
  selector: 'app-quiz-details',
  templateUrl: './quiz-details.component.html',
  styleUrls: ['./quiz-details.component.scss']
})
export class QuizDetailsComponent implements OnInit {

  doc: any;

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((query: any) => {
      this.doc = query['doc']
    })
    this.getQuizListOfDoc()
  }

  getQuizListOfDoc() {
    if (this.doc) {
      const foundQuiz = this.quizService.quizList.find((item: any) => item.key === this.doc)
      if (foundQuiz) {
        this.quizService.getQuizListOfDoc(foundQuiz.googleDocId)
        .subscribe((res: any) => {
          console.log(res);

        })
      }
    }
  }
}
