import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventEditComponent } from './event-edit/event-edit.component';
import { EventListComponent } from './event-list/event-list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: EventListComponent },
      { path: ':eventKey', component: EventEditComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventRoutingModule {}
