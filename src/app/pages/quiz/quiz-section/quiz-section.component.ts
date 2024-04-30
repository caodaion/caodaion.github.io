import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { QuizService } from 'src/app/shared/services/quiz/quiz.service';

@Component({
  selector: 'app-quiz-section',
  templateUrl: './quiz-section.component.html',
  styleUrls: ['./quiz-section.component.scss']
})
export class QuizSectionComponent implements OnInit {

  quiz = <any>[];
  googleFormsPaths = <any>[];
  sectionKey: any;
  section = <any>{};
  rawSection = <any>{};
  updatedGate = <any>{};
  updatingDataIndex = 0

  @ViewChild('updateContent') updateContent!: any;

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
      this.getSection()
    } else {
      try {
        this.quizService.fetchQuiz()
          .subscribe((res: any) => {
            if (res.status == 200) {
              this.quiz = res.data
              this.getSection()
            }
          })
      } catch (e) {
        console.error(e);
      }
    }
  }

  updatedImage(item: any, event?: any) {
    item.loaded = true
  }

  getSection() {
    this.section = this.quiz?.find((item: any) => item?.key === this.sectionKey)
    this.rawSection = JSON.parse(JSON.stringify(this.quiz?.find((item: any) => item?.key === this.sectionKey)))
  }

  onUpdateGate(gate?: any) {
    this.updatedGate = <any>{}
    if (!gate?.key) {
      gate.key = this.commonService.generatedSlug(gate?.name)
    }
    this.updatedGate.key = gate.key
    this.updatedGate.setting = <any>{}
    this.updatedGate.setting.name = gate.name
    this.section.gates?.push(this.updatedGate)
  }

  updateNewGate() {
    this.updatedGate.key = this.commonService.generatedSlug(this.updatedGate.name)
  }

  onUpdateLesson(gate: any, lesson?: any) {
    if (!gate.lesson) {
      gate.lesson = <any>[]
    }
    const setting = <any>{}
    setting.name = lesson.name
    gate.lesson?.push({ key: this.commonService.generatedSlug(lesson.name), setting: setting })
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
    this.section.gates?.forEach((sg: any) => {
      const foundRawGate = this.rawSection.gates?.find((rsg: any) => rsg.key === sg?.key)
      const updateLesson = (ss: any) => {
        if (ss?.setting?.name) {
          converData({ base: `${sg?.key}.${ss?.key}`, question: 'name', option: 'setting', answer: ss?.setting?.name, type: 'Tên bài học', key: ss?.key })
        }
        if (ss?.setting?.image) {
          converData({ base: `${sg?.key}.${ss?.key}`, question: 'image', option: 'setting', answer: ss?.setting?.image, type: 'Hình ảnh bài học', key: ss?.key })
        }
      }
      if (foundRawGate) {
        sg?.lesson?.forEach((ss: any) => {
          const foundRawLesson = foundRawGate?.lesson?.find((rsl: any) => rsl?.key === ss?.key)
          if (foundRawLesson) {
          } else {
            updateLesson(ss)
          }
        })
      } else {
        if (sg?.setting?.name) {
          converData({ base: sg?.key, question: 'name', option: 'setting', answer: sg?.setting?.name, type: 'Tên cửa', key: sg?.key })
        }
        if (sg?.setting?.description) {
          converData({ base: sg?.key, question: 'description', option: 'setting', answer: sg?.setting?.description, type: 'Mô tả ngắn cửa', key: sg?.key })
        }
        if (sg?.setting?.image) {
          converData({ base: sg?.key, question: 'image', option: 'setting', answer: sg?.setting?.image, type: 'Ảnh bì', key: sg?.key })
        }
        sg?.lesson?.forEach((ss: any) => {
          updateLesson(ss)
        })
      }
    })
    console.log(this.googleFormsPaths);
    this.saveData()
  }

  saveData() {
    this.updatedGate = <any>{}
    if (this.updatingDataIndex < this.googleFormsPaths?.length) {
      const updateContentDialogRef = this.matDialog.open(this.updateContent)
      updateContentDialogRef.disableClose = true
      updateContentDialogRef.afterClosed().subscribe(() => {
        this.updatingDataIndex++
        this.saveData()
      })
    }
  }

  onPress(evt: any) {
    var charCode = evt.charCode;
    if (charCode == 46)
      return false;
    return true;
  }
}
