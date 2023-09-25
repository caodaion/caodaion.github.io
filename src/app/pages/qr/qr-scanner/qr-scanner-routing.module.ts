import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {QrScannerComponent} from "./qr-scanner.component";

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: QrScannerComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QRScannerRoutingModule { }
