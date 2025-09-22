import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { FormsModule } from '@angular/forms';
import { KinhRoutingModule } from './kinh-routing.module';
import { KinhListComponent } from '../components/kinh-list/kinh-list.component';
import { KinhDetailComponent } from '../components/kinh-detail/kinh-detail.component';
import { ChildHeaderComponent } from "../../../components/child-header/child-header.component";
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ButtonShareModule } from "src/app/components/button-share/button-share.module";
import { MatButtonModule } from '@angular/material/button';
import { MatTabGroup, MatTabsModule } from "@angular/material/tabs";
import { KinhInformation } from '../components/kinh-information/kinh-information';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@NgModule({
  declarations: [
    KinhListComponent,
    KinhDetailComponent,
    KinhInformation
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    KinhRoutingModule,
    RouterModule,
    MarkdownModule.forChild(),
    ChildHeaderComponent,
    ChildHeaderComponent,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    ButtonShareModule,
    MatButtonModule,
    MatTabGroup,
    MatTabsModule,
    SharedModule,
    MatDividerModule,
    MatProgressSpinnerModule
]
})
export class KinhModule { }
