import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { EnglishService } from 'src/app/shared/services/english/english.service';
import { PhoneticService } from 'src/app/shared/services/phonetic/phonetic.service';

@Component({
  selector: 'app-your-vocabulary',
  templateUrl: './your-vocabulary.component.html',
  styleUrls: ['./your-vocabulary.component.scss']
})
export class YourVocabularyComponent implements AfterViewInit {

  currentUser: any = <any>{}
  englishSetting: any;
  googleFormsPath: any;
  editGoogleFormsPath: any;
  englishVocabularies: any;
  isLoadingEnglishData: boolean = false;
  editable: boolean = false;
  isEditting: boolean = false;
  addedData: any = <any>{}
  editToken: any = ''
  syncGoogleFormPath: any;
  saveSyncGoogleFormPath: any;
  synth = window.speechSynthesis;

  @ViewChild('updateContent') updateContent!: any;
  @ViewChild('correctAnswer') correctAnswer!: ElementRef;
  @ViewChild('inCorrectAnswer') inCorrectAnswer!: ElementRef;
  @ViewChild('lose') lose!: ElementRef;
  @ViewChild('almostWin') almostWin!: ElementRef;
  @ViewChild('win') win!: ElementRef;

  constructor(
    protected authService: AuthService,
    private cd: ChangeDetectorRef,
    private phoneticService: PhoneticService
  ) {

  }

  ngAfterViewInit(): void {
    this.authService.getCurrentUser(true).subscribe((res: any) => {
      this.currentUser = res;
      this.englishVocabularies = this.currentUser?.vocabularies?.map((item: any) => {
        return {
          data: item,
          count: 0,
          correct: 0,
          inCorrect: 0,
        }
      })
      const calculateValues = new Promise((resolve: any, reject: any) => {
        this.currentUser?.vocabularyExercises?.forEach((item: any) => {
          const foundItem = this.englishVocabularies?.find((ev: any) => ev?.data?.key === item[0])
          const foundCorrect = this.englishVocabularies?.find((ev: any) => ev?.data?.key === item[0] && ev?.data?.key === item[1])
          const foundInCorrect = this.englishVocabularies?.find((ev: any) => ev?.data?.key === item[0] && ev?.data?.key !== item[1])
          if (foundItem) {
            this.englishVocabularies[this.englishVocabularies.indexOf(foundItem)].count += 1
          }
          if (foundCorrect) {
            this.englishVocabularies[this.englishVocabularies.indexOf(foundItem)].correct += 1
          }
          if (foundInCorrect) {
            this.englishVocabularies[this.englishVocabularies.indexOf(foundItem)].inCorrect += 1
          }
        })
        resolve();
      })
      calculateValues.then(() => {
        this.englishVocabularies = this.englishVocabularies
          ?.sort((a: any, b: any) => {
            if (a?.inCorrect > b?.inCorrect) return -1;
            if (a?.inCorrect < b?.inCorrect) return 1;
            if (a?.count < b?.count) return -1;
            if (a?.count > b?.count) return 1;
            if (a?.data?.text < b?.data?.text) return -1;
            if (a?.data?.text > b?.data?.text) return 1;
            return 1;
          });
        this.cd.detectChanges();
        this.generateTest();
        this.validateItem = <any>{}
      })
      this.cd.detectChanges();
    })
  }

  fetchPhonetic(item: any) {
    const regex = new RegExp(/\(([^)]+)\)/);
    let text = ''
    text = item?.data?.text?.replace(regex, '')
    text = text?.split('/')[0];
    text = text?.split('.')[0];
    this.phoneticService.getPhonetic(text?.toLowerCase())
      .subscribe((res: any) => {
        item.dictionaryInfor = res[0];        
      })
  }

  maxTests: number = 12;
  gotVocabularies: any = <any>[]
  testVocabularies: any = <any>[]

  generateTest() {
    this.validateItem = <any>{}
    this.validatedItems = <any>[]
    this.inValid = false
    this.isFulfilled = false
    this.gotVocabularies = <any>[]
    this.testVocabularies = <any>[]
    this.saveSyncGoogleFormPath = '';
    const getRandomInt = (min: any, max: any) => {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    const testLenght = getRandomInt(1, this.maxTests || 12);
    const getData = new Promise((resolve: any, reject: any) => {
      for (let index = 0; index < testLenght; index++) {
        const randomIndex = getRandomInt(0, this.englishVocabularies.length - 1)
        const gotVocabulary = this.englishVocabularies[randomIndex]
        if (!this.gotVocabularies?.find((gv: any) => gv?.data?.key === gotVocabulary?.data?.key)) {
          this.gotVocabularies.push({ data: gotVocabulary?.data, key: gotVocabulary?.data?.key })
        }
      }
      resolve();
    })
    getData.then(() => {
      const shuffledEnglish = this.gotVocabularies.map((value: any) => ({ value, sort: Math.random() }))
        .sort((a: any, b: any) => a.sort - b.sort)
        .map((item: any) => item?.value);
      const shuffledMean = this.gotVocabularies.map((value: any) => ({ value, sort: Math.random() }))
        .sort((a: any, b: any) => a.sort - b.sort)
        .map((item: any) => item?.value);

      for (let index = 0; index < this.gotVocabularies?.length; index++) {
        this.testVocabularies.push({
          english: { text: shuffledEnglish[index]?.data?.text, key: shuffledEnglish[index]?.key },
          mean: { text: shuffledMean[index]?.data?.mean, key: shuffledMean[index]?.key },
        })
      }
    })

  }

  saveVocabulary() {
    this.syncGoogleFormPath = `https://docs.google.com/forms/d/e/${this.currentUser?.googleFormsId}/viewform`
    this.addedData.key = Date.now()
    const syncToken = [{ key: 'vocabulary', data: this.addedData }]
    this.syncGoogleFormPath += `?${this.currentUser?.setting?.data}=${encodeURIComponent(JSON.stringify(syncToken))}`;
  }

  speak(text: any) {
    const regex = new RegExp(/\(([^)]+)\)/);
    const match = text.match(regex)
    text = text?.replace(regex, '')
    text = text?.replaceAll('/', '. ')
    if (match) {
      text += `. ${text}${match[1]}`
    }
    const utterThis = new SpeechSynthesisUtterance(text);
    utterThis.rate = 1;
    utterThis.pitch = 1;
    this.synth.speak(utterThis);
  }

  validateItem = <any>{}
  validatedItems = <any>[]
  inValid: boolean = false;
  isFulfilled: boolean = false;
  validate(data: any) {
    if (data?.english) {
      this.validateItem.english = data?.english?.key
      this.speak(data?.english?.text)
    }
    if (data?.mean) {
      this.validateItem.mean = data?.mean?.key
    }
    if (this.validateItem.english && this.validateItem.mean) {
      this.validatedItems.push([this.validateItem.english, this.validateItem.mean])
      if (this.validateItem.english === this.validateItem.mean) {
        const english = this.testVocabularies?.find((item: any) => item?.english?.key === this.validateItem.english)
        const mean = this.testVocabularies?.find((item: any) => item?.mean?.key === this.validateItem.mean)
        this.testVocabularies[this.testVocabularies.indexOf(english)].english.correct = true
        this.testVocabularies[this.testVocabularies.indexOf(mean)].mean.correct = true
        this.validateItem = <any>{}
        this.inValid = false
        this.correctAnswer.nativeElement.play()
      } else {
        this.inValid = true
        this.inCorrectAnswer.nativeElement.play()
        setTimeout(() => {
          this.inValid = false
          this.validateItem = <any>{}
        }, 1000);
      }
    }
    this.isFulfilled = this.testVocabularies?.filter((item: any) => item?.english?.correct === true)?.length === this.testVocabularies?.length
    if (this.isFulfilled) {
      this.win.nativeElement.play()
    }
  }

  saveResult() {
    this.saveSyncGoogleFormPath = `https://docs.google.com/forms/d/e/${this.currentUser?.googleFormsId}/viewform`
    this.addedData.key = Date.now()
    const syncToken = [{ key: 'vocabularyExercise', data: this.validatedItems }]
    this.saveSyncGoogleFormPath += `?${this.currentUser?.setting?.data}=${encodeURIComponent(JSON.stringify(syncToken))}`;
  }

  openInGTranslate(item: any) {
    const regex = new RegExp(/\(([^)]+)\)/);
    let text = ''
    text = item?.data?.text?.replace(regex, '')
    text = text?.split('/')[0];
    text = text?.split('.')[0];
    window.open(`https://translate.google.com/details?sl=en&tl=vi&text=${text}&op=translate`, '_blank')
  }
  
  openInCambridge(item: any) {
    const regex = new RegExp(/\(([^)]+)\)/);
    let text = ''
    text = item?.data?.text?.replace(regex, '')
    text = text?.split('/')[0];
    text = text?.split('.')[0];
    window.open(`https://dictionary.cambridge.org/dictionary/english/${text}`, '_blank')
  }
}
