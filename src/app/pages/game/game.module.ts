import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameRoutingModule } from './game-routing.module';
import { GameComponent } from './game.component';
import { PurifyComponent } from './purify/purify.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
  declarations: [
    GameComponent,
    PurifyComponent
  ],
  imports: [
    CommonModule,
    GameRoutingModule,
    MatGridListModule,
    MatTooltipModule
  ]
})
export class GameModule { }
