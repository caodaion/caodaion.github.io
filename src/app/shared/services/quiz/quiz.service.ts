import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { read, utils } from 'xlsx';
import { SheetService } from '../sheet/sheet.service';
import { CommonService } from '../common/common.service';
import { AuthService } from '../auth/auth.service';


type Mutable<T> = { -readonly [P in keyof T]: T[P] }
@Injectable({
  providedIn: 'root'
})
export class QuizService {
  readonly sheetId = `2PACX-1vSazKGjlmbtJ2frNa2zkHGEwYIV5lt29Gd_9pGI3LX7-tHq8esauUI-OZCr2tfZathkwLfAB6-hlSkd`
  readonly quizWorkbook: any;
  readonly quiz = <any>[];

  constructor(
    private sheetService: SheetService,
    private commonService: CommonService,
    private authService: AuthService
  ) {
  }

  fetchQuiz(): Observable<any> {
    const ref: Mutable<this> = this;
    return new Observable((observable) => {
      const returnData = () => {
        const currentUser = this.authService.getCurrentUser()
        let response = <any>{}
        if (ref.quizWorkbook.SheetNames?.length > 0) {
          ref.quizWorkbook.SheetNames?.forEach((sheetName: any) => {
            const objectKey = this.commonService.generatedSlug(sheetName)
            const quiz = <any>{}
            quiz.key = objectKey
            quiz.name = sheetName
            quiz.xp = 0
            this.sheetService.decodeRawSheetData(ref.quizWorkbook.Sheets[sheetName])
              .subscribe((res: any) => {
                const rawSetting = res?.filter((item: any) => item.base === 'global' && item?.option === 'setting')
                const settingData = <any>{}
                rawSetting?.forEach((setting: any) => {
                  settingData[setting?.question] = setting?.answer
                  if (setting?.question === 'references') {
                    settingData[setting?.question] = JSON.parse(setting?.answer);
                  }
                })
                const gateKeys = [... new Set(res.map((item: any) => item?.base))]?.filter((item: any) => item && item !== 'global' && !item?.includes('.'))
                const gateList = <any>[]
                gateKeys?.forEach((gateKey: any) => {
                  const foundGate = res.filter((item: any) => item.base.includes(gateKey) && item.base.split('.')?.filter((sb: any) => !!sb)?.length == 1)
                  const gateSetting = <any>{}
                  const responseGate = <any>{}
                  foundGate?.filter((item: any) => item?.option === 'setting')?.forEach((gs: any) => {
                    gateSetting[gs?.question] = gs?.answer
                  })
                  const foundGateLesson = res.filter((item: any) => item.base.includes(gateKey) && item.base.split('.')?.filter((sb: any) => !!sb)?.length == 2)
                  const foundGateLessonKeys = [...new Set(foundGateLesson?.map((fgl: any) => fgl.base))]
                  foundGateLessonKeys?.forEach((fglk: any) => {
                    const responeLesson = <any>{}
                    const lessonSetting = <any>{}
                    const foundLesson = res.filter((item: any) => item.base.includes(fglk) && item.base.split('.')?.filter((sb: any) => !!sb)?.length == 2)
                    foundLesson?.filter((item: any) => item?.option === 'setting')?.forEach((ls: any) => {
                      lessonSetting[ls?.question] = ls?.answer
                    })
                    responeLesson.key = fglk.split('.')[1]
                    responeLesson.setting = lessonSetting
                    const foundQuestion = res.filter((item: any) => item.base.includes(`${quiz.key}.${gateKey}.${responeLesson.key}`) && item.base.split('.')?.filter((sb: any) => !!sb)?.length == 3)
                    foundQuestion?.forEach((fq: any) => {
                      const responseQuestion = <any>{}
                      responseQuestion.key = fq?.key
                      responseQuestion.answer = fq?.answer
                      responseQuestion.question = fq?.question
                      if (typeof fq?.option == 'string') {
                        responseQuestion.option = JSON.parse(fq?.option)?.map((po: any) => { return { text: po } })
                      }
                      if (!responeLesson?.questions) {
                        responeLesson.questions = <any>[]
                      }
                      responeLesson.questions.push(responseQuestion)
                      quiz.xp++
                    })
                    if (!responseGate.lesson) {
                      responseGate.lesson = <any>[]
                    }
                    responseGate.lesson?.push(responeLesson)
                  })
                  responseGate.key = gateKey
                  responseGate.setting = gateSetting
                  gateList.push(responseGate)
                })
                quiz.gates = gateList
                if (settingData?.permission?.includes(currentUser?.userName)) {
                  settingData.allowToEdit = true
                }
                quiz.setting = settingData
              })
            ref.quiz.push(quiz)
          })
          response.status = 200
          response.data = ref.quiz
        } else {
          response.status = 4000
        }
        observable.next(response)
        observable.complete()
      }
      if (!ref.quizWorkbook) {
        try {
          this.sheetService.fetchSheet(this.sheetId)
            .subscribe((res: any) => {
              if (res.status == 200) {
                if (res?.workbook) {
                  ref.quizWorkbook = res?.workbook
                  returnData()
                }
              }
            })
        } catch (e) {
          console.error(e);
        }
      } else {
        returnData()
      }
    })
  }
}
