import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QrComponent } from './qr.component';
import { QrScannerComponent } from 'src/app/pages/qr/qr-scanner/qr-scanner.component';
import {QrGeneratorComponent} from "../../pages/qr/qr-generator/qr-generator.component";

const routes: Routes = [
  {
    path: '',
    component: QrComponent,
    children: [
      {
        path: 'quet-ma',
        component: QrScannerComponent
      },
      {
        path: 'tao-ma',
        component: QrGeneratorComponent
      },
      {
        path: '',
        redirectTo: 'quet-ma',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QrRoutingModule { }
