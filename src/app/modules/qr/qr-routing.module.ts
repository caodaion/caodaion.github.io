import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QrComponent } from './qr.component';
import { QrScannerComponent } from 'src/app/pages/qr/qr/qr-scanner/qr-scanner.component';

const routes: Routes = [
  {
    path: '',
    component: QrComponent,
    children: [
      {
        path: '',
        component: QrScannerComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QrRoutingModule { }
