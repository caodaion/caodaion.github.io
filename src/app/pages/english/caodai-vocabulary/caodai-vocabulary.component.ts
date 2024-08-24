import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { EnglishService } from 'src/app/shared/services/english/english.service';
import { PhoneticService } from 'src/app/shared/services/phonetic/phonetic.service';

@Component({
  selector: 'app-caodai-vocabulary',
  templateUrl: './caodai-vocabulary.component.html',
  styleUrls: ['./caodai-vocabulary.component.scss']
})
export class CaodaiVocabularyComponent implements OnInit {

  englishSetting: any;
  googleFormsPath: any;
  editGoogleFormsPath: any;
  currentUser: any;
  englishVocabularies: any;
  isLoadingEnglishData: boolean = false;
  editable: boolean = false;
  isEditting: boolean = false;
  addedData: any = <any>{}
  editToken: any = ''
  synth = window.speechSynthesis;

  constructor(
    private englishService: EnglishService,
    private authService: AuthService,
    private matDialog: MatDialog,
    private commonService: CommonService,
    private phoneticService: PhoneticService
  ) {

  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: (res: any) => {
        this.currentUser = res;
      },
      error: (error: any) => {
        console.log(error);
      },
      complete: () => {
        console.info('complete')
        this.fetchEnglishData()
      }
    })
  }

  fetchEnglishData() {
    this.isLoadingEnglishData = true
    if (this.englishService.englishSetting) {
      this.englishSetting = this.englishService.englishSetting
      this.englishVocabularies = this.englishService.english
      this.isLoadingEnglishData = false
    }
    this.englishService.fetchEnglishData()
      .subscribe({
        next: (res: any) => {
          if (res.status === 200) {
            this.isLoadingEnglishData = false
            this.englishSetting = res?.setting
            this.englishVocabularies = res?.data
            this.englishVocabularies?.forEach((item: any) => {
              if (item?.data) {
                item.data = JSON.parse(item?.data);
              }
            })
            this.englishVocabularies = this.englishVocabularies?.sort((a: any, b: any) => a?.data?.text < b?.data?.text ? -1 : 1)
            this.editable = this.englishSetting.users?.includes(this.currentUser?.userName)            
          }
        },
        error: (error: any) => {
          console.log(error);
          this.isLoadingEnglishData = false
        },
        complete: () => {
          console.info('complete')
          this.isLoadingEnglishData = false
        }
      })
  }

  generateKey() {
    return this.commonService.generatedSlug(`${this.addedData?.text || ''} ${this.addedData?.mean}`)
  }

  onUpdateData(submitDialog: any, isEditting: boolean = false) {
    if (this.englishSetting?.googleFormsId) {
      if (!isEditting) {
        this.addedData.key = encodeURIComponent(this.generateKey())
        this.googleFormsPath = `https://docs.google.com/forms/d/e/${this.englishSetting?.googleFormsId}/viewform`
        this.googleFormsPath += `?${this.englishSetting?.key}=${encodeURIComponent(this.generateKey())}`
        this.googleFormsPath += `&${this.englishSetting?.data}=${encodeURIComponent(JSON.stringify(this.addedData))}`
        const submitDialogRef = this.matDialog.open(submitDialog);
      } else {
        this.googleFormsPath = `https://docs.google.com/forms/d/e/${this.englishSetting?.googleFormsId}/viewform`
        this.googleFormsPath += `${this.editToken}`
        this.googleFormsPath += `&${this.englishSetting?.key}=${encodeURIComponent(this.generateKey())}`
        this.googleFormsPath += `&${this.englishSetting?.data}=${encodeURIComponent(JSON.stringify(this.addedData))}`
        const submitDialogRef = this.matDialog.open(submitDialog);
        submitDialogRef?.afterClosed().subscribe(() => this.onClear())
      }
    }
  }

  onClear() {
    this.addedData = <any>{}
    this.googleFormsPath = ''
    this.editGoogleFormsPath = ''
    this.isEditting = false;
  }

  updateEditToken(tokenDialog: any) {
    const editKey = () => {
      let newKey = ''
      this.addedData.key?.split('-')?.forEach((v: any) => {
        if (v?.length > 1) {
          newKey += `${v[0]}${v[v?.length - 1]}`
        } else {
          newKey += v
        }
        newKey += '-'
      })
      newKey += this.addedData.editToken?.match(/edit[0-9]/)
      return newKey
    }
    const editToken = () => {
      return this.addedData.editToken?.split(this.addedData.editToken?.match(/edit[0-9][=]/))[1]
    }
    if (this.addedData.key && this.addedData.editToken) {
      this.editGoogleFormsPath = `https://docs.google.com/forms/d/e/${this.englishSetting?.googleFormsId}/viewform`
      this.editGoogleFormsPath += `?${this.englishSetting?.key}=${encodeURIComponent(editKey())}`
      this.editGoogleFormsPath += `&${this.englishSetting?.data}=${encodeURIComponent(editToken())}`
      const tokenDialogRef = this.matDialog.open(tokenDialog);
      tokenDialogRef?.afterClosed().subscribe(() => this.onClear());
    }
  }

  onEdit(item: any) {
    this.isEditting = true;
    this.addedData = item?.data
    this.editToken = item?.editToken
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
}
