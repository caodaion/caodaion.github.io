import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagenotfoundComponent } from 'src/app/layouts/pagenotfound/pagenotfound.component';
import { MainComponent } from './main.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'kinh',
        loadChildren: () =>
          import('../../pages/kinh/kinh.module').then((m) => m.KinhModule),
      },
      {
        path: 'thanh-ngon-hiep-tuyen',
        loadChildren: () =>
          import('../../pages/thanh-ngon-hiep-tuyen/thanh-ngon-hiep-tuyen.module').then((m) => m.ThanhNgonHiepTuyenModule),
      },
      { path: '**', pathMatch: 'full', component: PagenotfoundComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
