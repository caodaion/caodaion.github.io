import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaodaionEditorComponent } from './caodaion-editor.component';
import { CpToolbarEditorModule } from '../cp-toolbar-editor/cp-toolbar-editor.module';
import { CaoDaiONPWAContentEditorModule } from '../cp-content-editor/cp-content-editor.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { CpEditorFormControlComponent } from './cp-editor-form-control/cp-editor-form-control.component';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { FormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CpFormFieldComponent } from './cp-input-form-field/cp-input-form-field.component';
import { CpNumberFormFieldComponent } from './cp-number-form-field/cp-number-form-field.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';

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
