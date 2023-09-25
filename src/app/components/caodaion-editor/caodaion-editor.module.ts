import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaodaionEditorComponent } from './caodaion-editor.component';
import { CpToolbarEditorModule } from '../cp-toolbar-editor/cp-toolbar-editor.module';
import { CaoDaiONPWAContentEditorModule } from '../cp-content-editor/cp-content-editor.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { CpEditorFormControlComponent } from './cp-editor-form-control/cp-editor-form-control.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CpFormFieldComponent } from './cp-input-form-field/cp-input-form-field.component';
import { CpNumberFormFieldComponent } from './cp-number-form-field/cp-number-form-field.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    CaodaionEditorComponent,
    CpEditorFormControlComponent,
    CpFormFieldComponent,
    CpNumberFormFieldComponent,
  ],
  imports: [
    CommonModule,
    CpToolbarEditorModule,
    CaoDaiONPWAContentEditorModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatExpansionModule,
    MatRadioModule,
    MatIconModule,
    MatDividerModule,
    MatBottomSheetModule,
    MatDialogModule,
    RouterModule,
  ],
  exports: [CaodaionEditorComponent],
})
export class CaodaionEditorModule {}
