import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  selectedIndex = 0
  cols = 0
  correctlyCount = 0
  inCorrectlyCount = 0
  message: any;

  @ViewChild('correctAnswer') correctAnswer!: ElementRef;
  @ViewChild('inCorrectAnswer') inCorrectAnswer!: ElementRef;
  @ViewChild('lose') lose!: ElementRef;
  @ViewChild('almostWin') almostWin!: ElementRef;
  @ViewChild('win') win!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService,
    private breakpointObserver: BreakpointObserver,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((query: any) => {
      this.doc = query['doc']
      this.article = query['article']
    })
    this.getQuizListOfDoc()
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
            this.cols = 1
          } else {
            localStorage.setItem(
              'currentLayout',
              JSON.stringify({
                isHideToolbar: false,
                isHideBottomNavBar: false,
              })
            );
            this.cols = 4
          }
        });
    }, 0)
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
        } catch (e) {
          console.log(e);
          this.isLoading = false
        }
      }
    }
  }

  checkAnswer(item: any) {
    if (item.selected === item.answer) {
      item.correctly = true
      if (this.correctAnswer) {
        this.correctAnswer.nativeElement.play()
      }
    } else {
      item.correctly = false
      if (this.correctAnswer) {
        this.inCorrectAnswer.nativeElement.play()
      }
    }
  }

  onNext() {
    this.selectedIndex++
    this.correctlyCount = this.quizListOfDoc.filter((item: any) => item.correctly === true)?.length
    this.inCorrectlyCount = this.quizListOfDoc.filter((item: any) => item.correctly === false)?.length
    if (this.quizListOfDoc.filter((item: any) => item.correctly === undefined || item.correctly === null)?.length === 0) {
      if (this.correctlyCount >= this.inCorrectlyCount && this.correctlyCount < this.quizListOfDoc.length) {
        this.almostWin.nativeElement.play()
        this.message = 'Còn chút nữa thôi'
      }
      if (this.correctlyCount < this.inCorrectlyCount) {
        this.lose.nativeElement.play()
        this.message = 'Cố gắng lần sau bạn nhé'
      }
      if (this.correctlyCount === this.quizListOfDoc.length) {
        this.win.nativeElement.play()
        this.message = 'Chúc mừng bạn'
      }
    }
  }

  onCompleted() {
    const path = location.pathname.split('/')
    path.pop()
    this.router
      .navigate([path.join('/')]);
  }
}
