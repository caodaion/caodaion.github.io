import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'cp-input-form-field',
  templateUrl: './cp-input-form-field.component.html',
  styleUrls: ['./cp-input-form-field.component.scss'],
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
}
