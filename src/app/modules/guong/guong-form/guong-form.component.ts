import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { CONSTANT } from 'src/app/shared/constants/constants.constant';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { GuongService } from 'src/app/shared/services/guong/guong.service';

@Component({
  selector: 'app-guong-form',
  templateUrl: './guong-form.component.html',
  styleUrls: ['./guong-form.component.scss'],
})
export class GuongFormComponent implements OnInit {
  @Input('guongRes') guongRes: any;
  guongUser: any;
  syncGoogleFormPath: any;
  addFormFieldDialogRef: any;
  guong = <any>{};
  addedFormField = <any>{};
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  @ViewChild('addFormFieldDialog') addFormFieldDialog!: any;

  constructor(
    private guongService: GuongService,
    private commonService: CommonService,
    private cd: ChangeDetectorRef,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getCurrentUser();
  }

  getCurrentUser() {
    const localStorageData = localStorage.getItem(CONSTANT.guongData);
    if (localStorageData) {
      this.guongUser = localStorageData;
      this.guong.userName = localStorageData;
    }
  }

  updateUserInfo() {
    const splitName = this.guong.name?.trim()?.split(' ');
    let userName = '';
    userName = this.commonService.generatedSlug(
      splitName[splitName?.length - 1]
    );
    splitName.forEach((item: any, index: any) => {
      if (index < splitName.length - 1) {
        userName += `${this.commonService.generatedSlug(item)[0]}`;
      }
    });
    if (this.guong?.birthday) {
      userName += this.guong?.birthday?.split('')?.splice(2, 2)?.join('');
    }
    if (this.guong?.thanhSo) {
      const splitThanhSo = this.guong.thanhSo?.trim()?.split(' ');
      splitThanhSo.forEach((item: any, index: any) => {
        if (index < splitThanhSo.length - 1) {
          userName += `${this.commonService.generatedSlug(item)[0]}`;
        }
      });
    }
    this.guong.userName = userName;
    this.cd.detectChanges();
  }

  saveData() {
    this.syncGoogleFormPath = `https://docs.google.com/forms/d/e/${this.guongRes?.setting?.googleFormsId}/viewform`
    let syncToken = <any>{}
    if (this.guongUser) {
      syncToken = this.guong.data
    } else {
      syncToken = this.guong
      localStorage.setItem(CONSTANT.guongData, this.guong.userName)
    }
    this.syncGoogleFormPath += `?${this.guongRes?.setting?.name}=${encodeURIComponent(this.guong.userName)}`;
    this.syncGoogleFormPath += `&${this.guongRes?.setting?.data}=${encodeURIComponent(JSON.stringify(syncToken))}`;
  }

  addFormField() {
    this.addFormFieldDialogRef = this.matDialog.open(this.addFormFieldDialog)
  }

  saveFormField() {
    if (!this.guong?.formFields || this.guong?.formFields?.length === 0) {
      this.guong.formFields = <any>[]
    }
    this.guong?.formFields?.push({
      key: this.commonService.generatedSlug(this.addedFormField.name),
      name: this.addedFormField.name,
      type: this.addedFormField.type,
    })
    console.log(this.guong?.formFields);
    
  }
}
