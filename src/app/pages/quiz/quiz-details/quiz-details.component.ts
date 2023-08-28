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
  name: any;
  article: any;
  quizListOfDoc: any;
  isLoading: boolean = false

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((query: any) => {
      this.doc = query['doc']
      this.article = query['article']
    })
    this.getQuizListOfDoc()
  }

  getQuizListOfDoc() {
    this.isLoading = true
    if (this.doc) {
      const foundQuiz = this.quizService.quizList.find((item: any) => item.key === this.doc)
      if (foundQuiz) {
        try {
          this.quizService.getQuizListOfDoc(foundQuiz.googleDocId, this.article)
          .subscribe((res: any) => {
            if (res.code === 200) {
              this.name = res.name
              this.quizListOfDoc = res.data
              console.log(this.quizListOfDoc);
              this.isLoading = false
            }
          })
        } catch(e) {
          console.log(e);
          this.isLoading = false
        }
      }
    }
  }

  checkResult() {
    this.quizListOfDoc.forEach((item: any) => {
      if (item.selected) {
        if (item.selected[0] === item?.answer) {
          item['correct'] = true
        } else {
          item['correct'] = false
        }
      }
    })
  }
}
