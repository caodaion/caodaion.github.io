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
        path: '',
        loadChildren: () =>
          import('../../pages/home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'kinh',
        loadChildren: () =>
          import('../../pages/kinh/kinh.module').then((m) => m.KinhModule),
      },
      {
        path: 'thu-vien',
        loadChildren: () =>
          import('../../pages/library/library.module').then((m) => m.LibraryModule),
      },
      {
        path: 'thanh-ngon-hiep-tuyen',
        loadChildren: () =>
          import('../../pages/thanh-ngon-hiep-tuyen/thanh-ngon-hiep-tuyen.module').then((m) => m.ThanhNgonHiepTuyenModule),
      },
      {
        path: 'hanh-trinh',
        loadChildren: () =>
          import('../../pages/journey/journey.module').then((m) => m.JourneyModule),
      },
      {
        path: 'english',
        loadChildren: () =>
          import('../../pages/english/english.module').then((m) => m.EnglishModule),
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
