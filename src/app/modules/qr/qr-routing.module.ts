import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QrComponent } from './qr.component';
import { QrScannerComponent } from 'src/app/pages/qr/qr-scanner/qr-scanner.component';
import {QrGeneratorComponent} from "../../components/qr-generator/qr-generator.component";

const routes: Routes = [
  {
    path: '',
    component: QrComponent,
    children: [
      {
        path: 'quet-ma',
        loadChildren: () => import('../../pages/qr/qr-scanner/qr-scanner.module').then((m) => m.QrScannerModule),
      },
      {
        path: 'tao-ma',
        loadChildren: () => import('../../components/qr-generator/qr-generator.module').then((m) => m.QrGeneratorModule),
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
