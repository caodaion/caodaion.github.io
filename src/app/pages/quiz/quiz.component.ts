import { Component, OnInit } from '@angular/core';
import { QuizService } from 'src/app/shared/services/quiz/quiz.service';

@Component({
  selector: 'app-sync',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {

  constructor(public quizService: QuizService) {

  }

  ngOnInit(): void {
  }
}
