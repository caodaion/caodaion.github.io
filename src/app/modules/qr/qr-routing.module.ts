import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QrComponent } from './qr.component';

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
        loadChildren: () => import('../../pages/qr/qr-generator/qr-generator.module').then((m) => m.QrGeneratorModule),
      },
      {
        path: ':url',
        loadChildren: () => import('../../pages/qr/qr/qr.module').then((m) => m.QrModule),
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
