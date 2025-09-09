import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
    selector: 'cp-input-form-field',
    templateUrl: './cp-input-form-field.component.html',
    styleUrls: ['./cp-input-form-field.component.scss'],
    standalone: false
})
export class CpFormFieldComponent implements OnInit {
  @Input() inputFormControl: any;
  @Input() modifierAt: any;
  contentEditable: any;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.contentEditable = this.authService.contentEditable;
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
  getErrorMessage(formControl: any): String {
    let errorMessage = '';
    if (formControl?.required) {
      errorMessage += formControl?.requiredErrorMessage
        ? formControl?.requiredErrorMessage
        : '';
    }
    return errorMessage;
  }

  get modelValue() {
    if (this.modifierAt === 'prevText') return this.inputFormControl.prevText;
    if (this.modifierAt === 'nextText') return this.inputFormControl.nextText;
    return this.inputFormControl.value;
  }
  set modelValue(val: any) {
    if (this.modifierAt === 'prevText') this.inputFormControl.prevText = val;
    else if (this.modifierAt === 'nextText') this.inputFormControl.nextText = val;
    else this.inputFormControl.value = val;
  }
}
