import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'cp-number-form-field',
    templateUrl: './cp-number-form-field.component.html',
    styleUrls: ['./cp-number-form-field.component.scss'],
    standalone: false
})
export class CpNumberFormFieldComponent implements OnInit {
  @Input() inputFormControl: any;
  @Input() modifierAt: any;
  constructor() { }

  ngOnInit(): void {
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
