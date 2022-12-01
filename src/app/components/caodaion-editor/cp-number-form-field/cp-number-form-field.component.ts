import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cp-number-form-field',
  templateUrl: './cp-number-form-field.component.html',
  styleUrls: ['./cp-number-form-field.component.scss']
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
}
