import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'cp-editor-form-control',
  templateUrl: './cp-editor-form-control.component.html',
  styleUrls: ['./cp-editor-form-control.component.scss'],
})
export class CpEditorFormControlComponent implements OnInit {
  @Input() renderDocument: any;
  @Output() changeTrigerFormArray = new EventEmitter();
  addressGroup = [
    'country',
    'province',
    'district',
    'ward',
    'village',
    'address',
  ];
  errorMessage: any = undefined;
  errorMessageDialogRef: any;
  contentEditable: any;
  constructor(private matDialog: MatDialog, private authService: AuthService) {}

  ngOnInit(): void {
    this.onChangeControl();
    this.contentEditable = this.authService.contentEditable;
  }
  onChangeControl() {}

  getErrorMessage(formControl: any): String {
    let errorMessage = '';
    if (formControl?.required) {
      errorMessage += formControl?.requiredErrorMessage
        ? formControl?.requiredErrorMessage
        : '';
    }
    return errorMessage;
  }

  getOptionalLabel(formControl: any): String {
    let optionalLabel = '';
    if (formControl?.minLength) {
      optionalLabel += `. Tối thiểu: ${formControl?.minLength} ký tự`;
    }
    if (formControl?.maxLength) {
      optionalLabel += `. Tối đa: ${formControl?.maxLength} ký tự`;
    }
    return optionalLabel;
  }

  getObjectArray(object: any): Array<any> {
    return Object.entries(object);
  }

  onChangeTrigerFormArray(formControl: any) {
    this.changeTrigerFormArray.emit(formControl)
  }

  onAddNewItem(formControl: any, errorMessageDialog?: any): any {
    let keepGoing = true;
    if (formControl?.value?.length > 0) {
      let lastItemControl =
        formControl?.value[formControl?.value?.length - 1]?.control;
      lastItemControl?.forEach((control: any) => {
        if (keepGoing)
          if (control?.required && !control?.value) {
            keepGoing = false;
          }
      });
    }
    if (keepGoing) {
      let addedControl: ShortTextFormFieldModel[] = [];
      formControl?.addTemplate?.forEach((item: any) => {
        let newFormField = new ShortTextFormFieldModel();
        newFormField.type = item.type;
        newFormField.value = item.value;
        newFormField.placeholder = item.placeholder;
        newFormField.required = item.required;
        newFormField.autocomplete = item.autocomplete;
        newFormField.label = item.label;
        newFormField.suffix = item.suffix;
        addedControl.push(newFormField);
      });
      formControl?.value?.push({
        control: addedControl,
      });
    } else {
      this.errorMessage =
        'Hãy nhập đầy đủ thông tin bắt buộc trước khi thêm mới';
      this.errorMessageDialogRef = this.matDialog.open(errorMessageDialog);
    }
  }

  onDeleteItem(formControl: any, index: any) {
    formControl?.value?.splice(index, 1);
  }
}

export class ShortTextFormFieldModel {
  autocomplete?: any;
  label?: any;
  placeholder?: any;
  required?: any;
  type?: any;
  value?: any;
  suffix?: any;
  rows?: any;
}
