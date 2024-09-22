import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DienThoPhatMauComponent } from './dien-tho-phat-mau.component';
import { RouterModule, Routes } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PriceComponent } from './price/price.component';
import { SharedModule } from "../../shared/shared.module";
import { MatSelectModule } from '@angular/material/select';
import { SearchPricePipe } from './search-price/search-price.pipe';
import { BillComponent } from './bill/bill.component';
import { SearchDataPipe } from './search-data/search-data.pipe';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { ReportComponent } from './report/report.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE } from '@angular/material/core';


const routes: Routes = [
  {
    path: '',
    component: DienThoPhatMauComponent
  }
];

@NgModule({
  declarations: [
    DienThoPhatMauComponent,
    PriceComponent,
    SearchPricePipe,
    BillComponent,
    SearchDataPipe,
    ReportComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatTabsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatProgressBarModule,
    SharedModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatDialogModule,
    MatDatepickerModule,
    ReactiveFormsModule
  ],
  exports: [
    SearchPricePipe
  ],
  providers: [
    {
      provide: MAT_DATE_LOCALE, useValue: 'vi-VN'
    }
  ]
})
export class DienThoPhatMauModule { }
