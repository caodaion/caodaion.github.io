import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { DecimalPipe } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { QuizService } from 'src/app/shared/services/quiz/quiz.service';

type Mutable<T> = { -readonly [P in keyof T]: T[P] }

@Component({
  selector: 'app-quiz-lesson',
  templateUrl: './quiz-lesson.component.html',
  styleUrls: ['./quiz-lesson.component.scss']
})
export class QuizLessonComponent implements OnInit, OnDestroy {

  quiz = <any>[];
  googleFormsPaths = <any>[];
  sectionKey: any;
  gateKey: any;
  lessonKey: any;
  section = <any>{};
  gate = <any>{};
  lesson = <any>{};
  readonly rawSection = <any>{};
  readonly rawGate = <any>{};
  readonly rawLesson = <any>{};
  answeredIndex = 0
  updatingDataIndex = 0
  correctlyCount: number = 0
  inCorrectlyCount: number = 0
  message: any;
  isPhone: any;

  @ViewChild('updateContent') updateContent!: any;
  @ViewChild('correctAnswer') correctAnswer!: ElementRef;
  @ViewChild('inCorrectAnswer') inCorrectAnswer!: ElementRef;
  @ViewChild('lose') lose!: ElementRef;
  @ViewChild('almostWin') almostWin!: ElementRef;
  @ViewChild('win') win!: ElementRef;
  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService,
    private commonService: CommonService,
    private matDialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private decimal: DecimalPipe,
    private router: Router
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
            this.isPhone = state.matches
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
    const ref: Mutable<this> = this;
    ref.rawSection = JSON.parse(JSON.stringify(this.quiz?.find((item: any) => item?.key === this.sectionKey)))
    this.section = JSON.parse(JSON.stringify(ref.rawSection))
    ref.rawGate = JSON.parse(JSON.stringify(this.section?.gates?.find((item: any) => item?.key === this.gateKey)))
    this.gate = JSON.parse(JSON.stringify(ref.rawGate))
    ref.rawLesson = JSON.parse(JSON.stringify(this.gate?.lesson?.find((item: any) => item?.key === this.lessonKey)))
    this.lesson = JSON.parse(JSON.stringify(ref.rawLesson))    
    if (!this.section?.setting?.allowToEdit) {
      this.reRenderList(this.lesson?.questions, this.rawLesson?.questions)
    }
    this.lesson?.questions?.forEach((item: any) => {
      this.reRenderList(item?.option, item?.option)
    })
  }

  reRenderList(array: any, rawArray: any) {
    let currentIndex = array.length;
    while (currentIndex != 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], rawArray[randomIndex]] = [
        rawArray[randomIndex], array[currentIndex]];
    }
  }

  calculatedProgressBar() {
    let progressPercent = 0
    progressPercent = ((this.answeredIndex) / this.lesson.questions?.length) * 100
    return `${progressPercent}%`
  }

  updateQuestion() {
    if (!this.lesson.questions) {
      this.lesson.questions = <any>[]
    }
    const newQuestion = <any>{
      setting: <any>{}
    }
    this.lesson.questions?.push(newQuestion)
  }

  updateAnswer(item: any) {
    if (!item.option) {
      item.option = <any>[]
    }
    const newOption = <any>{}
    item.option?.push(newOption)
  }

  saveNewData() {
    this.updatingDataIndex = 0
    this.googleFormsPaths = <any>[]
    const converData = (params: any) => {
      let path = `https://docs.google.com/forms/d/e/${this.section?.setting?.googleFormsId}/viewform`
      if (params.base) {
        path += `?${this.section?.setting['base']}=${encodeURIComponent(params.base)}`
      }
      if (params.key) {
        path += `&${this.section?.setting['key']}=${encodeURIComponent(params.key)}`
      }
      if (params.question) {
        path += `&${this.section?.setting['question']}=${encodeURIComponent(params.question)}`
      }
      if (params.option) {
        path += `&${this.section?.setting['option']}=${encodeURIComponent(params.option)}`
      }
      if (params.answer) {
        path += `&${this.section?.setting['answer']}=${encodeURIComponent(params.answer)}`
      }
      this.googleFormsPaths.push({ path, dialogData: params })
    }
    if (this.lesson?.setting?.references) {
      if (this.rawLesson?.setting?.references !== this.lesson?.setting?.references) {
        converData({ base: `${this.gateKey}.${this.lessonKey}`, key: `${this.gateKey}.${this.lessonKey}`, question: 'references', answer: this.lesson?.setting?.references, option: 'setting' })
      }
    }

    this.lesson?.questions?.forEach((item: any) => {
      const foundQuestion = this.rawLesson?.questions?.find((lq: any) => lq?.key === item?.key)
      if (!foundQuestion) {
        converData({ base: `${this.sectionKey}.${this.gateKey}.${this.lessonKey}`, key: item?.key, question: item?.question, answer: item?.answer, option: JSON.stringify(item?.option?.map((io: any) => io?.text)?.filter((io: any) => !!io)) })
        if (item?.setting?.image) {
          converData({ base: `${this.sectionKey}.${this.gateKey}.${this.lessonKey}`, key: item?.key, question: 'image', answer: item?.setting?.image, option: 'setting' })
        }
        if (item?.setting?.youtube) {
          converData({ base: `${this.sectionKey}.${this.gateKey}.${this.lessonKey}`, key: item?.key, question: 'youtube', answer: item?.setting?.youtube, option: 'setting' })
        }
      }
    });
    this.saveData()
  }

  saveData() {
    if (this.updatingDataIndex < this.googleFormsPaths?.length) {
      const updateContentDialogRef = this.matDialog.open(this.updateContent)
      updateContentDialogRef.disableClose = true
      updateContentDialogRef.afterClosed().subscribe(() => {
        this.updatingDataIndex++
        this.saveData()
      })
    }
  }

  checkAnswer(item: any) {
    item.correctly = item?.selected == item?.answer
    if (item.correctly) {
      if (this.correctAnswer) {
        this.correctAnswer.nativeElement.play()
      }
    } else {
      if (this.inCorrectAnswer) {
        this.inCorrectAnswer.nativeElement.play()
      }
    }
  }

  onNext() {
    if (this.section?.setting?.allowToEdit) {
      if (!this.lesson.questions[this.answeredIndex + 1]) {
        this.updateQuestion()
      }
    }
    this.answeredIndex = this.answeredIndex + 1
    this.correctlyCount = this.lesson.questions.filter((item: any) => item.correctly === true)?.length
    this.inCorrectlyCount = this.lesson.questions.filter((item: any) => item.correctly === false)?.length
    if (this.lesson.questions.filter((item: any) => item.correctly === undefined || item.correctly === null)?.length === 0) {
      if (this.correctlyCount >= this.inCorrectlyCount && this.correctlyCount < this.lesson.questions.length) {
        this.almostWin.nativeElement.play()
        this.message = 'Còn chút nữa thôi'
      }
      if (this.correctlyCount < this.inCorrectlyCount) {
        this.lose.nativeElement.play()
        this.message = 'Cố gắng lần sau bạn nhé'
      }
      if (this.correctlyCount === this.lesson.questions.length) {
        this.win.nativeElement.play()
        this.message = 'Chúc mừng bạn'
      }
    }
  }

  onUpdateQuestion(item: any, index: any) {
    item.key = `${this.sectionKey}.${this.gateKey}.${this.lessonKey}.${this.decimal.transform(index, '3.0-0')}`
  }

  onCompleted() {
    setTimeout(() => {
      const path = location.pathname.split('/')
      path.pop()
      path.pop()
      this.router
        .navigate([path.join('/')]);
    }, 0)
  }

  onViewReferences() {
    window.open(`${this.lesson.setting.references}`, '_blank')
  }

  updatedImage(item: any, event?: any) {
    item.loaded = true
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      this.section = <any>{}
      this.lesson = <any>{}
      this.gate = <any>{}
    }, 0)
  }
}
