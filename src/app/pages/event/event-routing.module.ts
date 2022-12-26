import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventEditComponent } from './event-edit/event-edit.component';
import { EventListComponent } from './event-list/event-list.component';
import { EventDetailsComponent } from './event-details/event-details.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: EventListComponent },
      { path: 'chinh-sua/:eventKey', component: EventEditComponent },
      { path: ':eventKey', component: EventDetailsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventRoutingModule {}
