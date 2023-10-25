import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameRoutingModule } from './game-routing.module';
import { GameComponent } from './game.component';
import { PurifyComponent } from './purify/purify.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PurifyDetailsComponent } from './purify-details/purify-details.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MarkdownModule } from 'ngx-markdown';
import { FormsModule } from '@angular/forms';
import { PurifyCardComponent } from './purify/purify-card/purify-card.component';
import { MatDialogModule } from '@angular/material/dialog';
import { QRCodeModule } from 'angularx-qrcode';
import { CpQrScannerModule } from 'src/app/components/cp-qr-scanner/cp-qr-scanner.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';


@NgModule({
  declarations: [
    GameComponent,
    PurifyComponent,
    PurifyDetailsComponent,
    PurifyCardComponent
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
    QRCodeModule,
    CpQrScannerModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatListModule
  ]
})
export class GameModule { }
