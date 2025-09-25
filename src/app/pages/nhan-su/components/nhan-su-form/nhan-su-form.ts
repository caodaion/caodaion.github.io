import { Component, inject, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CAODAI_TITLE } from 'src/app/shared/constants/master-data/caodai-title.constant';
import { MatRadioModule } from '@angular/material/radio';
import { NhanSu, Journey, JoinDate, convertNhanSuFormData } from 'src/app/shared/interfaces/nhan-su';
import { FormsModule, UntypedFormGroup, UntypedFormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_FORMATS, DateAdapter, MatNativeDateModule, NativeDateAdapter } from '@angular/material/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { Platform } from '@angular/cdk/platform';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { start } from 'repl';
import { map, startWith } from 'rxjs/operators';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { Observable } from 'rxjs';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export class CustomDateAdapter extends NativeDateAdapter {
  override format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'DD/MM/YYYY') {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear().toString();
      return `${day}/${month}/${year}`;
    }
    return super.format(date, displayFormat);
  }

  override parse(value: string): Date | null {
    if (typeof value === 'string' && value.length > 0) {
      const str = value.trim();
      const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
      const match = str.match(dateRegex);

      if (match) {
        const day = parseInt(match[1], 10);
        const month = parseInt(match[2], 10) - 1; // Month is 0-indexed
        const year = parseInt(match[3], 10);

        const date = new Date(year, month, day);
        if (date.getFullYear() === year &&
          date.getMonth() === month &&
          date.getDate() === day) {
          return date;
        }
      }
    }
    return null;
  }
}

@Component({
  selector: 'app-nhan-su-form',
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatRadioModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatIconModule,
    MatTableModule,
    MatAutocompleteModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: DateAdapter, useClass: CustomDateAdapter, deps: [MAT_DATE_LOCALE, Platform] },
  ],
  templateUrl: './nhan-su-form.html',
  styleUrl: './nhan-su-form.scss'
})
export class NhanSuForm implements OnInit {

  commonService = inject(CommonService);
    snackBar = inject(MatSnackBar);

  @Input() type: '4-hang-chuc-sac' | 'chuc-viec-cac-ban-phong' = '4-hang-chuc-sac';
  allTitles = CAODAI_TITLE.data;
  leSanhTitleIndex = CAODAI_TITLE.data?.findIndex(title => title.key === 'le-sanh');
  chucSacTitles = CAODAI_TITLE.data?.slice(this.leSanhTitleIndex, CAODAI_TITLE.data?.length);
  filteredChucSacTitles: Observable<any[]> = <any>[];

  saveData: NhanSu = {
    id: '',
    name: '',
    gender: 'male',
  };
  saveForm: any;

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.saveForm = new UntypedFormGroup({
      name: new UntypedFormControl(this.saveData.name, [Validators.required]),
      gender: new UntypedFormControl(this.saveData.gender, [Validators.required]),
      title: new UntypedFormControl(this.saveData.title),
      birthDate: new UntypedFormControl(this.saveData.birthDate),
    });

    // Filter titles based on user input
    this.filteredChucSacTitles = this.saveForm.get('title')?.valueChanges.pipe(
      startWith(''),
      map((value: any) => {
        // Accept both string and object values for autocomplete
        let searchTerm = '';
        if (typeof value === 'string') {
          searchTerm = value.toLowerCase();
        } else if (value && typeof value === 'object' && value.name) {
          searchTerm = value.name.toLowerCase();
        }
        return this.chucSacTitles.filter(title => {
          return this.commonService.generatedSlug(title.name).includes(this.commonService.generatedSlug(searchTerm));
        });
      })
    );
  }

  displayTitle(title: any) {
    const foundTitle = CAODAI_TITLE.data?.find(t => t.key === title);
    return foundTitle ? foundTitle.name : title;
  }

  save() {
    this.saveForm.markAllAsTouched();
      if (this.saveForm.invalid) {
        this.snackBar.open('Vui lòng điền đầy đủ thông tin bắt buộc.', 'Đóng', {
          duration: 3000,
          verticalPosition: 'bottom',
          panelClass: ['mat-toolbar', 'mat-warn']
        });
        return;
    }
    console.log('Saving form with data:', this.saveForm.value);
    this.saveData = convertNhanSuFormData(this.saveForm.value);
    console.log('Converted NhanSu data:', this.saveData);
  }

  cancel() {
    console.log('Form cancelled');
    // Implement cancel logic here
    this.saveForm.reset();
  }
}