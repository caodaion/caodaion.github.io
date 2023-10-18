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


@NgModule({
  declarations: [
    GameComponent,
    PurifyComponent,
    PurifyDetailsComponent
  ],
  imports: [
    CommonModule,
    GameRoutingModule,
    MatGridListModule,
    MatTooltipModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class GameModule { }
