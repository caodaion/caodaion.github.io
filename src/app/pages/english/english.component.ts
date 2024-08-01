import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { EnglishService } from 'src/app/shared/services/english/english.service';

@Component({
  selector: 'app-english',
  templateUrl: './english.component.html',
  styleUrls: ['./english.component.scss']
})
export class EnglishComponent implements OnInit {

  englishSetting: any;
  googleFormsPath: any;
  editGoogleFormsPath: any;
  currentUser: any;
  englishVocabularies: any;
  isLoadingEnglishData: boolean = false;
  editable: boolean = false;
  isEditting: boolean = false;
  addedData: any = <any>{}

  constructor(
    private englishService: EnglishService,
    private authService: AuthService,
    private matDialog: MatDialog,
    private commonService: CommonService,
  ) {

  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: (res: any) => {
        this.currentUser = res;
        console.log(res);

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
        this.googleFormsPath += `${this.addedData.editToken}`
        this.googleFormsPath += `&${this.englishSetting?.key}=${encodeURIComponent(this.addedData.key)}`
        this.googleFormsPath += `&${this.englishSetting?.name}=${encodeURIComponent(this.addedData.name)}`
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
}
