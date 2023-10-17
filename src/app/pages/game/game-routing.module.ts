import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './game.component';
import { PurifyComponent } from './purify/purify.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: GameComponent },
      { path: 'purify', component: PurifyComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameRoutingModule { }
