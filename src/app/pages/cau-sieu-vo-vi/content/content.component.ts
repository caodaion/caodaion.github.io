import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ShortTextFormFieldModel } from 'src/app/components/caodaion-editor/cp-editor-form-control/cp-editor-form-control.component';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import {
  CaodaionEditorService,
  DocumentModel,
} from 'src/app/shared/services/caodaion-editor/caodaion-editor.service';
import { CauSieuVoViService } from 'src/app/shared/services/cau-sieu-vo-vi/cau-sieu-vo-vi.service';

@Component({
    selector: 'app-content',
    templateUrl: './content.component.html',
    styleUrls: ['./content.component.scss'],
    standalone: false
})
export class ContentComponent implements OnInit {
  so: any;
  cauSieuVoVi: any;
  _id: any;
  errorMessageDialogRef: any;
  errorGroup: any;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  isLoading: boolean = false;
  contentEditable: boolean = false;
  constructor(
    private editorService: CaodaionEditorService,
    private cauSieuVoViService: CauSieuVoViService,
    private authService: AuthService,
    protected route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    protected router: Router,
    private _snackBar: MatSnackBar,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    if (this.authService.currentUser?.role?.includes('administrator')) {
      this._id = undefined;
      this.route.params.subscribe((params) => {
        this._id = params['_id'];
      });
      this.onGetDocument('cau-sieu-vo-vi');
    } else {
      this.router.navigate(['/tac-vu'])
    }
    if (this.authService.currentUser?.role?.includes('administrator')) {
      this.breakpointObserver
        .observe(['(max-width: 600px)'])
        .subscribe((state: BreakpointState) => {
          if (state.matches) {
            this.contentEditable = false;
          } else {
            this.contentEditable = true;
          }
        });
      this._id = undefined;
      this.route.params.subscribe((params) => {
        this._id = params['_id'];
      });
      this.onGetDocument('cau-sieu-vo-vi');
    } else {
      this.router.navigate(['/tac-vu']);
    }
  }

  onGetDocument(documentKey: any): void {
    this.isLoading = true;
    if (this._id) {
      this.cauSieuVoViService
        .getCauSieuVoViById(this._id)
        .subscribe((res: any) => {
          if (res) {
            this.cauSieuVoVi = res.data;
            this.editorService
              .getJSON(this.cauSieuVoVi?.documentKey)
              .subscribe((doc: any) => {
                this.so = doc.data;
                this.so.formGroup = this.cauSieuVoVi?.formGroup;
                this.so.key = this.cauSieuVoVi?.key;
                this.so._id = this.cauSieuVoVi?._id;
                this.isLoading = false;
              });
          }
        },
          (error) => {
            this.isLoading = false;
            console.log(error);
          });
    } else {
      this.editorService.getJSON(documentKey).subscribe((res: any) => {
        this.so = res.data;
        this.isLoading = false;
      });
    }
  }

  onSaveCauSieuVoVi(event: any, modal: any) {
    this.isLoading = true;
    let inValidControlList: any[] = [];
    const inValidControls = (formGroup: any) => {
      formGroup?.forEach((group: any) => {
        group?.control?.forEach((control: any) => {
          let currentGroup = inValidControlList?.find(
            (groupControl: any) => groupControl?.key === group.key
          );
          if (control?.type !== 'formArray') {
            if (control?.required && !control?.value) {
              if (currentGroup) {
                currentGroup.control.push(control);
              } else {
                inValidControlList.push({
                  key: group?.key,
                  title: group?.title,
                  control: [control],
                });
              }
            }
          } else {
            inValidControls(control?.value);
          }
        });
      });
    };
    inValidControls(event?.formGroup);
    if (inValidControlList?.length > 0) {
      this.errorGroup = inValidControlList;
      this.errorMessageDialogRef = this.matDialog.open(modal);
      this.isLoading = false;
    } else {
      let request = new DocumentModel();
      request._id = event._id;
      request.documentKey = event.documentKey;
      request.formGroup = event.formGroup;
      const informationGroup = request.formGroup?.find(
        (item: any) => item.key === 'thong-tin-chung'
      )?.control;
      const namDao = informationGroup?.find(
        (item: any) => item.key === 'nam-dao'
      )?.value;
      const nam = informationGroup?.find(
        (item: any) => item.key === 'nam-am-lich'
      )?.value;
      const thang = informationGroup?.find(
        (item: any) => item.key === 'thang-am-lich'
      )?.value;
      const ngay = informationGroup?.find(
        (item: any) => item.key === 'ngay-am-lich'
      )?.value;
      request.key = this.editorService.generatedSlug(
        `csvv ${namDao} ${nam} ${thang} ${ngay}`
      );
      let local = localStorage.getItem('csvv')
      let list: any;
      if (local) {
        list = JSON.parse(local)
      }
      let req: any;
      req = list
      if (!!list?.data && list.data.length > 0) {
        if (!list?.data?.find((item: any) => item?.key === this._id)) {
          req?.data.push(request)
        } else {
          req.data[list?.data?.findIndex((item: any) => item.key === this._id)]
          req.data[list?.data?.findIndex((item: any) => item.key === this._id)] = request
        }
      } else {
        req = {
          data: [
            request
          ]
        }
      }
      if (this._id) {
        this.cauSieuVoViService
          .updateCauSieuVoVi(req, request?.key)
          .subscribe((res: any) => {
            if (res) {
              this.isLoading = false;
              this.cauSieuVoVi = res.data;
              this.editorService
                .getJSON(this.cauSieuVoVi?.documentKey)
                .subscribe((doc: any) => {
                  this.so = doc.data;
                  this.so.formGroup = this.cauSieuVoVi?.formGroup;
                  this.so.key = this.cauSieuVoVi?.key;
                  this.so._id = this.cauSieuVoVi?._id;
                  this._id = this.so._id;
                  this._snackBar.open('Lưu thành công', 'Tắt', {
                    duration: 5,
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                  });
                });
            } else {
              this.isLoading = false;
            }
          });
      } else {
        this.cauSieuVoViService
          .addCauSieuVoVi(req, request?.key)
          .subscribe((res: any) => {
            if (res) {
              this.isLoading = false;
              this.cauSieuVoVi = res.data;
              this.editorService
                .getJSON(this.cauSieuVoVi?.documentKey)
                .subscribe((doc: any) => {
                  this.so = doc.data;
                  this.so.formGroup = this.cauSieuVoVi?.formGroup;
                  this.so.key = this.cauSieuVoVi?.key;
                  this.so._id = this.cauSieuVoVi?._id;
                  this._id = this.so._id;
                  this._snackBar.open('Lưu thành công', 'Tắt', {
                    duration: 5,
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                  });
                });
            } else {
              this.isLoading = false;
            }
          });
      }
    }
  }

  onChangeTrigerFormArray(event: any) {
    if (event.value) {
      let textValue = event.value
        ?.trim()
        .replace(new RegExp('[,;.\n]', 'g'), '');
      let textArray = textValue.split(new RegExp('[0-9]', 'g'));
      textArray = textArray.filter((el: any) => {
        return !!el && el !== 't';
      });
      let arrayContent: any[] = [];
      let editingGroup = this.so.formGroup.find(
        (item: any) => item.key === event.targetFormGroupKey
      );
      let editingControl = editingGroup.control.find(
        (item: any) => item.key === event.targetFormControlKey
      );

      textArray.forEach((item: any, index: any) => {
        item = item.trim();
        if (
          item.slice(0, 1) === item.slice(0, 1).toLowerCase() &&
          item.slice(0, 1) === 't'
        ) {
          item = item.slice(1);
          item = item.trim();
        }
        arrayContent.push({
          name: item,
          age: parseInt(
            textValue
              .slice(
                textValue.indexOf(item) + item.length + 1,
                textValue.indexOf(textArray[index + 1])
              )
              ?.replace('t', '')
          ),
        });
      });
      arrayContent.forEach((item: any) => {
        if (item?.name && item?.age) {
          let nameField = new ShortTextFormFieldModel();
          let ageField = new ShortTextFormFieldModel();
          nameField.autocomplete = editingControl.addTemplate[0].autocomplete;
          nameField.label = editingControl.addTemplate[0].label;
          nameField.placeholder = editingControl.addTemplate[0].placeholder;
          nameField.required = editingControl.addTemplate[0].required;
          nameField.suffix = editingControl.addTemplate[0].suffix;
          nameField.type = editingControl.addTemplate[0].type;
          nameField.value = item?.name;
          ageField.autocomplete = editingControl.addTemplate[1].autocomplete;
          ageField.label = editingControl.addTemplate[1].label;
          ageField.placeholder = editingControl.addTemplate[1].placeholder;
          ageField.required = editingControl.addTemplate[1].required;
          ageField.suffix = editingControl.addTemplate[1].suffix;
          ageField.type = editingControl.addTemplate[1].type;
          ageField.value = item?.age;
          editingControl.value.push({ control: [nameField, ageField] });
        }
      });
      event.value = '';
    }
  }
}
