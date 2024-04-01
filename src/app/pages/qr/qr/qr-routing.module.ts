import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QrComponent } from './qr.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: QrComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QRRoutingModule { }
