import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';

import { KinhRoutingModule } from './kinh-routing.module';
import { KinhListComponent } from '../components/kinh-list/kinh-list.component';
import { KinhDetailComponent } from '../components/kinh-detail/kinh-detail.component';
import { ChildHeaderComponent } from "../../../components/child-header/child-header.component";
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    KinhListComponent,
    KinhDetailComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    KinhRoutingModule,
    RouterModule,
    MarkdownModule.forChild(),
    ChildHeaderComponent,
    ChildHeaderComponent,
    MatIconModule
]
})
export class KinhModule { }
