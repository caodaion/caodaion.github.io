import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameRoutingModule } from './game-routing.module';
import { GameComponent } from './game.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MarkdownModule } from 'ngx-markdown';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { CpQrScannerModule } from 'src/app/components/cp-qr-scanner/cp-qr-scanner.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { VuonTraiComponent } from './vuon-trai/vuon-trai.component';
import { DaoLamConComponent } from './dao-lam-con/dao-lam-con.component';
import { DetailsComponent } from './dao-lam-con/details/details.component';


@NgModule({
  declarations: [
    GameComponent,
    VuonTraiComponent,
    DaoLamConComponent,
    DetailsComponent
  ],
  imports: [
    CommonModule,
    GameRoutingModule,
    MatGridListModule,
    MatTooltipModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    MarkdownModule,
    FormsModule,
    MatDialogModule,
    CpQrScannerModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatListModule,
    MatSelectModule
  ]
})
export class GameModule { }
